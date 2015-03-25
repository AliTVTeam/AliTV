var returnKaryo;
var returnLinks;
var links;
var karyo;

describe("getRibbon", function(){
	
	beforeEach(function(done){
		loadKaryoFile(karyoFile, function(data){
			karyo_to_coords(data);
			returnKaryo=data.chromosomes;
			
		loadLinkFile(linkFile, function(data){
			links = data;
			link_to_coords(links,karyo);
			
			done();
			});
		});
	});
	
	
	it("should test if there is a function getRibbon which return shape", function(){
		expect(getRibbon(links)).toBeDefined();
	});
	

});	


