describe(
		'Testing D3.js, but first test the general svg-element',
		function() {
			var c;
			beforeEach(function() {
				c = createSimpleSvg();
				c.render();
			});

			afterEach(function() {
				d3.selectAll('svg').remove();
			});

			describe('the svg', function() {
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

 describe(
 'testing the data of drawKaryo',
 function() {
 it('should be null if no data has been specified',
 function() {
 expect(c.getData()).toBeNull();
 });
 it(
 'karyo should be load in and it would able to update data with karyo',
 function() {
 c.setData(karyo);
 expect(c.getData()).toBe(karyo);
 });
 });
 });

 describe('adding the g to svg and create the karyo element', function() {
 beforeEach(function() {
 c = createSimpleSvg();
 c.render();
 });

 afterEach(function() {
 d3.selectAll('svg').remove();
 });

 it('should test if there is a function drawKaryo', function() {
 expect(drawKaryo(karyo)).toBeDefined();
 })

 it('should test if the karyo element really exists', function() {
 expect(getKaryo()).not.toBeNull();
 })

 it('should test if the karyo element has the right class', function() {
 expect(getKaryoClass()).not.toBeNull();
 })

 function getKaryo() {
 return d3.select('g');
 }

 function getKaryoClass() {
 return d3.select(".karyo g");
 }
 });


 describe("Mouseover event", function() {
	 var spyEvent;
	 beforeEach(function() {
		 drawKaryo(returnKaryo);
	 });

	 it("links should change their opacity", function() {
		 spyEvent = spyOnEvent('karyo', 'mouseover');
		 $('.karyo').trigger("mouseover");

		 expect(karyo.style('opacity')).toEqual(0.1);

		 var spyEvent = spyOnEvent('.karyo', 'mouseover')
		 $('.karyo').trigger("mouseover")

		 expect('mouseover').toHaveBeenTriggeredOn('.karyo')
		 expect(spyEvent).toHaveBeenTriggered()
	 });
	 it("simulate the mouseclick on the rects and the spy tracks the function,which should have been called", function() {
			 spyEvent = spyOnEvent('rect', 'click');
			 $('rect').d3Click();
	
			 expect('click').toHaveBeenTriggeredOn('rect');
			 expect(spyEvent).toHaveBeenTriggered();
 	});

 });

 function loadChart() {
 loadFixtures('d3_linear.html');
 }
