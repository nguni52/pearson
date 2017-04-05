(function($) {
$.fn.brushTool = function(painter) {

// SET ESSENTIALS
var $canvas = this;
$canvas.unbind();
painter.clicks = 0;
var startX, startY, endX, endY;

var drawLine = function() {
	$canvas.drawLine({
		strokeWidth: painter.stroke,
		strokeStyle: painter.color,
		strokeCap: 'round',
		strokeJoin: 'round',
		x1: startX, y1: startY,
		x2: endX, y2: endY
	});
};

$canvas.on(painter.getTouchEventName('mousedown'), function(event) {
	painter.hist.push(painter.last.src=$canvas[0].toDataURL('image/png'));
	painter.undoHist.length = 0;
	if (painter.press === true) {painter.clicks = 0;}
	if (painter.clicks === 0) {
		painter.drag = true;
		startX = event.offsetX;
		startY = event.offsetY;
		endX = startX;
		endY = startY;
		console.log(startX, startY);
		$canvas.drawArc({
			fillStyle: painter.color,
			x: startX, y: startY,
			radius: (painter.stroke / 2),
			start: 0,
			end: 360
		});
		painter.clicks += 1;
	}
	console.log('DOWN');
	return false;
});

$canvas.on(painter.getTouchEventName('mouseup'), function() {
	console.log('UP');
	painter.drag = false;
	painter.last.src = $canvas[0].toDataURL('image/png');
	painter.clicks = 0;
});

$canvas.on(painter.getTouchEventName('mousemove'), function(event) {
	if (painter.drag === true && painter.clicks >= 1) {
		console.log('DRAG');
		startX = endX;
		startY = endY;
		endX = event.offsetX;
		endY = event.offsetY;
		drawLine();
	}
});

};
})(jQuery);
