var found = false;
var identifying = false;
function getData(c) {
  console.log("Identifying...");
  identifying = true;
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
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
    },
    type: "POST",
      // The DataURL will be something like "data:image/png;base64,{image-data-in-base64}"
    data: makeblob(dataURL),
    processData: false
  })
  .done(function(json) {
    if (json.length > 0) {
      var faceId = json[0].faceId;
      $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/identify",
        beforeSend: function(xhrObj) {
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", keys.microsoftKey);
        },
        type: "POST",
        data: "{\"personGroupId\": \"smartmirror\",\n\"faceIds\": [\"" + faceId + "\"],\n\"maxNumOfCandidatesReturned\": 1\n}"
      }).done(function(data) {
        console.log(data);
        if (data[0].candidates.length > 0) {
          var personId = data[0].candidates[0].personId + "";
          if ( data[0].candidates[0].confidence > 0.55 ) {
            for (i = 0; i < users.length; i++) {
              if(users[i].userId == personId) {
                found = true;
                current_user = users[i];
                console.log(current_user.name + " identified.");
                $("footer").html(current_user.name + " identified.");
                get_noti();
                getAuth();
                break;
              }
            }
          }
        } else {
          console.log("No compatible match found");
          $("footer").html("No compatible match found");
        }
        identifying = false;
        console.log("Identifying Finished - Normal finish");
        $("footer").html("Identifying Finished - Normal finish");
      }).fail(function(xhr, status, err) {
        console.log( "Error: " + err );
        console.log( "Status: " + status );
        console.dir( xhr );
        identifying = false;
        console.log("Identifying Finished - Failed contact");
        $("footer").html("Identifying Finished - Failed contact");
      });
    } else {
      identifying = false;
      console.log("Identifying Finished - No faces in the image");
      $("footer").html("Identifying Finished - No faces in the image");
    }
  })
  .fail(function(xhr, status, err) {
    console.log( "Error: " + err );
    console.log( "Status: " + status );
    $("footer").html( "Error: " + err);
    $("footer").html( "Status: " + status);
    console.dir( xhr );
    identifying = false;
    console.log("Identifying Finished - Failed contact");
    $("footer").html("Identfying Finished - Failed Contact");
  });
}
function main() {
  if (!identifying) {
    console.log("Face found & Person not identified");
    $("footer").html("Face found & Person not identified");
    if(check() && !found) {
      console.log("Face found & Person not identified");
      $("footer").html("Face found & Person not identified");
      var video  = document.getElementById('video');
      var canvas = document.getElementById('image');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      getData(canvas);
    } else if(!check() && found) {
      found = false;
    } else {
      console.log("Same person as before");
      $("footer").html("Same person as before");
    }
  }
  setTimeout(main, 2000);
}
