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
		});
		
		
		it("the spy tracks that the function loadKaryoFile was called", function() {
		    getRibbon.test(links);
		    expect(getRibbon.test).toHaveBeenCalled();
		});
		
		//noch ein spy-test, testet eigentlich fast auf den gleichen inhalt wie beim vorherigen test
		
		it("the spy tracks if it was called at all", function() {
		    expect(getRibbon.test.calls.any()).toEqual(false);

		    getRibbon.test(links);

		    expect(getRibbon.test.calls.any()).toEqual(true);
		  });

});
});


