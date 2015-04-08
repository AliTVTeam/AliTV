var returnKaryo;
var returnLinks;
var links;
var fullkaryo;

describe("describe function getRibbon", function(){
	beforeEach(function(done){
		loadKaryoFile(karyoFile, function(data){
			karyo_to_coords(data);
			returnKaryo=data.chromosomes;
			
		loadLinkFile(linkFile, returnKaryo, function(data){
			links = data;
			link_to_coords(links, returnKaryo);
			
			done();
			});
		});
	});
	
	describe("Spy on getRibbon", function(){
		//es wird ein test-Objekt loadKaryo angelegt, welches als test-Eigenschaft den Aufruf auf die Funktion loadKaryoFile enthält
		var getRibbon = {};
		getRibbon.test = function test(links){
			getRibbon(links);
		}
		
		//vor jedem spec wird der spy auf loadKaryo gesetzt
		beforeEach(function() {
			spyOn(getRibbon, 'test');
		    getRibbon.test(links);
		});
		
		
		it("the spy tracks that the function loadKaryoFile was called", function() {
		    expect(getRibbon.test).toHaveBeenCalled();
		});
		
//		it("the spy tracks the arguments of loadKaryoFile. In this case the arguments are either the filename or when you use grunt the url to the github-page. " +
//				"The test fails when you not assign the access to the data", function() {
//			if(navigator.userAgent.match(/phantomjs/i)){	
//				expect(loadKaryo.test).toHaveBeenCalledWith("https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/karyo.json");
//			}
//			else{
//				expect(loadKaryo.test).toHaveBeenCalledWith("data/karyo.json");
//			}
//		    
//		});

});
});


