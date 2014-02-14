(function(){

	recap.beforeAll = function(done){

		var loginUrl = "https://uat-infiniti-gb.ngcss.akqa.net/";
		log("phantomjs.BeforeAll: " + loginUrl);

		var pageLoad = function(){
			page.onLoadFinished = function(){};
			done();
		}

		var fillInForm = function(){
			var email = "customer.service@nissanqa.akqa.com";
			var password = "customer.service";
			var emailInputId = "Email";
			var passwordInputId = "Password";
			var submitButtonId = "LoginSubmit";
			document.getElementById(emailInputId).value = email;
			document.getElementById(passwordInputId).value = password;
			document.getElementById(submitButtonId).click();
		}

		page.open(loginUrl, function(status){
			if(status == "fail"){
				fatalError("Could not open login page");
				return;
			}

			log("phantomjs.BeforeAll: opened login page");

			page.onLoadFinished = pageLoad;
			page.evaluate(fillInForm)
		});
	};
}());
