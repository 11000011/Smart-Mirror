var websocket;

function get_noti() {
  if (websocket != null) {
    websocket.close();
  }

  $("#push li").remove();
  websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + current_user.pushKey);
  websocket.onopen = function(e) {
    console.log("websocket.opened");
  }
  websocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
    if (data.type == "push") {
      if (data.push.type == "mirror") {
        var temp = "#" + data.push.notification_id;
        $(temp).remove();
        var color = "#EEEEEE";
        if (data.push.body == "Incoming call\n") {
          color = "#4CAF50";
        } else if (data.push.body == "On-going call\n") {
          color = "#FFD54F";
        } else if (data.push.package_name == "com.whatsapp") {
          color = "#1B5E20";
        } else if (data.push.package_name == "com.facebook.orca") {
          color = "#0D47A1";
        } else if (data.push.package_name == "com.bsb.hike") {
          color = "#29B6F6";
        }
        $("#push_bullet ul").append('<li id ="' + data.push.notification_id + '" style="color: ' + color + ';">' + data.push.title + " : " + data.push.body.substr(0, 25) + '.....</li>');
        if ($('#push li').length > 2) {
          $("#push li")[0].remove();
        }
      } else if (data.push.type == "dismissal") {
        var temp = "#" + data.push.notification_id;
        $(temp).remove();
      }
    }
  }
  websocket.onerror = function(e) {
    console.log("Error: " + e);
  }
  websocket.onclose = function(e) {
    console.log("closed");
  }
}
