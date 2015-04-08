//var returnKaryo;
//var returnLinks;
//var links;
//var karyo;
//
//describe("getRibbon", function(){
//	beforeEach(function(done){
//		loadKaryoFile(karyoFile, function(data){
//			karyo_to_coords(data);
//			returnKaryo=data.chromosomes;
//			
//		loadLinkFile(linkFile, karyo, function(data){
//			links = data;
//			link_to_coords(links, karyo);
//			
//			done();
//			});
//		});
//	});
//	
//	it("should test if there is a function getRibbon which return a true value", function(){
//		expect(getRibbon(links)).toBeDefined();
//	});
//	
//	it("should substract the targetline-information from the sourceline_information, the expected value should be 1", function(){
//		expect(testLineDifference(links)).toBeDefined();
//	})
//
//});	
//
//
