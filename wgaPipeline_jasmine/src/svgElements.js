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
	.on("mouseover", function(g, i) {
			fade(g, i, 0.1);
			add_tooltip_legend(g);
			})
	.on("mouseout", function(g, i) {
				fade(g, i, 1);
				reAdd_tooltip_legend();
		})
	.on("click", function(g, i){
		svg.selectAll(".chord path").remove();
		svg.selectAll(".ticks g").remove();
		create_new_karyo(karyo, g);
		var array = $.map(karyo, function(value, index) {
			return [ value ];
		});
		loadLinkFile("data/link.json", karyo, function(links) {
			full_links = links;
			redraw(identity_range, min_length);
		});
	})
	.style(
		"fill", function(d) {
			return fill(d.index);
		})
	.style("stroke", function(d) {
		return fill(d.index);
		})
		.attr("x", function(d) {
			return d.x
		})
		.attr("y", function(d){
			return 500 * d.genome_id 
		})
		.attr("width", function(d) {
			return d.width
		})
		.attr("height", 30);
				
	return true;
}

function fade(g, i, opacity) {
	svg.selectAll(".chord path")
	.filter(function(d) {
		return d.source.index != g.index && d.target.index != g.index;
	})
	.transition()
	.style("opacity", opacity);
}