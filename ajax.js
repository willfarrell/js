//** Ajax Functions **//
// http://en.wikipedia.org/wiki/Representational_State_Transfer
// method = GET/POST/PUT/DELETE
function __io(url, method) {
    var x = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
    x.open(method ? method : 'GET', url, false );
    //x.setRequestHeader('Content-Type', 'text/html');
    x.send(method ? method : '');
	return x.responseText;
}

/*
function __ioCallback(url, method, callback) {
    var x = !window.XMLHttpRequest ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest(),
		xx;
    x.open(method ? 'PUT' : 'GET', url, false );
    //x.setRequestHeader('Content-Type', 'text/html');
	xx = x.xmlhttp;
	x.xmlhttp.onreadystatechange = function() {
		if(typeof(xmlhttpChange) !== 'undefined') {
			xmlhttpChange();
		}
		if(typeof(callback) !== 'undefined') {
			if (typeof(x) !== 'undefined' && x.freed === 0 && x.readyState === 4) {
				if (xx.status === 200 || xx.status === 304) {
					callback(xx.responseText);
				} else {
					callback(null);
				}
				x.freed = 1;
			}
		}
	};
    x.send(method ? method : '');
}*/

var x = [];
function __ioCallback(url, method, callback) {
	var j, pos;
	//var pos = i;
	for (j=0, pos = -1; j<x.length; j++) {
		if (x[j].freed === 1) { pos = j; break; }
	}
	if (pos === -1) {
		pos = x.length;
		x[pos] = {
			freed: 1,
			//xmlhttp: false, // o.xmlhttp = !1;
			xmlhttp: window.XMLHttpRequest
				? new XMLHttpRequest()
				: window.ActiveXObject && new ActiveXObject('Microsoft.XMLHTTP'),
		}; 
	}
	if (x[pos].xmlhttp) {
		x[pos].freed = 0;
		x[pos].xmlhttp.open('GET',url,true);
		//x[pos].xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');	// Ripple Workaround
		//x[pos].xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');	// Ripple Workaround
		x[pos].xmlhttp.onreadystatechange = function() {
			if (typeof(callback) !== 'undefined'
				&& typeof(x[pos]) !== 'undefined'
				&& x[pos].freed === 0
				&& x[pos].xmlhttp.readyState === 4) {
				if (x[pos].xmlhttp.status === 200 || x[pos].xmlhttp.status === 304) {
					callback(x[pos].xmlhttp.responseText);
				} else {
					callback(null);
				}
				x[pos].freed = 1;
			}
		};
		if (window.XMLHttpRequest) {
			x[pos].xmlhttp.send(null);
		} else if (window.ActiveXObject) {
			x[pos].xmlhttp.send();
		}
	}
	return;
}

/*

function __ioCallback(url, method, callback) {
	var j, pos;
	//var pos = i;
	for (j=0, pos = -1; j<x.length; j++) {
		if (x[j].freed === 1) { pos = j; break; }
	}
	if (pos === -1) { pos = x.length; x[pos] = new CXMLReq(1); }
	if (x[pos].xmlhttp) {
		x[pos].freed = 0;
		x[pos].xmlhttp.open('GET',url,true);
		x[pos].xmlhttp.onreadystatechange = function() {
			if(typeof(callback) !== 'undefined') {
				if (typeof(x[pos]) !== 'undefined' && x[pos].freed === 0 && x[pos].xmlhttp.readyState === 4) {
					if (x[pos].xmlhttp.status === 200 || x[pos].xmlhttp.status === 304) {
						callback(x[pos].xmlhttp.responseText);
					} else {
						callback(null);
					}
					x[pos].freed = 1;
				}
			}
		};
		if (window.XMLHttpRequest) {
			x[pos].xmlhttp.send(null);
		} else if (window.ActiveXObject) {
			x[pos].xmlhttp.send();
		}
	}
	return;
}
*/

/*
JSONP.request('file', fucntion(json, file) {alert(json)})
URI: &callback=JSONP.response

http://stackoverflow.com/questions/4589714/making-json-jsonp-xhr-requests-on-the-file-protocol
*/
var JSONP = {
  queue: [],
  load: function(file, callback, scope) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = "text/javascript";
      script.src = file;
      head.appendChild(script);
  },

  request: function(file, callback, scope) {
      this.queue.push(arguments);
      if (this.queue.length == 1) {
          this.next();
      }
  },

  response: function(json) {
      var requestArgs = this.queue.shift();
      var file = requestArgs[0];
      var callback = requestArgs[1];
      var scope = requestArgs[2] || this;
      callback.call(scope, json, file);

      this.next();
  },

  next: function() {
      if (this.queue.length) {
          var nextArgs = this.queue[0];
          this.load.apply(this, nextArgs);
      }
  }
};