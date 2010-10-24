/*
	Parley
	
	(c) 2010 	Nik Cubrilovic <nikcub@gmail.com>
	
	Blocks all third-party cookies for a better, safer and more private web experience.
	
	Blocking mechanism based on 'onload' event handler by Brian Kennish <byoogle@gmail.com> 
	in his Facebook blocking plugin.

	TODO
	
	@todo 	more privacy features
*/

(function (document) {

	var Parley = {
		
		blockedList: {},
		debugLevel: false,
		blockedContent: true,
		messageSent: false,
		curBlocked: [],
		
		init: function (options) {
			if(arguments.length > 0 && options instanceof Object) {
				this.debugLevel = options.debug;
			}
			
			chrome.extension.sendRequest("blocklist", this.chromeListener);
			document.addEventListener("beforeload", this.evLoadFilter, true);
		},

		chromeListener: function(request, sender, sendResponse) {
			this.curBlocked = Parley.curBlocked = request;
			console.log(this.curBlocked, 'got ');
		},
		
		evLoadFilter: function (event) {
			Parley.filterCheck(event);
		},
		
		filterCheck: function (event) {
			
			if(this.policyMatch(event.url)) {
				blocked = true;
				
				if(this.isUnBlocked(event.url))
					blocked = false;
					
				this.blockedContent = true;
				// host = this.get_host(event.url);
				// if(!this.blockedList.hasOwnProperty(event.url)) {
					// I am not comfortable with this
					// @todo 	better data structure here
					
					// Data structure of block list:
					// [locations]
					// 		[blocked items]
					//			[blocked item info]
					// or something like that
					var blockInfo = {}; var host = {}; var block = {};
					this.debug('Blocking ' + event.url);
					blockInfo['type'] = event.target.nodeName;
					blockInfo['html'] = event.target.outerHTML;
					blockInfo['blocked'] = blocked;
					host[event.url] = blockInfo;
					block[document.location.href] = host;
					chrome.extension.sendRequest(block, function(response) {});
					// chrome.extension.sendRequest(this.blockedList);
					event.preventDefault();
				// }
				
			}
			
		},
		
		isUnBlocked: function(url) {
			if(this.curBlocked.indexOf(this.get_host(event.url)) > 0) {
				return true;
			}
			
			return false;
		},
		
		/**
		*	Policy test cases
		*	
		*	Url				Host			Deny
		*	-----------------------------------------------------
		*	xyz.com			xyz.com			false
		*	abc.com			xyz.com			true
		*	a.xyz.com		xyz.com			false
		*	a.abc.com		xyz.com			true
		*	xyz.com			a.xyz.com		false
		*	xyz.com			a.a.xyz.com		false
		*	abc.com			a.xyz.com		true
		*	
		*	method:
		*	 - reverse both host strings (eg. moc.zyx, moc.zyx.a)
		*	 - match to length of shoter string (eg. moc.zyx == moc.zyx)
		*	 - if both don't match, deny
		**/
		policyMatch: function(url) {
			var Host = this.reverseString(document.location.host.toLowerCase());
			var Url = this.reverseString(this.get_host(url));
			var sub = (Host.length < Url.length) ? Host : Url;
			
			return (Url.substr(0, sub.length) != Host.substr(0, sub.length));
		},
		
		isMatching: function (url, domain) {
		  return url.toLowerCase().indexOf(domain, 7) >= 7;
		},
		
		/**
			Extract host from URL.
			
			I tried a dozen non-RegExp function that I found on the web and not a 
			single one of them worked for 100% of cases, amazingly. There is a better
			and faster way to do this, but for now:
			
			@todo 	implement a faster way to do this
		**/
		get_host: function (url) {
			var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
			return url.match(re)[1].toString().toLowerCase();
		},
		
		reverseString: function (str) {
			return str.split('').reverse().join('');
		},
		
		getStorage: function (key) {
			var result = localStorage[key];
			if(typeof(result) == "undefined")
				return ['___z'];
			else
				return JSON.parse(result);
		},

		setStorage: function (key, value) {
			localStorage[key] = JSON.stringify(value);
		},
		
		debug: function (message) {
			if(this.debug) {
				console.log(message);
			}
		}
	};
	
	Parley.init.prototype = Parley;
	
	try {
		var options = { debug: true };
		Parley = window.Parley = new Parley.init(options);
	} catch(Error) {
		console.error('Error: ' + arguments[0] + ' ' + Error.message);
		console.error(Error.stack);
	}
		
})(document);
