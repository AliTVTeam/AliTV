var returnKaryo;
var returnLinks;
var links;
var karyo;

//var customMatchers = {
//		toContainRibbon: function(util, customEqualityTesters){
//			
//			return{
//			compare: function(actual, expected){
//				if(expected === undefined){
//					expected = '';
//				}
//			var result={};
//			result.pass = util.equals(actual.links, links[0].ribbon + expected, customEqualityMatchers);
//			if(result.pass){
//				result.message = "contain expected ribbon information";
//			}
//			else{
//				result.message = "not contain the expected ribbon information";
//			}
//			return result;
//			}
//		};
//	} 
//};


var CustomMatchers = CustomMatchers || {};
	CustomMatchers.toContainRibbon = function(util, customEqualityTesters) {
		return {
			compare: function(actual) {
				var result = {
						pass: util.equals(actual, parseInt(actual, 10)),
						message: 'Expected ' + jasmine.pp(actual) + ' to be an Integer.'
				};
				return result;
			}
		};
};


describe("link_to_coords", function(){
	
	beforeEach(function(done){
		loadKaryoFile(karyoFile, function(data){
			karyo_to_coords(data);
			returnKaryo=data.chromosomes;
			
			loadLinkFile(linkFile, function(data){
			returnLinks=data;
			
			links=0;
			karyo=0;
			done();
			});
		});
	});
	it("should test if links and karyo are defined when they are returned from their functions", function(){
		expect(returnKaryo).toBeDefined();
		expect(returnLinks).toBeDefined();
	});
	
	it("should test if there is a function which get the defined karyo and links and which should create the ribbon information", function(){
		links = returnLinks;
		karyo = returnKaryo;
		expect(link_to_coords(links, karyo)).toEqual(links);

	})
	
//	it("should test if the new links contain the ribbon information", function(){
//		expect(links).toContainRibbon();
//	})

});

describe("the important information which is saved in the link file", function(){
	
	beforeEach(function() {
		    jasmine.addMatchers(CustomMatchers);
		  });
		
		  it("should behave...", function() {
		    expect(1).toContainRibbon(); // toBeAnInteger() should now be in scope and available
		  });
		  
});	



