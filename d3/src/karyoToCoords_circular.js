function karyo_to_coords(data) {
	var total = 0;
	var spacer = set_spacer(data);
	$.each(data.chromosomes, function(key, value) {
		total += value.length + spacer;
	});
	var current = 0;
	var index = 0;
	for (var i = 0; i < data.order.length; i++) {
		var key = data.order[i];
		var value = data.chromosomes[key];
		data.chromosomes[key] = {
			"value" : value.length,
			"startAngle" : ((current + spacer) / total) * (2 * Math.PI),
			"index" : index++,
			"genome_id" : value.genome_id,
			"name" : key,
			"rc" : value.rc
		};
		current += value.length + spacer;
		data.chromosomes[key].endAngle = (current / total) * (2 * Math.PI);

		if (value.rc === true) {
			var startAngle = data.chromosomes[key].startAngle;
			var endAngle = data.chromosomes[key].endAngle;
			data.chromosomes[key].startAngle = endAngle;
			data.chromosomes[key].endAngle = startAngle;
		}

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

function create_new_karyo(karyo, g) {
	var key = g.name;
	var endAngle = karyo[key].endAngle;
	var startAngle = karyo[key].startAngle;
	karyo[key] = {
		"value" : karyo[key].value,
		"startAngle" : endAngle,
		"index" : karyo[key].index,
		"genome_id" : karyo[key].genome_id,
		"name" : karyo[key].name,
		"endAngle" : startAngle,
		"rc" : false
	};
	return karyo;
}
