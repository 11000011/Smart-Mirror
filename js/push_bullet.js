var websocket;
var count = 0;
var apiKey = 'o.6yALotLlRTzRJ04jDXgZnAEc2EyeosHk';
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
    console.log(data);
    var check = new Array(5);
    if(data.type == "push") {
      if(data.push.type == "mirror")
      {
        if(count > 2)
        {
          $("#push li")[0].remove();
          count = count - 1;
        }
        var temp = "#" + data.push.notification_id;
        $(temp).remove();
        $("#push_bullet ul").append('<li id ="' + data.push.notification_id + '">' + data.push.title + " : " + data.push.body.substr(0 , 25) + '.....</li>');
        count = count + 1;
      }
      else if (data.push.type == "dismissal")
      {
        var temp = "#" + data.push.notification_id;
        $(temp).remove();
        count = count - 1
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

