# Parley

The browser privacy plugin

Blocks third-party requests and cookies for a cleaner, safer and more private web experience

## Instructions

Parley will by default block all third-party requests on a web page. For eg. if you are visiting blog.com, it will block all embded scripts or images that are coming from another domain, such as Facebook widgets, Digg widgets, those javascript commenting boxes. Pages will load a lot faster, and your tracking cookies will not be sent back to all of these sites when you visit them, allowing you to control who knows what you are visiting on the web.

When Parley finds third-party requests on a web page, it will pop up an icon in the address bar, similar to the built-in popup blocker. If you click on that icon, you can explicitely unblock some of the reqeusts (ie. if you really enjoy having Facebook like buttons on a webpage, or need one of the CSS files to load.)

WARNING: This is an early alpha release. There are known bugs. If you would like to test this release now, chances are it will break a lot of pages, especially Wordpres blogs (some may say they end up looking better for it).

Important: The current releases are more suited for developers who know what they are doing, can read a JS console log to help report bugs, and will generally not get frustrated by stuff not working. Please don't post or publish anything about this plugin until I can get a stable release out. Thanks.

## Feedback

I am updating releases daily. Auto-update isn't built in to this test build, yet, so you if you do install the alpha build, make sure you come back and grab newer versions as they are released.

File bugs and issues at [/nikcub/parley/issues](http://github.com/nikcub/parley/issues)

## Install

The latest stable build is always at this address:

[http://nikcub.appspot.com/projects/parley.crx](http://nikcub.appspot.com/projects/parley.crx)

## TODO

If you have any todo suggestions, email me on nikcub at gmail. After content blocking, I will be adding features to block cookie setting, anonymizing requests with proxy servers, etc. The intention is to make Parley a general privacy plugin.

@TODO backwards-compat third-party cookie blocking. ie. if you check 'block third party cookies' from now, it will still send the old already set cookies. write a function to take intersection of chrome.history and chrome.cookie to rm third-party cookies
@TODO options page
@todo options - settings showing common unblock rules by type and by site (eg. disqus, facebook, digg etc. show buttons/etc.)
@TODO options - more options to unblock certain types of content
@TODO options - unblock entire sites/domains
@TODO options - always block cookies for css
@TODO malware lookups on other DBs
@TODO cookie cleaning and common-sense blocking1
