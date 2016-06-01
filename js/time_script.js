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
  var dat = curdate.getDate();
  var mont = curdate.getMonth()+1;
  var year =  curdate.getFullYear();
  if(dat < 10)
    dat = '0' + dat;
  if(mont < 10)
    mont = '0'+ mont;

  $("#parent_time").html('<span id ="time">' + hour + " : " + minute + '</span><br><span id = "date">' + dat + "/" + mont + "/" + year + '</span>');
  requestAnimationFrame(updateclock);
}

$(document).ready(function() {
  $("#intro").fadeOut(3000, function() {
    requestAnimationFrame(updateclock);
    icons.add("weather", Skycons.RAIN);
    $("#temp").html("??° " );
    $(".icondes").html("??????");
    getweather();
    get_noti();
    checkAuth();
    setInterval(getweather, 600000);
    setInterval(checkAuth, 1800000);
    icons.play();
  });
});
