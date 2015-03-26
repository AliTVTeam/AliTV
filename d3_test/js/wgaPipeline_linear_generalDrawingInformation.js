//Width und height legen die Zeichenfläche fest
var width = 1200;
var height = 3000;
var identity = {percent: ["Identity", "<46 %", "50 %", "54 %", "58 %", "62 %", "66 %", "70 %", "74 %", "78 %", "82 %", "86 %", "90 %", "94 %", ">98 %"], 
				color: ["white", "#FF1600", "#FF3500", "#FF5300", "#FF7C01", "#FF9B01", "#FFC301", "#FFE201", "#EBDD02", "#CCD602", "#B7D103", "#99C905", "#7AC206", "#51B807", "#32B008"]};

var fill = d3.scale.category20c();


//svg ist die zentrale Zeichenfläche, die alle Elemente der linearen wgaPipeline enthält
var svg = d3.select("body").append("svg").attr("width", width).attr("height",
		height).append("g");

var legendRectSize = 18;
var legendSpacing = 4;

//div ist der Tooltip
var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	div.append("div")
		.attr("class", "label")
		


