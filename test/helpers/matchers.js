var url = require("url");
var querystring = require("querystring");

jasmine.Matchers.prototype.toMatchUrl = function(urlToTest){
	var actual = url.parse(this.actual);
	var test = url.parse(urlToTest);
	var actualSearch;
	var testSearch;

	if(
		actual.hostname !== test.hostname ||
		actual.pathname !== test.pathname ||
		actual.protocol !== test.protocol
	){
		return false;
	}

	actualSearch = querystring.parse(actual.search.replace(/&amp;/g, "&"));
	testSearch = querystring.parse(test.search.replace(/&amp;/g, "&"));

	for(var prop in testSearch){
		if(!actualSearch[prop] || actualSearch[prop] !== testSearch[prop]){
			return false;
		}
	}

	return true;
}