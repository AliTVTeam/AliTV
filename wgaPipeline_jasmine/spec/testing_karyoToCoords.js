var data = {chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}}, order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
var dataChromosomes = {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}};
var dataOrder = ["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"];

	describe("karyo_to_coords", function(){	
		//testet, ob die Funktion wirklich aufgerufen wird und ob das richtige data übergeben wird
		it("should test if the assigned data ist the returned data", function(){
			expect(karyo_to_coords(data)).toEqual(data);
		});
	
	describe("set_spacer", function(){
		var expectedSpacer = 10000;	
		it("should call the function spacer, return a spacer and it should be less than to the expected spacer", function(){
			expect(set_spacer(data)).toBeLessThan(expectedSpacer);
		});
		
		it("should add the length of the sequences and return 0,0083 of the value to the spacer", function(){
			var testData = {chromosomes: {"Q_s2":{"length":531783}, "Q_s6":{"length":416406}}};
			expect(set_spacer(testData)).toEqual(3603.1182);
		});
	});
	
	describe("this part of karyo_to_coords add the drawing information to the data.chromosomes", function(){
		it("should expand the original object data.chromosomes which should differ from the new one", function(){
			console.log(data);
			expect(karyo_to_coords(data)).toEqual(data.chromosomes);
		});
	});
	
});

