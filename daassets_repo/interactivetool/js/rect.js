(function($) {
$.fn.rectTool = function(painter) {

// DECLARE VARIABLES
var $canvas = this;
$canvas.unbind();

var width = 0;
var height = 0;
var startX, startY, endX, endY;

// MAKE RECTANGLES
function makeRect() {
$canvas.drawRect({
	fillStyle: painter.color,
	x: startX, y: startY,
	width: width,
	height: height,
	fromCenter: true
});
}

// MOUSE DOWN STARTS DRAWING
$canvas.on(painter.getTouchEventName('mousedown'), function(event) {
	painter.hist.push(painter.last.src=$canvas[0].toDataURL('image/png'));
	startX = event.offsetX;
	startY = event.offsetY;
	makeRect();
	painter.drag = true;
	return false;
});

// MOUSE UP STOPS DRAWING
$canvas.on(painter.getTouchEventName('mouseup'), function() {
	painter.drag = false;
	width = 0;
	height = 0;
painter.last.src=$canvas[0].toDataURL('image/png');
});

// DETECT SHIFT KEY
$(document)
.keydown(function(event) {
	if (event.keyCode === 16) {painter.press = true;}
})
.keyup(function(event) {
	if (event.keyCode === 16) {painter.press = false;}
});

// DRAG MOUSE TO DRAW
$canvas.on(painter.getTouchEventName('mousemove'), function(event) {
if (painter.drag === true) {

	$canvas.clearCanvas()
	.drawImage({
		source:painter.last.src,
		x: 0, y: 0,
		fromCenter: false,
		load: function() {

			endX = event.offsetX + (width/2);
			endY = event.offsetY + (height/2);

			width = (endX - startX);
			height = (endY - startY);

			if (painter.press === true) {
				height = width;
			}

			makeRect();

		}
	});

}
});

};
})(jQuery);
