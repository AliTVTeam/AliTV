var karyoFile = "data/karyo.json";

if(navigator.userAgent.match(/phantomjs/i)){	
	karyoFile = "https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/karyo.json";
};

describe("test the correct verification of the karyofile", function() {
	it("the name of karyo file should be defined", function() {
		var file = "data/karyo.json";
		expect(file).toBeDefined();
	});
});


describe("loadKaryoFile", function() {
			var returnData;
			var expectedChromosomes = {
				"Q_s6" : {
					"genome_id" : 1,
					"rc" : false,
					"length" : 416406,
					"seq" : null
				},
				"Q_s8" : {
					"length" : 257437,
					"genome_id" : 1,
					"rc" : false,
					"seq" : null
				},
				"R_gi_222106127_ref_NC_011988.1_" : {
					"length" : 1283187,
					"rc" : false,
					"genome_id" : 0,
					"seq" : null
				},
				"Q_s2" : {
					"seq" : null,
					"length" : 531783,
					"rc" : false,
					"genome_id" : 1
				},
				"Q_s22" : {
					"length" : 117247,
					"genome_id" : 1,
					"rc" : false,
					"seq" : null
				}
			};
			var expectedOrder = [ "R_gi_222106127_ref_NC_011988.1_", "Q_s6",
					"Q_s8", "Q_s22", "Q_s2" ];

			beforeEach(function(done) {
				loadKaryoFile(karyoFile, function(data) {
					returnData = data;
					done();
				});
			});

			it("the external karyo file should be load in and we have the chromosome object. data should contain the chromosomes object we expected", function() {
				expect(returnData.chromosomes).toEqual(expectedChromosomes);
			});

			it("the external karyo file should be load in and we have the order array. data should contain the data obkect we expected", function() {
				expect(returnData.order).toEqual(expectedOrder);
			});			
});

describe("Spy on loadKaryoFile", function(){
	//es wird ein test-Objekt loadKaryo angelegt, welches als test-Eigenschaft den Aufruf auf die Funktion loadKaryoFile enthält
	var loadKaryo = {};
	loadKaryo.test = function test(karyoFile){
		loadKaryoFile(karyoFile);
	}
	
	//vor jedem spec wird der spy auf loadKaryo gesetzt
	beforeEach(function() {
		spyOn(loadKaryo, 'test');
	    loadKaryo.test(karyoFile);
	});
	
	
	it("the spy tracks that the function loadKaryoFile was called", function() {
	    expect(loadKaryo.test).toHaveBeenCalled();
	});
	
	it("the spy tracks the arguments of loadKaryoFile. In this case the arguments are either the filename or when you use grunt the url to the github-page. " +
			"The test fails when you not assign the access to the data", function() {
		if(navigator.userAgent.match(/phantomjs/i)){	
			expect(loadKaryo.test).toHaveBeenCalledWith("https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/karyo.json");
		}
		else{
			expect(loadKaryo.test).toHaveBeenCalledWith("data/karyo.json");
		}
	    
	});

})