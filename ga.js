/*
Copyright (c) willFarrell 2011

Added custom minifications, Bounce Rate Fix and Conversion Rate Fix
*/

/*
GA Tracking Compression
http://mathiasbynens.be/notes/async-analytics-snippet
*/

var _gaq = [['_setAccount', 'UA-15704594-1'], ['_trackPageview']];
(function(d, t) {
	var ga = d.createElement(t),
		s = $(t)[0]//d.getElementsByTagName(t)[0]; //use obj.js
	ga.async = 1;
	ga.src = '//google-analytics.com/ga.js';
	//ga.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js'
	s.parentNode.insertBefore(ga, s);
}(document, 'script'));

/*
Bounce Rate Fix
http://mindtheproduct.com/2011/08/data-driven-your-bounce-rate-and-time-on-site-are-wrong/
*/
(function (tos) {
	var _time = 'Time', _log = 'log';
	window.setInterval(function () { // Every 10,000 milliseconds, calculate the time

	tos = (function (t) {
		return t[0] == 50 ? (+(t[1]) + 1) + ':00' : (t[1] || '0') + ':' + (+(t[0]) + 10); // +() = parseInt()
	})(tos.split(':').reverse()); // Collect and send the time to Google Analytics
	
	window.pageTracker ? pageTracker._trackEvent(_time, _log, tos) : _gaq.push(['_trackEvent', _time, _log, tos]);
	}, 10000);
})('00');

/*
Conversion Rate Fix
http://sixrevisions.com/web-development/hacking-google-analytics-ideas-tips-and-tricks/
*/

function createCookie(name, value, days) {
	var date, expires;
  if(days) {
    date = new Date();
    date.setTime(date.getTime() + (days * 86400000)); // 86400000 = 24 * 60 * 60 * 1000
    expires = "; expires=" + date.toGMTString();
  }
  else {
    expires = "";
  }
  document.cookie = name + "=" + value+expires + ";domain=" + window.location.hostname + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=",
  		ca = document.cookie.split(';');
			i, c;
  for(i = 0; i < ca.length; i++) {
    c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return null;
}

function googleCookieReferrer() {
  var feed=readCookie("__utmz"), feed_temp, check = "";
  // If the utmcsr is not found, cancel
  if(feed.indexOf("utmcsr")==-1) {
    return null;
  }
  if(feed != null) {
    // New version cookie
    if(feed.indexOf("%7C") != -1) {
      feed = feed.split("%7C");
      feed = feed[0].split("%3D");
    } else {
      // Old version cookie
      feed = feed.split("|");
      feed = feed[0].split("=");
    }

    return (feed[1] != "") ? feed[1] : "";
  }
  // Read the Google cookie, and extract the utmcsr parameter from utmz
  var referrer=googleCookieReferrer();
  // If the Google cookie was successfully read, and utmcsr found
  if(referrer != null && referrer != "") {
    // Read our cookie if it exists
    if(readCookie("__rfrr")) {
      // Cookie data
      feed = readCookie("__rfrr");
      // Temp cookie string
      feed_temp = feed;
      // This will hold the last referrer in our cookie
      //check = "";
      // Split the data in our cookie
      feed = feed.split("|");

      // If it's the first element, it's a string
      check = (feed[feed.length-1] == null) ? 
        feed :
      // If multiple elements, it's an array, so get last array item
        check = feed[feed.length-1];
      

			// If last element != referrer: write cookie and add new referrer
			referrer = (check != referrer) ? feed_temp+"|"+referrer : referrer;
			createCookie("__rfrr",referrer,365);
		}
  }
}

/*
// Add this to extend the code in Example 1
function googleCookieKeyword() {
  var feed = readCookie("__utmz");
  // If the utmcsr is not found, cancel
  if(feed.indexOf("utmctr") == -1) {
    return null;
  }

  if(feed!=null) {
    // New version cookie
    if(feed.indexOf("%7C") != -1) {
      feed = feed.split("%7C");
      feed = feed[3].split("%3D");
    }
    else {
      // Old version cookie
      feed = feed.split("|");
      feed = feed[3].split("=");
    }

    if(feed[1] != "") {
      return feed[1];
    }
    else {
      return "";
    }
  }
  else {
    return "";
  }
}

// Read the Google cookie and extract the utmcsr parameter from utmz
var referrer = googleCookieKeyword();

if (referrer == "YOUR_DESIRED_KEYWORD") {
  // Add your code for displaying the content you desire here
	
}*/
