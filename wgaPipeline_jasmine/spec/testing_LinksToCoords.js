var returnKaryo;
var returnLink;
var karyo;

beforeEach(function(done){
		loadKaryoFile(karyoFile, function(data){
			returnKaryo = data;
			done();
		});

});


//describe("link_to_coords", function(){	
//		var data = {chromosomes: {"Q_s6":{"genome_id":1,"rc":false,"length":416406,"seq":null},"Q_s8":{"length":257437,"genome_id":1,"rc":false,"seq":null},"R_gi_222106127_ref_NC_011988.1_":{"length":1283187,"rc":false,"genome_id":0,"seq":null},"Q_s2":{"seq":null,"length":531783,"rc":false,"genome_id":1},"Q_s22":{"length":117247,"genome_id":1,"rc":false,"seq":null}}, order:["R_gi_222106127_ref_NC_011988.1_","Q_s6","Q_s8","Q_s22","Q_s2"]}; 
//		//testet, ob die Funktion wirklich aufgerufen wird und ob das richtige data übergeben wird
//		it("should test if data is defined", function(){
//			expect(karyo_to_coords(data)).toBeDefined();
//		});
//});