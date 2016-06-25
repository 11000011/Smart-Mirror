var smoother = new Smoother([0.9999999, 0.9999999, 0.999, 0.999], [0, 0, 0, 0]);
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');

var im1, im2, im3;
var link;

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
  $.ajax({
    url: "https://accounts.google.com/o/oauth2/device/code",
    type: "POST",
    data: {
      client_id: keys.clientId,
      scope: ["https://www.googleapis.com/auth/calendar.readonly"]
    },
    dataType: "json"
  }).done(function(result) {
    $("#google").html(result.user_code);
    link = result.device_code;
  });
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

$('#b1').click(function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  im1 = makeblob(canvas.toDataURL("image/png"))
});

$('#b2').click(function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  im2 = makeblob(canvas.toDataURL("image/png"))
});

$('#b3').click(function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  im3 = makeblob(canvas.toDataURL("image/png"))
});

$('#submit').click(function() {
  console.log("submit");
  $('#message').html("Please Wait...");
  $('#startpage').hide();
  $('#finalpage').show();
  var name = $("#exampleName").html();
  var pushkey = $("#pushKey").html();
  var refreshKey;
  var personId;
  var result;
  $.ajax({
    url: "https://www.googleapis.com/oauth2/v4/token",
    data: {
      client_id: keys.clientId,
      client_secret: keys.clientSecret,
      code: link,
      grant_type: "http://oauth.net/grant_type/device/1.0"
    },
    type: "POST",
    dataType: "json",
    async: false
  }).done(function(result) {
    refreshKey = result.refresh_token
  });
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/persons",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
    data: "{\"name\": \"" + name + "\",\n\"userData\": \"User\"\n}",
    async: false
  }).done(function(json) {
    personId = json.personId;
  });
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/persons/" + personId + "/persistedFaces",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
    // The DataURL will be something like "data:image/png;base64,{image-data-in-base64}"
    data: im1,
    processData: false,
    async: false
  })
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/persons/" + personId + "/persistedFaces",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
    // The DataURL will be something like "data:image/png;base64,{image-data-in-base64}"
    data: im2,
    processData: false,
    async: false
  });
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/persons/" + personId + "/persistedFaces",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
    // The DataURL will be something like "data:image/png;base64,{image-data-in-base64}"
    data: im3,
    processData: false,
    async: false
  });
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/train",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
    async: false
  });
  result = {
    "name": name,
    "userId": personId,
    "pushKey": pushkey,
    "refreshKey": refreshKey
  };
  $.get("users.json", function(json) {
    users = (json);
    users.push(result);
    $('#message').html('Please paste this into the file called <code>users.json</code>:\n<pre><code>' + JSON.stringify(users, null, 2) + '</code></pre>');
  });
});
