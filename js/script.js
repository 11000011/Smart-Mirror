console.log("Hi");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f) {
  return setTimeout(f, 1000 / 60)
};

function updateclock() {
  var curdate = new Date()
  var hour = curdate.getHours()
  var minute = curdate.getMinutes()
  var second = curdate.getSeconds()
  $(".time").html(hour + " : " + minute + " : " + second)
  requestAnimationFrame(updateclock)
}

requestAnimationFrame(updateclock)
