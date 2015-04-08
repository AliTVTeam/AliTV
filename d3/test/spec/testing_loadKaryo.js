var karyoFile = "data/karyo.json";

if(navigator.userAgent.match(/phantomjs/i)){	
	karyoFile = "https://raw.githubusercontent.com/BioInf-Wuerzburg/wgaPipeline/d3.js/d3_test/data/karyo.json";
};

describe("test the verification of the karyofile", function() {
	it("karyo file should be defined", function() {
		var file = "data/karyo.json";
		expect(file).toBeDefined();
	});
	it("the karyo file in the function should be defined", function() {
		expect(loadKaryoFile(karyoFile)).toBeDefined();
	});

});


describe(
		
		"loadKaryoFile",
		function() {
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

			it(
					"the external karyo file should be load in and we have the chromosome object",
					function() {
						expect(returnData.chromosomes).toEqual(
								expectedChromosomes);
					});

			it(
					"the external karyo file should be load in and we have the order array",
					function() {
						expect(returnData.order).toEqual(expectedOrder);
					});
			


		});
