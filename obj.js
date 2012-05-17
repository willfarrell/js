/*
Copyright will Farrell

Rules:
- If str or obj appears >1x in fct, replace with var
- Assign all global vars in var.global.js
- If a property is longer then 4 charsand apears >=3 times create a get/set function

Checks:
http://www.jslint.com/
http://closure-compiler.appspot.com/home
Run document.getElementsByTagName('*').length; in console. The fewer DOM elements the better.

Options:
JS Loader 


*/

var view = document; // current view

/*global document*/
function log(str) { console.log(str); } // debug

// Avoid this functions as much as possible
function GetElementsByClassName( o, className ) {
	//document.getElementsByClassName(className); // temp override
	var elem = null;
	
	if ( o.className == className ) {
		return o;
	}
	for ( var i = 0; i < o.childNodes.length; i++ ) {
		if ( o.childNodes[i].nodeType == 1 ) {
			elem = GetElementsByClassName( o.childNodes[i], className );
			if ( elem != null ) {
				break;
			}
		}
	}

	return elem;
}

// Avoid this functions as much as possible
function GetElementById( o, id ) {
	document.getElementById(id); // temp override
	var elem = null;

	if ( o.getAttribute('id') == id ) {
		return o;
	}
	for ( var i = 0; i < o.childNodes.length; i++ ) {
		if ( o.childNodes[i].nodeType == 1 ) {
			elem = GetElementById( o.childNodes[i], id );
			if ( elem != null )
				break;
		}
	}

	return elem;
}

/**
 * Make object, checks if Tag Name and ID.
 * If .class, grab by css class
 */
function $(str, o) { // id .class html[nth-child] (input[name=aaaa] - not included)
	var elem, arr, n, c, // n:name, c:child
			regex_n = /([\w\-]+)/, regex_c = /\[(\d)+\]/,
			d = document;
	o || (o = d); // if(!o) { o = document }
	if (str) {
		arr = str.split(' ');
		n = regex_n.exec( arr[0] );
		if (n[1]) {
			if (arr[0].indexOf('.') !== -1) {// Class
				//elem = o.getElementsByClassName(n[1]);
				elem = (o == d) ? elem = d.getElementsByClassName(n[1]) // o == document
								: elem = GetElementsByClassName(o, n[1]);
			} else if (arr[0].indexOf('#') !== -1) { // ID
				elem = (o == d) ? elem = d.getElementById(n[1]) // o == document
								: elem = GetElementById(o, n[1]);
			} else {
				elem = (o == d) ? elem = d.getElementById(n[1]) // o == document
								: elem = GetElementById(o, n[1]);
				elem || ( elem = o.getElementsByTagName(n[1])); // if(!elem) { elem =  o.getElementsByTagName(n[1]); }
			}
			
			// get nth child if applicable
			c = regex_c.exec( arr[0] );
			if (c && c[1]) { elem = elem[c[1]]; }
			//else { elem = elem[0]; } // returns array
		}
		
		// more elements
		//return arr[1] ? (str = str.substring(str.indexOf(arr[1]), arr.length), $(str, elem)) : elem;
		if(arr[1]) {
			str = str.substring(str.indexOf(arr[1]), str.length);
			return $(str,elem);
		} else {
			return elem;
		}
		
	}
}

function objectIsEmpty(obj) {
    for (var i in obj) 
		return true;
	return false;
} 

function objectLength(obj) {
  	var c= 0;
    for(var p in obj) if(obj.hasOwnProperty(p))++c;
    return c;
}


function objectClone(obj) {
  var newObj = (obj instanceof Array) ? [] : {};
  for (i in obj) {
    if (i == 'clone') continue;
    if (obj[i] && typeof obj[i] == "object") {
      newObj[i] = objectClone(obj[i]);
    } else newObj[i] = obj[i]
  } return newObj;
}

