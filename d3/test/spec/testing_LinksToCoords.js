var returnKaryo;
var returnLinks;
var links;
var karyo;

describe("describe function link_to_coords for the linear version of the AliTV", function(){
describe("general tests", function(){
	beforeEach(function(done){
		loadKaryoFile(karyoFile, function(data){
			karyo_to_coords(data);
			returnKaryo=data.chromosomes;
			
			loadLinkFile(linkFile, returnKaryo, function(data){
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

describe('the information which is saved in the link file for the linear version', function () {
    beforeEach(function () {
        jasmine.addMatchers({
            toContainRibbon: function () {
                return {
                    compare: function (actual, expected) {
                    	var ribbon = links[0].ribbon;
                        return {
                        	pass: actual[0].ribbon === ribbon,
                        	message: 'link contain ribbon information'
                        
                        };
                    }
                };
            }
        });
    });

    it('should contain the ribbon information', function () {
        expect(links).toContainRibbon();
    });

});
});

describe("describe link_to_coords for the circular version of the AliTV", function() {
			describe('the information which is saved in the link file for the circular version', function() {
						beforeEach(function(done) {
							loadKaryoFile(karyoFile, function(data) {
								karyo_to_coords(data);
								returnKaryo = data.chromosomes;

								loadLinkFile(linkFile, returnKaryo, function(
										data) {
									returnLinks = data;

									links = 0;
									karyo = 0;
									done();
								});
							});

						});

						beforeEach(function() {
							jasmine
									.addMatchers({
										toContainRibbon : function() {
											return {
												compare : function(actual,
														expected) {
													var ribbon = links[0].ribbon;
													return {
														pass : actual[0].ribbon === ribbon,
														message : 'link contain angle information'

													};
												}
											};
										}
									});
						});

						 it('in the linear version the link-object should contain the angle-information', function() {

						 });

					});
});


