(function($) {
$.fn.ellipseTool = function(painter) {

// SET ESSENTIALS
var $canvas = this;
$canvas.unbind();

var startX, startY, endX, endY, width, height;

// DRAW ELLIPSE
function makeEllipse() {
	$canvas.drawEllipse({
		fillStyle: painter.color,
		x: startX, y: startY,
		width: width, height: height
	});
}
// DRAW CIRCLE
function makeCircle() {
	$canvas.drawArc({
		fillStyle: painter.color,
		x: startX, y: startY,
		radius: Math.abs(width)/2,
		fromCenter: true
	});
}


// MOUSE DOWN STARTS DRAWING
$canvas.on(painter.getTouchEventName('mousedown'), function(event) {
	painter.hist.push(painter.last.src=$canvas[0].toDataURL('image/png'));
	painter.undoHist.length = 0;
	painter.drag = true;

	width = 0;
 	height = 0;
 	startX = event.offsetX;
	startY = event.offsetY;

	makeEllipse();
	return false;
});

// MOUSE UP STOPS DRAWING
$canvas.on(painter.getTouchEventName('mouseup'), function() {
	painter.drag = false;
	painter.last.src = $canvas[0].toDataURL('image/png');
});

// DETECT SHIFT KEY
$(document).keydown(function(event) {
	if (event.keyCode === 16) {painter.press = true;}
});
$(document).keyup(function(event) {
	if (event.keyCode === 16) {painter.press = false;}
});

$canvas.on(painter.getTouchEventName('mousemove'), function(event) {
if (painter.drag === true) {

	$canvas
	.clearCanvas()
	.drawImage({
		source:painter.last.src,
		x: 0, y: 0,
		fromCenter: false,
		load: function() {

			endX = event.offsetX + (width / 2);
			endY = event.offsetY + (height / 2);
			width = endX - startX;
			height = endY - startY;

			if (painter.press === true) {
				makeCircle();
			} else if (painter.press === false) {
				makeEllipse();
			}

		}
	});

}
});

};
})(jQuery);
