var width = 1200, height = 800, innerRadius = Math.min(width, height) * .41, outerRadius = innerRadius * 1.1;
var identity = {percent: ["Identity", "<46 %", "50 %", "54 %", "58 %", "62 %", "66 %", "70 %", "74 %", "78 %", "82 %", "86 %", "90 %", "94 %", ">98 %"], 
				color: ["white", "#FF1600", "#FF3500", "#FF5300", "#FF7C01", "#FF9B01", "#FFC301", "#FFE201", "#EBDD02", "#CCD602", "#B7D103", "#99C905", "#7AC206", "#51B807", "#32B008"]};
// var fill = d3.scale.ordinal().domain(d3.range(5)).range(
// [ "#000000", "#FFDD89", "#957244", "#F26223", "#00FF00" ]);

// var fill = d3.scale.ordinal()
// .domain(d3.range(5))
// .range(["#2C06B5", "#0AF7EF"]);


var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g").attr("transform",
		"translate(" + width / 2 + "," + height / 2 + ")");
var fill = d3.scale.category20c();
var legendRectSize = 18;
var legendSpacing = 4;
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	div.append("div")
		.attr("class", "label")
		

var legend = svg.selectAll('.legend')
			.data(identity.percent)
            .enter()
            .append('g')
            .attr('class', 'legend')

for(var i=0;i<=14;i++){
var pos_x = 480;
var pos_y = -370 + i*25;
var pos_x_text = 505;
var pos_y_text = -352 + i*25;
legend.append('rect')
	.attr('x', pos_x)
	.attr('y', pos_y)
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)                                   
    .style('fill', identity.color[i])
    .style('stroke', identity.color[i]);


legend.append('text')
	.attr('x', pos_x_text + legendSpacing)
	.attr('y', pos_y_text - legendSpacing)
	.text(identity.percent[i]);
}
