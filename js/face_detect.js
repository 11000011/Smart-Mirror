window.onload = function() {

  var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]),
  video = document.getElementById('video'),
  detector;

  //function for checking if there is error in streaming of video or not
  function init(){
    try {
      compatibility.getUserMedia({video: true}, function(stream) {
        try {
          video.src = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          video.src = stream;
        }
        compatibility.requestAnimationFrame(play);
      }, function (error) {
        alert('WebRTC not available');
      });
    } 
    catch (error) {
      alert(error);
    }
  }


  function check(){
    //function for checking the presence of face (returns YES or NO)
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {

      //Prepare the detector once the video dimensions are known:
      if (!detector) {
        var width = ~~(60 * video.videoWidth / video.videoHeight);
        var height  =60;
        detector = new objectdetect.detector(width, height, 1.1, objectdetect.frontalface_alt);
      }

      // Perform the actual detection:
      var coords = detector.detect(video, 1);
      if (coords[0]) {

        console.log("YES");
        //If there is a face you will be in this loop, otherwise it keeps checking
        //Can call the Microsoft API from here

      } 
      else {
        console.log("No");
      }
    }
  }

  init();

  //function playing the video and check for face
  function play() {
    compatibility.requestAnimationFrame(play);
    if (video.paused) video.play();

    check();
  }
};
