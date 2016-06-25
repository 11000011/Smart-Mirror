var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]);
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');

var im1, im2, im3;

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

function play() {
  compatibility.requestAnimationFrame(play);
  if (video.paused) video.play();
}

$(document).ready(function() {
  init();
  play();
});

function makeblob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(',');
    var contentType = parts[0].split(':')[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], {
      type: contentType
    });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

//$('#b1').onClick(function() {
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  //var ctx = canvas.getContext('2d');
  //ctx.drawImage(video, 0, 0);
  //im1 = makeblob(canvas.toDataURL("image/png"))
//});

//$('#b2').onClick(function() {
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  //var ctx = canvas.getContext('2d');
  //ctx.drawImage(video, 0, 0);
  //im2 = makeblob(canvas.toDataURL("image/png"))
//});

//$('#b3').onClick(function() {
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  //var ctx = canvas.getContext('2d');
  //ctx.drawImage(video, 0, 0);
  //im3 = makeblob(canvas.toDataURL("image/png"))
//});

//$('#submit').onClick(function() {
  //console.log("submit");
//});
