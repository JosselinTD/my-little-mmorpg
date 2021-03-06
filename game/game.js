var currentLength = 0;
var canvasLength = 800;
var availableTime = 300; // en sec
var timeStart;
var availablesResources = [{
	probability: 0.2,
	type: 'yellow',
	count: 0
}, {
	probability: 0.5,
	type: 'green',
	count: 0
}];

Crafty.init(canvasLength, 600, 'stage')
	.background('grey');

generatePanel(canvasLength);

var player = Crafty.e("2D, Canvas, Color, Twoway, Gravity, Collision")
    .attr({x:10, y:520, w:30, h:40})
    .color("red")
    .twoway(200)
    .gravityConst(750)
    .gravity("Floor")
    .bind('Move', follow)
    .bind('Move', construct)
    .bind('Move', gameLimits)
    .checkHits('Resource')
    .bind('HitOn', hitResource)
    .one('KeyDown', startTimer);

var timeCounter = Crafty.e("2D, Canvas, Text")
	.attr({x: 10, y: 10})
	.text(availableTime);

var counterPlace = 40;
for (var resource of availablesResources) {
	resource.icon = Crafty.e("2D, Canvas, Color")
		.attr({x: 10, y: counterPlace, w: 10, h: 10})
		.color(resource.type);

	resource.counter = Crafty.e("2D, Canvas, Text")
		.attr({x: 30, y: counterPlace})
		.text(resource.count);

	counterPlace += 40;
}

function hitResource(hitData) {
	for(var r of hitData) {
		if (r.obj.gameType) {
			for (var resource of availablesResources) {
				if (r.obj.gameType === resource.type) {
					resource.count++;
					resource.counter.text(resource.count);
					r.obj.destroy();
					break;
				}
			}
		}
	}
}

function endGame(message) {
	Crafty.stop();
	if (confirm(`${message}\nWanna try again ?`)) {
		location.reload();
	}
}

function gameLimits() {
	if (this.y > 600) {
		endGame('Whoops, you die !');
	}
}

function startTimer() {
	timeStart = getCurrentTime();
	timeCounter.bind('EnterFrame', function(eventData) {
		var remainingTime = availableTime - (getCurrentTime() - timeStart);
		this.text(remainingTime);
		if (remainingTime <= 0) {
			endGame('Whoops, time\'s up !');
		}
	});
}

function getCurrentTime() {
	return Math.floor(Date.now() / 1000);
}

function generatePanel(size) {
	var origin = currentLength;
	var offset = 75;
	var limit = origin + canvasLength - offset;

	// Required extrimities
	makeGround(origin, 550, offset);
	makeGround(limit, 550, offset);

	// Random floor
	generateSection(origin + offset, limit, 550, true, availablesResources);

	currentLength += size;

	// Random etages
	generateSection(origin, currentLength, 450, false, availablesResources);
}

function generateSection(origin, limit, y, holeLimit, availablesResources) {
	availablesResources = availablesResources || [];
	var triggerSize = 100; // Minimal size for a platform or a hole
	var maxSection = Math.floor((limit - origin) / triggerSize); // Maximum number of platform and hole
	var nbSection = Math.floor(Math.random() * maxSection) + 1;
	var availableFloor = nbSection;
	var nbHole = 0;
	if (holeLimit) {
		availableFloor = Math.ceil(nbSection / 2);
		nbHole = nbSection - availableFloor;
	}
	var availableFloorSize = limit - origin;
	if (holeLimit) {
		availableFloorSize -= nbHole * triggerSize;
	}
	var i;
	for (i = 0; i < nbSection; i++) {
		var sectionSize = triggerSize;
		if (i % 2 !== 0 && holeLimit) {
			// Si c'est pas une plateforme et que les trous sont fixes
		} else {
			// Si c'est une section ou que les trous sont variables
			availableFloor--;
			if (availableFloor === 0) {
				sectionSize = availableFloorSize;
			} else {
				var floorSizeMax = availableFloorSize - availableFloor * triggerSize;
				sectionSize = Math.floor(Math.random() * (floorSizeMax - triggerSize)) + triggerSize;
				availableFloorSize -= sectionSize;
			}
			// Make a floor
			if (i % 2 === 0) {
				makeGround(origin, y, sectionSize);

				if (availablesResources.length) {
					for (var j = 0; j < Math.floor(sectionSize / triggerSize); j++) {
						var resource = availablesResources[Math.floor(Math.random() * availablesResources.length)];
						if (Math.random() <= resource.probability) {
							addResource(resource, (origin + j * triggerSize) + (triggerSize / 2), y - 20);
						}
					}
				}
			}
		}

		origin += sectionSize;
	}
}

function addResource(resource, x, y) {
	Crafty.e("2D, Canvas, Color, Resource")
		.attr({x, y, w: 10, h: 10, gameType: resource.type})
		.color(resource.type);
}

function makeGround(x, y, w) {
	Crafty.e("2D, DOM, Color, Floor")
		.attr({x, y, w, h:50})
		.color('blue');
}

function follow() {
	var offset = 150;
	var rect = Crafty.viewport.rect();

	if (this.x < offset || this.x + this.w > currentLength - offset) {
		return;
	}

	if (this.x < rect._x + offset) {
		var newVal = - (this.x - offset);
		Crafty.viewport.scroll('x', newVal);
		timeCounter.attr({x: -newVal + 10});
		for (var resource of availablesResources) {
			resource.icon.attr({x: -newVal + 10});
			resource.counter.attr({x: -newVal + 30});
		}
	}

	if (this.x + this.w > rect._x + rect._w - offset) {
		var newVal = - (this.x + this.w + offset - rect._w);
		Crafty.viewport.scroll('x', newVal);
		timeCounter.attr({x: -newVal + 10});
		for (var resource of availablesResources) {
			resource.icon.attr({x: -newVal + 10});
			resource.counter.attr({x: -newVal + 30});
		}
	}
}

function construct() {
	var offset = 200;
	if (this.x + this.w < currentLength - offset) {
		return;
	}

	generatePanel(canvasLength);
}
