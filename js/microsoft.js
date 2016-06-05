var found = false;
function getData(c) {
  console.log("getData called");
  var dataURL = c.toDataURL("image/png");
  makeblob = function(dataURL) {
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
  $.ajax({
    url: "https://api.projectoxford.ai/face/v1.0/detect",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "f6e2bf72a27f447f9d6bb5eb8a33c53b");
    },
    type: "POST",
      // The DataURL will be something like "data:image/png;base64,{image-data-in-base64}"
    data: makeblob(dataURL),
    processData: false
  })
  .done(function(json) {
    //display data
    console.log(json);
    var faceId = json[0].faceId;
    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/identify",
      beforeSend: function(xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "f6e2bf72a27f447f9d6bb5eb8a33c53b");
      },
      type: "POST",
      data: "{\"personGroupId\": \"smartmirror\",\n\"faceIds\": [\"" + faceId + "\"],\n\"maxNumOfCandidatesReturned\": 1\n}"
    }).done(function(data) {
      console.log(data);
      var personId = data[0].candidates[0].personId;
      if ( data[0].candidates[0].confidence > 0.65 ) {
        $.ajax({
          url: "https://api.projectoxford.ai/face/v1.0/persongroups/smartmirror/persons/" + personId,
          beforeSend: function(xhrObj) {
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "f6e2bf72a27f447f9d6bb5eb8a33c53b");
          },
          type: "GET",
        }).done(function(person) {
          console.log(person.name + " - " + person.userData);
          found = true;
        });
      }
    }).fail(function(xhr, status, err) {
      console.log( "Error: " + err );
      console.log( "Status: " + status );
      console.dir( xhr );
    });
  })
  .fail(function(xhr, status, err) {
    console.log( "Error: " + err );
    console.log( "Status: " + status );
    console.dir( xhr );
  });
}
function main() {
  console.log("Face found & Person not identified");
  if(check() && !found) {
    console.log("Face found & Person not identified");
    var video  = document.getElementById('video');
    var canvas = document.getElementById('image');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    getData(canvas);
  } else if(!check() && found) {
    found = false;
  }
  setTimeout(main, 2000);
}
