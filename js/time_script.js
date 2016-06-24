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

function readSettings() {
  $.get("users.json", function(json) {
    users = (json);
    current_user = users[0];
    console.log(json);
  });
  $.get("keys.json", function(json) {
    keys = json;
  });
}
$(document).ready(function() {
  readSettings();
  $("#intro").fadeOut(3000, function() {
    requestAnimationFrame(updateclock);
    icons.add("weather", Skycons.RAIN);
    $("#temp_sum").height($("#temp_sum").width());
    $("#temp").html("??° " + "C" );
    getweather();
    get_noti();
    getAuth();
    setInterval(getweather, 600000);
    setInterval(getAuth, 1800000);
    icons.play();
    main();
    live();
  });
});