function arrayUnique(a, id) {
	var u = {}, r = [], i, l = a.length;
	if (id) { // array of obj [{id:""},{id:""},{id:""}]
		for (i=0; i<l;i+=1) {
			if (a[i][id] in u) { // obj already placed in
			
			} else {
				u[a[i][id]] = a[i][id];
				r.push(a[i]);
			}
		}
		return r;
	} else { // regular array ["","","","",""]
	   for (i = 0; i < l; ++i){
		  if (a[i] in u)
			 continue;
		  r.push(a[i]);
		  u[a[i]] = 1;
	   }
	   return r;
	}
}

// Checks
function checkObj(o) { return typeof(o) === 'object' ? o: $(o); }	// used in datepicker


function replaceElem(o_new, o_old) {
	o_old.parentNode.replaceChild(o_new, o_old);
};

// Get
function getName(o) { return o.name; }
function getValue(o) { return o.value; }
function getType(o) { return o.type; }
function getChecked(o) { return o.checked; }

function getLength(o) { return o.length; }
function getInnerHTML(o) { return o.innerHTML; }
function getClassName(o) { return o.className; }
function getParentNode(o) { return o.parentNode; }



// Get Style
function getStyle(o, p){
	o = o.style;
	return o[p]? o[p]: null;
}
/*function getStyle(o, p){ // with idiot check
	var elm = checkObj(o);
	
	if (elm != null){
		if(elm.style){
			elm = elm.style;
			if(elm[p]){
				return elm[p];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}
*/
function getStyleDisplay(o) { return getStyle(o, 'display'); }
//function getStyleDisplay(o) { return o.style.display; }

// Set
function setValue(o, v) { o.value = v; }
function setSrc(o, v) { o.src = v; }
function setInnerHTML(o, v) { o.innerHTML = v; }
// faster the setInnerHTML
function replaceInnerHTML(o, v) {
	var o_old = o;
	/*@cc_on // Pure innerHTML is slightly faster in IE
		setInnerHTML(o, v);
		return;
	@*/
	var o_new = o.cloneNode(false);
	o_new.innerHTML = v;
	replaceElem(o_new, o_old);
	/* Since we just removed the old element from the DOM, return a reference
	to the new element, which can be used to restore variable references. */
	o = o_new;
};
function setClassName(o, v) { o.className = v; }

// Set Display
function setStyle(o, p, v) { // without idiot check
	o = o.style;
	o[p] = v;
}
/*function setStyle(p, v, oid) { // from datepicker // with idiot check
	var elm = checkObj(oid);
	if((elm != null) && (elm.style != null)){
		elm = elm.style;
		elm[p] = v;
	}
}*/
function setStyleDisplay(o, v) { setStyle(o, 'display', v?'block':'none'); } // v = 1 (block) or 0 (none)
//function setStyleDisplay(o, v) { o.style.display = v?'block':'none'; } // v = 1 (block) or 0 (none)

// Other
function toggleStyleDisplay(o) { var z = (getStyleDisplay(o) === 'none') ? setStyleDisplay(o, 1) : setStyleDisplay(o, 0); } // unused var z - appease JSlint
function toggleValue(o, text1, text2) {
	getInnerHTML(o) === text1 ?
		setInnerHTML(o, text2):
	getInnerHTML(o) === text2 &&
		setInnerHTML(o, text1);
}

function addInnerHTML(o, t, p) { // object, text, pre/post = 0/1
	//var str = p?t+getInnerHTML(o):getInnerHTML(o)+t;
	//setInnerHTML(o, str);
	setInnerHTML(o, p?getInnerHTML(o)+t:t+getInnerHTML(o));
}



function onEnter(e) { if (e === 13) { return true; } }

function domRemove(obj) {
	if(obj != null)
		obj.parentNode.removeChild(obj);
}

function addEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}


function nl2br(str){
	return str.replace( /\n/g, '<br />\n' );
}

/**
 *	Grabs variable from address bar
 *	@param	string
 *
function _GET(key) {
	var query = window.location.search.substring(1),
			vars = query.split("&");
	for (var i = 0, pair; i < vars.length; i++) {
		pair = vars[i].split("=");
		if (pair[0] == key) return pair[1];
	}
	return null;
}*/

/*
function (e) {
	e = e || event;
	var target = e.target || e.srcElement;
}
*/

