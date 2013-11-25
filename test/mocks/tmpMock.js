exports.getTmpMock = function(){

	return {
		dir : jasmine.createSpy("dir").andCallFake(function(cb){
			setImmediate(function(){
				cb(null, "path");
			});
		})
	};
}