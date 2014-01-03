exports.getTmpMock = function(){

	return {
		dir : jasmine.createSpy("dir").andCallFake(function(options, cb){
			setImmediate(function(){
				cb(null, "path");
			});
		})
	};
}