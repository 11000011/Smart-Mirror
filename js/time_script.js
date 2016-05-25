window.requestAnimationFrame = window.requestAnimationFrame
                            || window.mozRequestAnimationFrame
                            || window.webkitRequestAnimationFrame
                            || window.msRequestAnimationFrame
                            || function(f) { return setTimeout(f, 1000 / 60)};

function updateclock() {
  var curdate = new Date();
  var hour = curdate.getHours();
  if (hour < 10) {
    hour = '0' + hour;
  }
  var minute = curdate.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
  }
  var second = curdate.getSeconds();
  if (second < 10) {
    second = '0' + second;
  }
  $(".time").html(hour + " : " + minute + " : " + second)
  requestAnimationFrame(updateclock)
}

$(document).ready(function() {
  $("#intro").fadeOut(3000, function() {
    requestAnimationFrame(updateclock);
    icons.add("weather", Skycons.RAIN);
    $("#temp").html("??.??°" );
    getweather();
    setInterval(getweather, 600000);
    icons.play();
  });
});
