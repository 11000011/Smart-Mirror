var websocket;
var apiKey;
$.get("push_bullet_api.txt", function(data) {
  apiKey = data;
  console.log(data);
});

function get_noti() {
  if (websocket != null) {
    websocket.close();
  }

  websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + apiKey);
  websocket.onopen = function(e) {
    console.log("websocket.opened");
  }
  websocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    if (data.type == "push") {
      if (data.push.type == "mirror") {
        var temp = "#" + data.push.notification_id;
        $(temp).remove();
        $("#push_bullet ul").append('<li id ="' + data.push.notification_id + '">' + data.push.title + " : " + data.push.body.substr(0, 25) + '.....</li>');
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
