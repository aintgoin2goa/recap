(function(){

	var email = "customer.service@nissanqa.akqa.com";
	var password = "customer.service";
	var loginUrl = "https://uat-infiniti-gb.ngcss.akqa.net/";
	var emailInputId = "Email";
	var passwordInputId = "Password";
	var submitButtonId = "LoginSubmit";

	recap.beforeLoad(function(done){

		var pageLoad = function(){
			page.onLoadFinished = function(){};
			done();
		}

		page.load(loginUrl, function(status){
			if(status == "fail"){
				fatalError("Could not open login page");
				return;
			}

			page.onLoadFinished = pageLoad;

			document.getElementById(emailInputId).value = email;
			document.getElementById(passwordInputId).value = password;
			document.getElementById(submitButtonId).click();
		});
	});

}());
