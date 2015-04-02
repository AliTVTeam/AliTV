// Perform D3 click events with jquery
// http://stackoverflow.com/a/11180172

jQuery.fn.d3Click = function() {
	this.each(function(i, e) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		e.dispatchEvent(evt);
	});
};