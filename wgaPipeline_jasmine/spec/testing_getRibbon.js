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
	
	
	it("should test if links and karyo are defined when they are returned from their functions", function(){
		
	});
	

});	


