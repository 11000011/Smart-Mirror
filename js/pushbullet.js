var websocket;

function get_noti(){

var apiKey = document.getElementById('o.uVTcHun30PiuLfyGHtBWiMjum4eqeShS');
 function push_bullet() {
 
   websocket = new WebSocket('wss://stream.pushbullet.com/websocket/' + apiKey.value);

  websocket.open=function(e) {

    console.log("websocket open");
  }

  websocket.onmessage = function(e) {
   
    var data=JSON.parse(e.data);

    console.log(data)
    
    console.log(data)
  }
  websocket.onerror = function(e) {
 
    console.log("error" + ":" + data);

  }
 websocket.onclose = function(e) {
  
   console.log("websocket close");}
}
}
