var dataChromosomes = {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}};
var dataOrder = ["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"];

	describe("karyo_to_coords", function(){	
		var data = {chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}}, order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
		//testet, ob die Funktion wirklich aufgerufen wird und ob das richtige data übergeben wird
		it("should test if data is defined", function(){
			expect(karyo_to_coords(data)).toBeDefined();
		});
	
	describe("set_spacer", function(){
		var data = {chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}}, order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
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
		var data = {chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}}, order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
		var testData={chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null, "name":"Q_s6"},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null, "name":"Q_s8"},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null, "name":"R_gi_222106127_ref_NC_011988.1_"},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1,"name":"Q_s2"},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null, "name":"Q_s22"}}, 
						order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
		
		it("should expand the original object data.chromosomes which should differ from the new one", function(){
			expect(karyo_to_coords(data)).not.toEqual(testData);
			var testName = testData.chromosomes["Q_s2"].name;
			expect(karyo_to_coords(data)).toContain(testName);
		});
	});
	
});

