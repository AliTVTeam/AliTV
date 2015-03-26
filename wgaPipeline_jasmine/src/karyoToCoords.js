function karyo_to_coords(data) {
	var genome_order = {};
	var line = 1;
	var lastLine, i, key;
	for (i = 0; i < data.order.length; i++) {
		key = data.order[i];
		genome_order[key] = {
			"line" : line
		};
		line = line + 1;
	}

	$.each(genome_order, function(key, value) {
		lastLine = value.line;
	});

	var total = [];
	var current = [];
	for (i = 0; i < lastLine; i++) {
		total.push(0);
		current.push(0);
	}
	var index = 0;

	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total[value.genome_id] += value.length + spacer;
	});

	for (i = 0; i < data.order.length; i++) {
		key = data.order[i];
		var value = data.chromosomes[key];
		data.chromosomes[key] = {
			"value" : value.length,
			"index" : index++,
			"x" : (current[value.genome_id] / total[value.genome_id]) * width,
			"width" : (value.length / total[value.genome_id]) * width,
			"genome_id" : value.genome_id,
			"name" : key
		};
		current[value.genome_id] += value.length + spacer;
	}
	
	return data.chromosomes;
}

function set_spacer(data) {
	var spacer = 0;
	$.each(data.chromosomes, function(key, value) {
		spacer += value.length;
	});
	spacer = spacer * 0.0038; // ca. 4% der Gesamtsumme aller Sequenzen //
								// entsprechen dem geeigneten Spacer
	return spacer;
}
