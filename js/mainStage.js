    var renderer;
    var stage;

    var interval;

    var dynamicBoxesArray = new Array();
    var staticBoxesArray = new Array();


    var mapRect = {x:100, y:50,
                   with:mapCols * boxSize,
                   height:mapRows * boxSize};

    initStage();

    function initStage() {
        renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
        document.body.appendChild(renderer.view);

        stage = new PIXI.Container();
        stage.interactive = true;

        animate();

        // scene
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


        addFigure();
    }



    function addFigure() {

        var figureInitColPos = 2;

        /*var box = addBox(figuresArray[3].figureColor);
        box.x = 3 * boxSize + mapRect.x;
        box.y = 1 * boxSize  + mapRect.y;
        dynamicBoxesArray.push(box);
        stage.addChild(box);*/

        var figureId = Math.floor(Math.random()*figuresArray.length);

        var figureMap = figuresArray[figureId].figureMap;
        var figureColor = figuresArray[figureId].figureColor;

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

    function addBox(color) {

        var graphics = new PIXI.Graphics();

        graphics.lineStyle(1);
        graphics.beginFill(color, 1);
        graphics.drawRect(0,0,boxSize,boxSize);
        graphics.endFill();

        graphics.lineStyle(1);
        graphics.beginFill(0x000000, 1);
        graphics.drawEllipse(0,0,2,2);
        graphics.endFill();

        return graphics;
    }

    function tick (direction) {

        if (direction == undefined)
            direction = 'down';

        if (checkForOutOfMap(getDirectionBorder(direction),direction)) return;

        shiftFigure(direction);

       /* if (checkForLanding(box))
        {
            moveFigureToStatic();
            addFigure();
            return;
        }*/


    }

    /*function getFigureBorder(direction) {

        switch(direction) {
            case DOWN_MOVE:
                dynamicBoxesArray.sort(compareBotomest);
                return dynamicBoxesArray[0].y;

            case LEFT_MOVE:
                dynamicBoxesArray.sort(compareLeftest);
                console.log("direct",dynamicBoxesArray[0].x);
                return dynamicBoxesArray[0].x;

            case RIGHT_MOVE:
                dynamicBoxesArray.sort(compareRightest);
                console.log("direct",dynamicBoxesArray[0].x);
                return dynamicBoxesArray[0].x;

        }

    }*/

    /*function compareLeftest(a, b) {
        return Math.max(a.x, b.x) ? 1 : -1;
    }

    function compareRightest(a, b) {
        return Math.min(a.x, b.x) ? 1 : -1;
    }

    function compareBotomest(a, b) {
        return Math.max(a.y, b.y) ? 1 : -1;
    }*/

    function getDirectionBorder(direction) {
        var resultBorder;
        var currentBox,prevBox;
        for (var i = 1; i < dynamicBoxesArray.length; i++)
        {
            currentBox = dynamicBoxesArray[i];
            prevBox = dynamicBoxesArray[i-1];
            switch(direction) {
                case LEFT_MOVE:
                    resultBorder = Math.min(currentBox.x, prevBox.x);
                    break;
                case RIGHT_MOVE:
                    resultBorder = Math.max(currentBox.x, prevBox.x);
                    break;
                case DOWN_MOVE:
                    resultBorder = Math.max(currentBox.y, prevBox.y);
                    break;
            }
        }

        switch(direction) {
            case LEFT_MOVE:
            case RIGHT_MOVE:
                console.log("die", resultBorder);
                break;
        }

        return resultBorder;
    }


    function checkForLanding(box) {

        if  ((box.y+boxSize) >= mapRect.height + mapRect.y) return true;

        for (var i = 0; i < staticBoxesArray.l1ength; i++)
        {
            var staticBox = staticBoxesArray[i];

            if ( (box.x == staticBox.x) && ( box.y + boxSize >= staticBox.y ) )
            {
                return true
            }
        }

        return false;
    }

    function checkForOutOfMap(borderX, direction) {
        if (    (direction == RIGHT_MOVE && borderX+boxSize >= mapRect.with + mapRect.x) ||
                (direction == LEFT_MOVE && borderX <= mapRect.x))
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    function shiftFigure(direction) {
        var box;
        for (var i = 0; i < dynamicBoxesArray.length; i++) {
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

    function moveFigureToStatic() {
        do
        {
            staticBoxesArray.push( dynamicBoxesArray.pop() );
        }
        while (dynamicBoxesArray.length > 0);
    }


    function animate() {
        renderer.render(stage);
        requestAnimationFrame( animate );
    }