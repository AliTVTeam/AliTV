function loadKaryoFile(file, callback){
	$.getJSON(file, function(data) {
		if (typeof callback !== "undefined") {
			callback(data);
		}
	});
	return file;
}

function karyo_to_coords(data) {
	var genome_order={};
	var line = 0;
	var lastLine;
	for(var i=0;i<data.order.length;i++){
		var key = data.order[i];
		genome_order[key] = {
				"line":line
		}
		line = line + 1;
	}
	
	$.each(genome_order, function(key, value){
		console.log(key);
		lastLine=value.line
	})

	var total=[];
	var current=[];
	for(var i=0;i<lastLine;i++){
		total.push(0);
		current.push(0);
	}

	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});
	var index = 0;	
	
	data.chromosomes["Q_s6"].x = 1000;
	
	return data;
}

function set_spacer(data){
	var spacer = 0;
	$.each(data.chromosomes, function(key, value) {
		spacer += value.length;
	});
	spacer = spacer * 0.0038; // ca. 4% der Gesamtsumme aller Sequenzen
								// entsprechen dem geeigneten Spacer

	console.log(spacer);
	return spacer;
}