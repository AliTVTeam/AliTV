var width=1200;
var height=3000;

function createSimpleSvg() {
	var that = {};
	var data = null;
	
	var array = $.map(karyo, function(value, index) {
		return [ value ];
	});
	
	that.setData = function(d) {
        data = d;
    };

    that.getData = function() {
        return data;
    }
    
	that.render = function() {
			var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height",height)
			.append("g");			
	};		
	return that;
}

function drawKaryo(karyo){
	var svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height",height)
	.append("g");
	
	svg.append("g")
	.selectAll("path")
	.attr("class","karyo")
	.data(karyo)
	.enter()
	.append("rect")
				
	return true;
}