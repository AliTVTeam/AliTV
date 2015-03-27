describe('Testing D3.js, but first test the general svg-element', function() {
  var c;
  beforeEach(function() {
    c = createSimpleSvg();
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

describe('adding the g to svg and create the karyo element', function(){
	beforeEach(function() {
	    c = createSimpleSvg();
	    c.render();
	  });
	
	afterEach(function(){
		d3.selectAll('svg').remove();
	});
	
	it('should test if there is a function drawKaryo', function(){
		expect(drawKaryo(karyo)).toBeDefined();
	})
	
	it('should test if the karyo element really exists', function(){
		expect(getKaryo()).not.toBeNull();
	})
	
	it('should test if the karyo element has the right class', function(){
		expect(getKaryoClass()).not.toBeNull();
	})
	
	function getKaryo(){
		return d3.select('g');
	}
	
	function getKaryoClass(){
		return d3.select(".karyo g");
	}
	describe("Mouseover events", function() {
		var rect = d3.select('.karyo').attr("id", "rect");;
		var spyEvent;
		
		beforeEach(function() {
			loadChart();
		});
		
		it("links should change their opacity", function() {
			spyEvent = spyOnEvent('#rect', 'mouseover');
			$('.karyo').trigger("mouseover");
			expect(karyo.style('fill')).toEqual('rgb(255,0,0)');
		});
		
	});
})

function loadChart() {
    loadFixtures('d3_linear.html');
}


 


