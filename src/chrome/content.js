/*
 Parley

 (c) 2010 	Nik Cubrilovic <nikcub@gmail.com>

 Blocks all third-party cookies for a better, safer and more private web experience.

 Blocking mechanism based on 'onload' event handler by Brian Kennish <byoogle@gmail.com> 
 in his Facebook blocking plugin and also as seen in AdBlock.
*/

(function (document) {

	var Parley = {
		
		unblockedList: null,

		debugLevel: false,
		
		init: function (options) {
			if(arguments.length > 0 && options instanceof Object) {
				this.debugLevel = options.debug;
			}
			
			this.chromeSender('getBlockList', null, function(data, second) {
				console.log('Got unblockedList', data, second);
				this.unblockedList = Parley.unblockedList = data;
			});
			document.addEventListener("beforeload", this.evLoadFilter, true);
		},

		chromeSender: function(rec, msg, cb) {
			(typeof cb != 'function')
				cb = function() { };
			msg = msg || "";
			console.log('sending', msg);
			chrome.extension.sendRequest({rec: rec, msg: msg}, cb);
		},
		
		evLoadFilter: function (event) {
			Parley.filterCheck(event);
		},
		
		filterCheck: function (event) {
			
			if(this.policyMatch(event.url)) {
				
				if(this.isUnBlocked(event.url))

					console.log('blocked ', event);
					
					// @todo - more agressive blocking
					
					// event.target.src='about:blank';
					// event.target.parentElement.removeChild(event.target);	
					// host = this.get_host(event.url);
					// if(!this.blockedList.hasOwnProperty(event.url)) {

					var blockEvent = { 
						url: event.url,
						type: event.target.nodeName,
						html: event.target.outerHTML
					};
					this.chromeSender('addBlock', blockEvent, function () { });
					// this.chromeSender('showPageAction', '', function() { });
					event.preventDefault();

				// }
				
			}
			
		},
		
		isUnBlocked: function(url) {
			if(this.unblockedList  == null || !this.unblockedList instanceof Object)
				return false;
				
			console.log(this.unblockedList);
			
			if(this.unblockedList.indexOf(this.get_host(event.url)) > 0) {
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
	
	// try {
		var options = { debug: true };
		Parley = window.Parley = new Parley.init(options);
	// } catch(Error) {
		// console.error('Error: ' + arguments[0] + ' ' + Error.message);
		// console.error(Error.stack);
	// }
		
})(document);
