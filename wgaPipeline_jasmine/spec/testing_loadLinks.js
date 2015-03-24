describe("test the verification of file", function(){
	it("link file should be defined", function(){
		var file = "data/link.json";
		expect(file).toBeDefined();
	});	
	it("the link file in the function should be defined", function(){
		expect(loadKaryoFile("data/link.json")).toBeDefined();
	});
});


