var url = require("url");
var querystring = require("querystring");

function matchUrls(url1, url2){
	url2 = url2.replace(/\/$/, "");
	var actual = url.parse(url1);
	var test = url.parse(url2);
	var actualSearch;
	var testSearch;

	if(
		actual.hostname !== test.hostname ||
		actual.pathname !== test.pathname ||
		actual.protocol !== test.protocol
	){
		return false;
	}

	actualSearch = actual.search == null ? "" : querystring.parse(actual.search.replace(/&amp;/g, "&"));
	testSearch = test.search == null ? "" : querystring.parse(test.search.replace(/&amp;/g, "&"));

	for(var prop in testSearch){
		if(!actualSearch[prop] || actualSearch[prop] !== testSearch[prop]){
			return false;
		}
	}

	return true;
}
jasmine.Matchers.prototype.toMatchUrl = function(urlToTest){
	return matchUrls(this.actual, urlToTest);	
}

jasmine.Matchers.prototype.toContainUrl = function(urlToTest){
	for(var i=0, l=this.actual.length; i<l; i++){
		if( matchUrls(this.actual[i], urlToTest) ){
			return true;
		}
	}

	return false;
}