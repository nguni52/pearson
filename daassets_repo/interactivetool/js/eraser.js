(function($) {
$.fn.eraserTool = function(painter) {

// SET ESSENTIALS
var $canvas = this;
$canvas.unbind();
var centerX;
var centerY;

// PAINT ON CANVAS
function erase() {
	$canvas.drawArc({
		fillStyle: '#fff',
		x: centerX, y: centerY,
		radius: painter.stroke / 2
	});
}

// MOUSE UP STOPS DRAWING
$canvas.on(painter.getTouchEventName('mousedown'), function(event) {
	painter.hist.push(painter.last.src=$canvas[0].toDataURL('image/png'));
	painter.undoHist.length = 0;
	painter.drag = true;
	centerX = event.offsetX;
	centerY = event.offsetY;
	erase();
	return false;
});
$canvas.on(painter.getTouchEventName('mouseup'), function() {
	painter.drag = false;
});

// DRAG MOUSE TO DRAW
$canvas.on(painter.getTouchEventName('mousemove'), function(event) {
if (painter.drag === true) {
	centerX = event.offsetX;
	centerY = event.offsetY;
	erase();
}
});

}
})(jQuery);
