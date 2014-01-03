var page = require('webpage').create();

function fillOutForm(){
	var inputs = document.querySelectorAll('.login-form input');
	inputs[0].value = "auth_success@army.akqa.net"
	inputs[1].value = "p@ssword1";
}

function login(){
	document.querySelector(".login-form button").click();
}

function complete(){
	capture("step2.jpg", function(){
		console.log("Finished");
		phantom.exit();
	});

}

function capture(filename, callback){
	setTimeout(function(){
		page.render(filename);
		callback();
	}, 10);
}

page.customHeaders = {
	"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
}

page.open("http://www.qa.army.akqa.net/", function(){
	console.log("login page open");
	page.evaluate(fillOutForm);
	capture("step1.jpg", function(){
		page.onLoadFinished = complete;
		page.evaluate(login);
	});
	
});