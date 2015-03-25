describe('Testing the first D3.js function drawKaryo', function() {
  var c;

  beforeEach(function() {
    c = drawKaryo();
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
      expect(getSvg().attr('height')).not.toBe('3000');
    });

    it('should have the correct width', function() {
      expect(getSvg().attr('width')).not.toBe('1200');
    });
  });

  function getSvg() {
    return d3.select('svg');
  }

});
