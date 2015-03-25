describe('Testing the first D3.js function drawKaryo', function() {
  var c;

  beforeEach(function() {
	//var testData = karyo;
    c = drawKaryo();
    //c.setData(testData);
    c.render();
  });
  
  afterEach(function() {
    d3.selectAll('svg').remove();
  });

  describe('the svg' ,function() {
    it('should be created', function() {
        expect(getSvg()).not.toBeNull();
    });

    it('should have the correct height', function() {
      expect(getSvg().attr('height')).toBe('3000');
    });

    it('should have the correct width', function() {
      expect(getSvg().attr('width')).toBe('1200');
    });
  });

  function getSvg() {
    return d3.select('svg');
  }


describe('testing the data of drawKaryo' ,function() {	  
	it('should be null if no data has been specified', function() {
		expect(c.getData()).toBeNull();
	});
	it('karyo should be load in and it would able to update data with karyo', function() {
		c.setData(karyo);
		expect(c.getData()).toBe(karyo);
	});
});
});

describe('testing svg-Elements', function(){
	beforeEach(function() {
		var testData = karyo;
	    c = drawKaryo();
	    c.setData(testData);
	    c.render();
	  });
	
	it('new syntax: everything would be easier, but this test have to work: it should test if we have the correct data', function() {
		c.setData(karyo);
		expect(c.getData()).not.toBe(karyo);
	});
})
