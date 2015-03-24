var file = "data/link.json";
describe("test the verification of file", function(){
	it("link file should be defined", function(){
		var file = "data/links.json";
		expect(file).toBeDefined();
	});	
	it("the link file in the function should be defined", function(){
		expect(loadLinkFile("data/link.json")).toBeDefined();
	});
});

describe("loadLinkFile", function(){
	var returnData;
	var expectedLink;
	var expectedName;
	
	beforeEach(function(done){
		loadLinkFile(file, function(data){
			returnData = data;
			expectedName = returnData[0].target.name;
			done();
		});
	});
	
	it("the external link file should be load in and we have the right name of the first array element", function(){
	expect(returnData[0].target.name).toEqual(expectedName);
	});
	
});


