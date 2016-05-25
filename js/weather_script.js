var icons = new Skycons({"color": "white"});
function getweather() {
    $.ajax({
      url: "http://ip-api.com/json/?callback=?",
      type: "GET",
      dataType: "json",
    })
    .done(function(ip){
      console.log(ip.lat)
        console.log(ip.lon)
        $.ajax({
          url:"https://api.forecast.io/forecast/70a79cc9ef81d5d038f26f0163b83d22/" + ip.lat + "," + ip.lon + "?callback=?",
          type: "GET",
          dataType: "json",
        })
      .done(function(weather){
        console.log(weather)
        icons.set("weather", weather.currently.icon);
        var t = weather.currently.temperature;
        t = (t - 32) * 5 / 9.0;
        t = Math.round( t * 100 ) / 100;
        $("#temp").html(t + "°" );
      })
    })
}
