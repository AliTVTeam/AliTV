var linkFile = "data/link.json";

if(navigator.userAgent.match(/phantomjs/i)){	
	linkFile = "https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/link.json";
};


describe("describe function loadLinkFile", function(){
describe("test the verification of linkfile", function(){
	it("the name of the link file should be defined", function(){
		var file = "data/links.json";
		expect(file).toBeDefined();
	});	
});

describe("loadLinkFile", function(){
	var returnData;
	var expectedLink;
	var expectedName;
	
	beforeEach(function(done){
		loadLinkFile(linkFile, karyo, function(data){
			returnData = data;
			expectedName = returnData[0].target.name;
			done();
		});
	});
	
	it("the external link file should be load in and we have the right name of the first array element", function(){
	expect(returnData[0].target.name).toEqual(expectedName);
	});
	
});

describe("Spy on loadLinkFile", function(){
	//es wird ein test-Objekt loadLink angelegt, welches als test-Eigenschaft den Aufruf auf die Funktion loadLinkFile enthält
	var loadLink = {};
	loadLink.test = function test(linkFile){
		loadLinkFile(linkFile);
	}
	
	//vor jedem spec wird der spy auf loadLink gesetzt
	beforeEach(function() {
		spyOn(loadLink, 'test');
	    loadLink.test(linkFile);
	});
	
	
	it("the spy tracks that the function loadLinkFile was called", function() {
	    expect(loadLink.test).toHaveBeenCalled();
	});
	
	it("the spy tracks the arguments of loadLinkFile. In this case the arguments are either the filename or when you use grunt the url to the github-page. " +
			"The test fails when you not assign the access to the data correctly.", function() {
		if(navigator.userAgent.match(/phantomjs/i)){	
			expect(loadLink.test).toHaveBeenCalledWith("https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/link.json");
		}
		else{
			expect(loadLink.test).toHaveBeenCalledWith("data/link.json");
		}
	    
	});

});
});

