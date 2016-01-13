var renderer;
var stage;

var interval;

var mapRect = {x:100, y:50,
	with:mapCols * boxSize,
	height:mapRows * boxSize};

var dynamicBoxesArray = new Array();
var staticBoxesArray = new Array();

var currentPivotBoxId;


initStage();

function initStage()
{
	renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	stage.interactive = true;

	animate();

	var bgGraphic = new PIXI.Graphics();
	bgGraphic.lineStyle(1);
	bgGraphic.beginFill(0xAFC8ED, 1);
	bgGraphic.drawRect(0,0,mapRect.with,mapRect.height);
	bgGraphic.endFill();
	bgGraphic.x = mapRect.x;
	bgGraphic.y = mapRect.y;
	stage.addChild(bgGraphic);

	newGame();
}


function newGame() {
	clearInterval(interval);
	interval = setInterval( tick, 500 );

	clearArray(staticBoxesArray);

	addFigure();
}

function tick (direction) {

	if (direction == undefined)
		direction = 'down';

	var figureRect = getFigureRect();

	if (checkForOutOfMap(figureRect, direction)) return;

	if (checkForLanding(figureRect))
	{
		moveFigureToStatic();

		if (checkTopOfMap(figureRect))
			newGame()
		else
			addFigure();

		return;
	}

	shiftFigure(direction);
}

function addFigure()
{
	var figureInitColPos = 2;

	var figureId = Math.floor(Math.random()*figuresArray.length);

	var figureMap = figuresArray[figureId].figureMap;
	var figureColor = figuresArray[figureId].figureColor;
	currentPivotBoxId = figuresArray[figureId].figurePivotBoxId;

	for (var i = 0; i < figureMap.length; i++)
	{
		if (figureMap[i] != 0)
		{
			var box = addBox(figureColor);
			box.x = (figureInitColPos + i % 4) * boxSize + mapRect.x;
			box.y = Math.floor(i / 4) * boxSize  + mapRect.y;
			dynamicBoxesArray.push(box);
			stage.addChild(box);
		}
	}
}

function addBox(color)
{
	var graphics = new PIXI.Graphics();

	graphics.lineStyle(1);
	graphics.beginFill(color, 1);
	graphics.drawRect(0,0,boxSize,boxSize);
	graphics.endFill();
	
	return graphics;
}



function getFigureRect() {
	var figureRect = {  left:dynamicBoxesArray[0].x,            top:dynamicBoxesArray[0].y,
						right:dynamicBoxesArray[0].x + boxSize, bottom:dynamicBoxesArray[0].y + boxSize };

	var currentBox;
	for (var i = 1; i < dynamicBoxesArray.length; i++)
	{
		currentBox = dynamicBoxesArray[i];

		figureRect.left = Math.min(figureRect.left, currentBox.x);
		figureRect.right = Math.max(figureRect.right, currentBox.x + boxSize);
		figureRect.bottom = Math.max(figureRect.bottom, currentBox.y + boxSize);
	}

	return figureRect;
}


function checkForLanding(figureRect) {

	if  (figureRect.bottom >= mapRect.height + mapRect.y) return true;

	for (var i = 0; i < staticBoxesArray.length; i++)
	{
		var staticBox = staticBoxesArray[i];

		if ( (staticBox.x >= figureRect.left) &&
			 (staticBox.x <= figureRect.right) &&
			 (staticBox.y <= figureRect.bottom) )
		{
			return true
		}
	}

	return false;
}

function checkForOutOfMap(figureRect, direction)
{
	if (    (direction == RIGHT_MOVE && figureRect.right >= mapRect.with + mapRect.x) ||
			(direction == LEFT_MOVE && figureRect.left <= mapRect.x))
	{
		return true;
	}
	else
	{
		return false;
	}

}

function checkTopOfMap(figureRect)
{
	if (figureRect.top <= mapRect.x)
		return true
	else
		return false;
}

function shiftFigure(direction)
{
	var box;

	if (direction == ROTATE_MOVE)
	{
		rotateFigure();
		return;
	}

	for (var i = 0; i < dynamicBoxesArray.length; i++)
	{
		box = dynamicBoxesArray[i];
		switch(direction) {
			case LEFT_MOVE:
				box.x -= boxSize;
				break;
			case RIGHT_MOVE:
				box.x += boxSize;
				break;
			case DOWN_MOVE:
				box.y += boxSize;
				break;
		}
	}
}

function rotateFigure()
{
	var currentBox;
	var centerBox = dynamicBoxesArray[currentPivotBoxId];
	var x1,x2,y1,y2;
	for (var i = 0; i < dynamicBoxesArray.length; i++)
	{
		currentBox = dynamicBoxesArray[i];

		x1 = currentBox.x;
		y1 = currentBox.y;

		x1 -= centerBox.x;
		y1 -= centerBox.y;

		x2 = - y1;
		y2 = x1;

		x2 += centerBox.x;
		y2 += centerBox.y;

		currentBox.x = x2;
		currentBox.y = y2;
	}

}

function clearArray(array)
{
	do
	{
		stage.removeChild(array.pop());
	}
	while (array.length > 0);
}

function moveFigureToStatic()
{
	do
	{
		staticBoxesArray.push( dynamicBoxesArray.pop() );
	}
	while (dynamicBoxesArray.length > 0);
}


function animate()
{
	renderer.render(stage);
	requestAnimationFrame( animate );
}