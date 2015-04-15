describe('The constructor is supposed a proper WgaPipeline object', function(){
	it('Constructor wgaPipeline exists', function(){
		expect(WgaPipeline).toBeDefined();
	});
	var svg = $('<svg></svg>');
	var wga = new WgaPipeline(svg);
	it('WgaPipelie object is not null', function(){
		expect(wga).not.toBeNull();
	});
	it('the svg property is properly set', function(){
		expect(wga.svg).toEqual(svg);
	});
	it('the data property is initialized as empty object', function(){
		expect(wga.data).toEqual({});
	});
});