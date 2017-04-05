(function($) {
$.fn.pathTool = function(painter) {

// SET ESSENTIALS
var $canvas = this;
$canvas.unbind();
painter.clicks = 0;
var startX, startY, endX, endY, controlX, controlY, dragX, dragY;

var drawLine = function() {
	$canvas.drawLine({
		strokeWidth: painter.stroke,
		strokeStyle: painter.color,
		strokeCap: 'round',
		strokeJoin: 'round',
		x1: startX, y1: startY,
		x2: endX, y2: endY,
	});
};

// DETECT SHIFT KEY
$(document).keydown(function(event) {
	if (event.keyCode === 16) {painter.press = true;}
});
$(document).keyup(function(event) {
	if (event.keyCode === 16) {painter.press = false;}
});

$canvas.on(painter.getTouchEventName('mousedown'), function(event) {
	painter.hist.push(painter.last.src=$canvas[0].toDataURL('image/png'));
	painter.undoHist.length = 0;
	if (painter.press === true) {painter.clicks = 0;}
	if (painter.clicks === 0) {
		startX = event.offsetX;
		startY = event.offsetY;
		$canvas.drawArc({
			fillStyle: painter.color,
			x: startX, y: startY,
			radius: (painter.stroke / 2),
			start: 0,
			end: 360
		});
		painter.clicks++;
	} else if (painter.clicks === 1) {
		endX = event.offsetX;
		endY = event.offsetY;
		drawLine();
		painter.drag = true;
		painter.clicks++;
	} else if (painter.clicks >= 1) {
		startX = endX;
		startY = endY;
		endX = event.offsetX;
		endY = event.offsetY;
		drawLine();
		painter.drag = true;
	}
	return false;
});

$canvas.on(painter.getTouchEventName('mouseup'), function() {
if (painter.clicks >= 1) {
	painter.drag = false;
}
if (painter.clicks >= 1) {
painter.last.src = $canvas[0].toDataURL('image/png');
}
});

$canvas.on(painter.getTouchEventName('mousemove'), function(event) {
if (painter.drag === true) {
	$canvas.clearCanvas()
	.drawImage({
		source:painter.last.src,
		x: 0, y: 0,
		fromCenter: false,
		load: function() {

			dragX = event.offsetX;
			dragY = event.offsetY;

			controlX = endX - (dragX - endX);
			controlY = endY - (dragY - endY);

			$canvas.drawQuadratic({
				strokeWidth: painter.stroke,
				strokeStyle: painter.color,
				strokeCap: 'round',
				x1: startX, y1: startY,
				cx1: controlX, cy1: controlY,
				x2: endX, y2: endY
			});

		}
	});
}
});

};
})(jQuery);
