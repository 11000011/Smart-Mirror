// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '304309191848-nuae7uddkjbt3jamnaos1h6bkuu5p8in.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
console.log("Check Auth Loaded");
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    loadCalendarApi();
  } else {
    gapi.auth.authorize({
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false
      },
      handleAuthResult);
  }
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

  request.execute(function(resp) {
    var events = resp.items;
    if (events.length > 0) {
      $("#calendar ul").html("");
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
        $("#calendar ul").append('<li>'+ event.summary + ' (' + when + ')' + '</li>');
        console.log(event);
      }
    } else {
      console.log('No upcoming events found.');
    }

  });
}
