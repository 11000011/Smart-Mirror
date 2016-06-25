var users;
var keys;
var current_user;

function getAuth() {
  $.ajax({
      url: "https://www.googleapis.com/oauth2/v4/token",
      data: {
        client_id: keys.clientId,
        client_secret: keys.clientSecret,
        refresh_token: current_user.refreshKey,
        grant_type: "refresh_token"
      },
      type: "POST",
      dataType: "json"
    })
    .done(function(token) {
      gapi.auth.setToken(token);
      loadCalendarApi();
    });
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 3,
    'orderBy': 'startTime'
  });

  $("#calendar ul").html("");
  request.execute(function(resp) {
    var events = resp.items;
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        when = new Date(when);
        minute = when.getMinutes();
        if (minute < 10) {
          minute = "0" + minute;
        }
        when = when.getDate() + '/' + when.getMonth() + " " + when.getHours() + ":" + minute;
        $("#calendar ul").append('<li>' + event.summary + ' (' + when + ')' + '</li>');
        console.log(event);
      }
    } else {
      console.log('No upcoming events found.');
    }

  });
}
