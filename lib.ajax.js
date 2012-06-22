//** Ajax Functions **//
// http://en.wikipedia.org/wiki/Representational_State_Transfer
// method = GET/POST/PUT/DELETE
function __io(url, method, data) {
	method || (method = 'GET');
	data || (data = null);
    var x = new XMLHttpRequest(); // new ActiveXObject('Microsoft.XMLHTTP') is for IE <7
    x.open(method, url, false );
    //x.setRequestHeader('Content-Type', 'text/html');
    x.send(data);
	return x.responseText;
}

var x = [];
/*
url - unencoded
method - GET/POST/PUT/DELETE
data - object {key:value,key:value}
callback function(){}
*/
function __ioCallback(callback, url, method, data) {
	method || (method = 'GET');
	data || (data = null);
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
			/*xmlhttp: window.XMLHttpRequest
				? new XMLHttpRequest()
				: window.ActiveXObject && new ActiveXObject('Microsoft.XMLHTTP'),*/
			xmlhttp: new XMLHttpRequest(),
		}; 
	}
	if (x[pos].xmlhttp) {
		x[pos].freed = 0;
		
		//x[pos].xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');	// Ripple Workaround
		//x[pos].xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');	// Ripple Workaround
		x[pos].xmlhttp.onreadystatechange = function() {
			if (typeof(callback) !== 'undefined'
				//&& typeof(x[pos]) !== 'undefined'
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
		// (object)data => (string)data
		if (typeof data == "object") data = objectURL(data);
		//log(data);
		
		x[pos].xmlhttp.open(method,url,true);
		x[pos].xmlhttp.send(data);
	}
	return;
}


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