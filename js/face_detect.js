window.onload = function() {

  var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]),
  video = document.getElementById('video'),
  glasses = document.getElementById('glasses'),
  detector;

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
  } catch (error) {
    alert(error);
  }

  function play() {
    compatibility.requestAnimationFrame(play);
    if (video.paused) video.play();


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

       /* var coord = coords[0];
        coord = smoother.smooth(coord);
        // Rescale coordinates from detector to video coordinate space:
        coord[0] *= video.videoWidth / detector.canvas.width;
        coord[1] *= video.videoHeight / detector.canvas.height;
        coord[2] *= video.videoWidth / detector.canvas.width;
        coord[3] *= video.videoHeight / detector.canvas.height;

        var canvas = document.getElementById("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video , 0 , 0 , video.videoWidth , video.videoHeight , coord[0] , coord[1] , coord[2] , coord[3]);
        var dataURL = canvas.toDataURL();
        console.log(dataURL);*/

      } else {
        var opacity = glasses.style.opacity - 0.2;
        glasses.style.opacity = opacity > 0 ? opacity : 0;
      }
    }
  }

  [].slice.call(document.getElementById('list').children).forEach(function(e) {
    e.addEventListener('click', function() {
      glasses.src = e.src;
    }, false);
  });
};

