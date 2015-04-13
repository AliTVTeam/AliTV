describe('The constructor is supposed to create a non empty object', function(){
	it('Constructor wgaPipeline exists', function(){
		expect(wgaPipeline).toBeDefined();
	});
	var svg = $('<svg></svg>');
	var wga = new wgaPipeline(svg);
	it('wgaPipelie object is not null', function(){
		expect(wga).not.toBeNull();
	});
	it('the svg property is properly set', function(){
		expect(wga.svg).toEqual(svg);
	});
});