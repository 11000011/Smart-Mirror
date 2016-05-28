var icons = new Skycons({
  "color": "white"
});

function contactApi(lat, lon) {
  console.log(lat)
  console.log(lon)
  $.ajax({
      url: "https://api.forecast.io/forecast/70a79cc9ef81d5d038f26f0163b83d22/" + lat + "," + lon + "?callback=?",
      type: "GET",
      dataType: "json",
    })
    .done(function(weather) {
      console.log(weather)
      icons.set("weather", weather.currently.icon);
      var t = weather.currently.temperature;
      t = (t - 32) * 5 / 9.0;
      t = Math.round(t * 100) / 100;
      $("#temp").html(t + "°");
    })
}

function getweather() {
  console.log("Get Weather Called")
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      if (pos == null) {
        contactApi(26.5130072, 80.2337094)
      } else {
        contactApi(pos.coords.latitude, pos.coords.longitude)
      }
    })
  } else {
    contactApi(26.5130072, 80.2337094)
  }
}
