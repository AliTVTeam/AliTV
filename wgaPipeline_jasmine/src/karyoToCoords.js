function karyo_to_coords(data) {
	var total=[0,0];
	var current=[0,0];

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
	spacer = spacer * 0.0038; // ca. 4% der Gesamtsumme aller Sequenzen								// entsprechen dem geeigneten Spacer
	return spacer;
}