var returnKaryo;
var returnLinks;
var links;
var karyo;

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


});	


