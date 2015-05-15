// Perform D3 click events with jquery
// http://stackoverflow.com/a/11180172

jQuery.fn.d3Trigger = function(type) {
	this.each(function(i, e) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		e.dispatchEvent(evt);
	});
};
