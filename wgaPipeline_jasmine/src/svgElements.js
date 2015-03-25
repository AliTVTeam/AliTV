var width=1200;
var height=3000;

function drawKaryo() {
	var that = {};
	
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	
	that.render = function() {
			var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height",height)
			.append("g");
	};
	
	return that;
}
