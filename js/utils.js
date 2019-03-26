// Peg snap indexes
var rowOne = new Array();
var rowTwo = new Array();
var rowThree = new Array();

// Peg variables
var pegBlueOne;
var pegBlueTwo;
var pegYellowOne;
var pegYellowTwo;
var pegRedOne;
var pegRedTwo;

// Kenetic JS layers
var stage;
var pegLayer = new Konva.Layer();
var lineLayer = new Konva.FastLayer();

// Peg colors
var pegOneColor = '#2572EB';
var pegTwoColor = '#AED136';
var pegThreeColor = '#AD103C';

/**
* Class used for Point
*
*/
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/* 
    Kenetic JS Setup
*/
var simpleText = new Konva.Text({
    x: -10,
    y: -10,
    text: '',
    fontSize: 48,
    fontSyle: 'bold',
    fontFamily: 'Calibri',
    fill: 'green',
		    shadowColor: 'black',
		    shadowBlur: 5
});

/**
 * Used for displaying the red line in the app.
 *
 */
var redLine = new Konva.Line({
    points: [0, 0, 0, 0],
    stroke: pegThreeColor,
    strokeWidth: 5,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round'
});

/**
 * Used for displaying the yellow line in the app.
 *
 */
var yellowLine = new Konva.Line({
    points: [0, 0, 0, 0],
    stroke: pegTwoColor,
    strokeWidth: 5,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round'
});

/**
 * Used for displaying the blue line in the app.
 *
 */
var blueLine = new Konva.Line({
    points: [0, 0, 0, 0],
    stroke: pegOneColor,
    strokeWidth: 5,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round'
});

/**
* Build arrays of points to use for snaping the pegs into position.
*
*/
function buildArrays() {
    var xPos = 124;
    var yPos = 153;

    rowOne.push(new Point(59, 153));
    rowOne.push(new Point(76, 153));


    rowTwo.push(new Point(59, 199));
    rowTwo.push(new Point(76, 199));


    rowThree.push(new Point(59, 248));
    rowThree.push(new Point(76, 248));


    for (var i = 1; i <= 35; i++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos + 46));
        rowThree.push(new Point(xPos, yPos + 46 + 49));
        xPos += 16.45;
        if (i % 5 == 0) {
            xPos += 24;
        }

    }

    rowOne.push(new Point(886, 158.5));
    rowOne.push(new Point(942, 208.5));
    rowOne.push(new Point(965.5, 284));
    rowOne.push(new Point(948.5, 359));
    rowOne.push(new Point(896.5, 417.5));

    rowTwo.push(new Point(868.5, 209));
    rowTwo.push(new Point(905, 240.5));
    rowTwo.push(new Point(916.5, 284.5));
    rowTwo.push(new Point(907, 327.5));
    rowTwo.push(new Point(879, 366));

    rowThree.push(new Point(854, 257));
    rowThree.push(new Point(866, 270));
    rowThree.push(new Point(869.5, 287));
    rowThree.push(new Point(867.5, 305));
    rowThree.push(new Point(860, 319.5));


    xPos -= 35;
    yPos = 429;

    for (var n = 1; n <= 35; n++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos - 46));
        rowThree.push(new Point(xPos, yPos - 46 - 47));
        xPos -= 16.8;
        if (n % 5 == 0) {
            xPos -= 9.9;
        }

    }

    rowOne.push(new Point(169.5, 441.5));
    rowOne.push(new Point(159.5, 457.5));
    rowOne.push(new Point(155.5, 474));
    rowOne.push(new Point(158.5, 492));
    rowOne.push(new Point(170.5, 506.5));

    rowTwo.push(new Point(156.5, 384));
    rowTwo.push(new Point(121, 419));
    rowTwo.push(new Point(104, 471));
    rowTwo.push(new Point(117.5, 521.5));
    rowTwo.push(new Point(156.5, 555));

    rowThree.push(new Point(142.5, 338));
    rowThree.push(new Point(77.5, 393.5));
    rowThree.push(new Point(58.5, 469.5));
    rowThree.push(new Point(79, 548));
    rowThree.push(new Point(139, 605));

    xPos += 24;
    yPos = 517.5;

    for (var m = 1; m <= 40; m++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos + 46));
        rowThree.push(new Point(xPos, yPos + 46 + 49));
        xPos += 16.5;
        if (m % 5 == 0) {
            xPos += 10.8;
        }

    }

    rowOne.push(new Point(970.5, 561.5));

    rowTwo.push(new Point(970.5, 561.5));

    rowThree.push(new Point(970.5, 561.5));
}

var index = 0;
var closest = 500;
var pegPoint;
/**
* Create peg and add event listeners.
*
* @param peg 
* @param row 
*
*/
function getPegIndex(peg, row) {
    index = 0;
    closest = 500;
    pegPoint = new Point(peg.getX(), peg.getY());
    for (var p = 0; p < row.length; p++) {
        var dist = getDistanceGivenPoints(pegPoint, row[p]);

        if (dist < closest) {
            closest = dist;
            index = p;
            if (dist < 5) {
                continue;
            }
        }
    }
    return index;
}

/**
 * The guide shows the number of pegs as a user drags. This function sets the color, position and text of the guide.
 *
 * @param peg 
 * @param i 
 * @param tempIndex 
 * @param color 
 *
 */
function updateGuide(peg, i, tempIndex, color) {
    if (tempIndex > pegIndexes[i]) {
        if (pegIndexes[i] <= 0) {
            writeMessage(tempIndex - pegIndexes[i] - 1, peg.getX(), peg.getY(), color);
        } else {
            writeMessage(tempIndex - pegIndexes[i], peg.getX(), peg.getY(), color);
        }
    } else {
        writeMessage("", 0, 0, color);
    }
}



var points;
var currentPeg;
/**
 * Create peg and add event listeners.
 *
 * @param color 
 * @param name 
 * @param image 
 *
 */
function drawPeg(color, name, imageIn) {
    var layer = new Konva.Group({
        draggable: true,
    });
    var image = new Konva.Image({
        x: -10,
        y: -10,
        // fill: 'red',
        image: imageIn,
        pixelRatio: 2,
        width: 20,
        height: 20
    });
    
    image.crop({
        x: 9,
        y: 9,
        width: 20,
        height: 20
    });
    image.cache();
    var circle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 20,
        // name: name,
        // stroke: color,
        // strokeWidth: 1,
    });
    layer.add(circle);
    layer.add(image);
    layer.name(name);

    // pos is a reference to the event. pos.x and pos.y will return coordinates. pos.target returns the peg targeted in the event.
    
    layer.on('dragmove', _.throttle(onPegMove, 20));
    
    layer.on('dragstart', function (pos) {
        pos.target.children[1].setX(-10);
        pos.target.children[1].setY(-10);
        drawing = true;
        if (pos.target.attrs.name == 'pegRedOne' || pos.target.attrs.name == 'pegRedTwo') {
            redLine.show();
        } else if (pos.target.attrs.name == 'pegBlueOne' || pos.target.attrs.name == 'pegBlueTwo') {
            blueLine.show();
        } else if (pos.target.attrs.name == 'pegYellowOne' || pos.target.attrs.name == 'pegYellowTwo') {
            yellowLine.show();
        }
        startX = pos.x;
        startY = pos.y;
        lineLayer.show();
    });
    
    layer.on('dragend', function (pos) {
        undoData.push(pegIndexes.slice(0));
        document.getElementById("undoButton").disabled = false;
        if (pos.target.attrs.name == 'pegRedOne') {
            redLine.hide();
            pegIndexes[4] = placePeg(pos.target, rowThree);
            normalizePegs(4, 5, pegRedOne, pegRedTwo);
            pegLayer.draw();
        } else if (pos.target.attrs.name == 'pegRedTwo') {
            redLine.hide();
            pegIndexes[5] = placePeg(pos.target, rowThree);
            normalizePegs(4, 5, pegRedOne, pegRedTwo);
            pegLayer.draw();
        } else if (pos.target.attrs.name == 'pegBlueOne') {
            blueLine.hide();
            pegIndexes[0] = placePeg(pos.target, rowOne);
            normalizePegs(0, 1, pegBlueOne, pegBlueTwo);
            pegLayer.draw();
        } else if (pos.target.attrs.name == 'pegBlueTwo') {
            blueLine.hide();
            pegIndexes[1] = placePeg(pos.target, rowOne);
            normalizePegs(0, 1, pegBlueOne, pegBlueTwo);
            pegLayer.draw();
        } else if (pos.target.attrs.name == 'pegYellowOne') {
            yellowLine.hide();
            pegIndexes[2] = placePeg(pos.target, rowTwo);
            normalizePegs(2, 3, pegYellowOne, pegYellowTwo);
            pegLayer.draw();
        } else if (pos.target.attrs.name == 'pegYellowTwo') {
            yellowLine.hide();
            pegIndexes[3] = placePeg(pos.target, rowTwo);
            normalizePegs(2, 3, pegYellowOne, pegYellowTwo);
            pegLayer.draw();
        }
        updateScores();
        writeMessage("", 0, 0, color);
        lineLayer.draw();
        lineLayer.hide();
    });
    return layer;
}

/**
* Peg on move handler. This function is throttled using underscore JS to improve performance.
*  
* @param pos 
* 
*/
function onPegMove(pos) {
    points = new Array();
    if (pos.target.attrs.name == 'pegRedOne' || pos.target.attrs.name == 'pegRedTwo') {
        if (pos.target.attrs.name == 'pegRedOne') {
            tempIndex = getPegIndex(pegRedOne, rowThree);
            points.push(rowThree[pegIndexes[5]].x);
            points.push(rowThree[pegIndexes[5]].y);
            updateGuide(pegRedOne, 5, tempIndex, pegThreeColor);
            for (g = pegIndexes[5]; g <= tempIndex; g++) {
                points.push(rowThree[g].x);
                points.push(rowThree[g].y);
            }
        } else {
            tempIndex = getPegIndex(pegRedTwo, rowThree);
            points.push(rowThree[pegIndexes[4]].x);
            points.push(rowThree[pegIndexes[4]].y);
            updateGuide(pegRedTwo, 4, tempIndex, pegThreeColor);
            for (g = pegIndexes[4]; g <= tempIndex; g++) {
                points.push(rowThree[g].x);
                points.push(rowThree[g].y);
            }

        }
        redLine.setPoints(points);
    } else if (pos.target.attrs.name == 'pegBlueOne' || pos.target.attrs.name == 'pegBlueTwo') {

        if (pos.target.attrs.name == 'pegBlueOne') {
            tempIndex = getPegIndex(pegBlueOne, rowOne);
            points.push(rowOne[pegIndexes[1]].x);
            points.push(rowOne[pegIndexes[1]].y);
            updateGuide(pegBlueOne, 1, tempIndex, pegOneColor);
            for (g = pegIndexes[1]; g <= tempIndex; g++) {
                points.push(rowOne[g].x);
                points.push(rowOne[g].y);
            }

        } else {
            tempIndex = getPegIndex(pegBlueTwo, rowOne);
            points.push(rowOne[pegIndexes[0]].x);
            points.push(rowOne[pegIndexes[0]].y);
            updateGuide(pegBlueTwo, 0, tempIndex, pegOneColor);
            for (g = pegIndexes[0]; g <= tempIndex; g++) {
                points.push(rowOne[g].x);
                points.push(rowOne[g].y);
            }

        }
        blueLine.setPoints(points);
    } else if (pos.target.attrs.name == 'pegYellowOne' || pos.target.attrs.name == 'pegYellowTwo') {

        if (pos.target.attrs.name == 'pegYellowOne') {
            tempIndex = getPegIndex(pegYellowOne, rowTwo);
            points.push(rowTwo[pegIndexes[3]].x);
            points.push(rowTwo[pegIndexes[3]].y);
            updateGuide(pegYellowOne, 3, tempIndex, pegTwoColor);
            for (g = pegIndexes[3]; g <= tempIndex; g++) {
                points.push(rowTwo[g].x);
                points.push(rowTwo[g].y);
            }

        } else {
            tempIndex = getPegIndex(pegYellowTwo, rowOne);
            points.push(rowTwo[pegIndexes[2]].x);
            points.push(rowTwo[pegIndexes[2]].y);
            updateGuide(pegYellowTwo, 2, tempIndex, pegTwoColor);
            for (g = pegIndexes[2]; g <= tempIndex; g++) {
                points.push(rowTwo[g].x);
                points.push(rowTwo[g].y);
            }

        }
        yellowLine.setPoints(points);
    }
    
    lineLayer.batchDraw();
}

/**
* Adjusts hit area for pegs when they are right next to each other.
*  
* @param peg1
* @param peg2
* 
*/ 
function normalizePegs(p1, p2, peg1, peg2)
{
    if (p1 == 0) {
        peg1.setX(rowOne[pegIndexes[p1]].x);
        peg1.setY(rowOne[pegIndexes[p1]].y);
        peg2.setX(rowOne[pegIndexes[p2]].x);
        peg2.setY(rowOne[pegIndexes[p2]].y);
    }

    if (p1 == 2) {
        peg1.setX(rowTwo[pegIndexes[p1]].x);
        peg1.setY(rowTwo[pegIndexes[p1]].y);
        peg2.setX(rowTwo[pegIndexes[p2]].x);
        peg2.setY(rowTwo[pegIndexes[p2]].y);
    }

    if (p1 == 4) {
        peg1.setX(rowThree[pegIndexes[p1]].x);
        peg1.setY(rowThree[pegIndexes[p1]].y);
        peg2.setX(rowThree[pegIndexes[p2]].x);
        peg2.setY(rowThree[pegIndexes[p2]].y);
    }

    peg1.children[1].setX(-10);
    peg1.children[1].setY(-10);
    peg2.children[1].setX(-10);
    peg2.children[1].setY(-10);

    if(pegIndexes[p1] - pegIndexes[p2] == -1){
        if (pegIndexes[p1] <= 36 || pegIndexes[p1] >= 82) {
            console.log("1");
            peg1.setX(peg1.getX() - 10);
            peg2.setX(peg2.getX() + 10);
            peg1.children[1].setX(0);
            peg2.children[1].setX(-20);
        } else if (pegIndexes[p1] > 36 && pegIndexes[p1] < 42) {
            console.log("2");
            peg1.setY(peg1.getY() - 10);
            peg2.setY(peg2.getY() + 10);
            peg1.children[1].setY(0);
            peg2.children[1].setY(-20);
        } else if (pegIndexes[p1] >= 42 && pegIndexes[p1] <= 77) {
            console.log("3");
            peg1.setX(peg1.getX() + 10);
            peg2.setX(peg2.getX() - 10);
            peg1.children[1].setX(-20);
            peg2.children[1].setX(0);
        } else if (pegIndexes[p1] > 77 && pegIndexes[p1] < 82) {
            console.log("4");
            peg1.setY(peg1.getY() - 10);
            peg2.setY(peg2.getY() + 10);
            peg1.children[1].setY(0);
            peg2.children[1].setY(-20);
        }
        
    }else if(pegIndexes[p1] - pegIndexes[p2] == 1){
        if (pegIndexes[p1] <= 36 || pegIndexes[p1] >= 82) {
            console.log("11");
            peg1.setX(peg1.getX() + 10);
            peg2.setX(peg2.getX() - 10);
            peg1.children[1].setX(-20);
            peg2.children[1].setX(0);
        } else if (pegIndexes[p1] > 36 && pegIndexes[p1] < 42) {
            console.log("22");
            peg1.setY(peg1.getY() + 10);
            peg2.setY(peg2.getY() - 10);
            peg1.children[1].setY(-20);
            peg2.children[1].setY(0);
        } else if (pegIndexes[p1] >= 42 && pegIndexes[p1] <= 77) {
            console.log("33");
            peg1.setX(peg1.getX() - 10);
            peg2.setX(peg2.getX() + 10);
            peg1.children[1].setX(0);
            peg2.children[1].setX(-20);
        } else if (pegIndexes[p1] > 77 && pegIndexes[p1] < 82) {
            console.log("44");
            peg1.setY(peg1.getY() + 10);
            peg2.setY(peg2.getY() - 10);
            peg1.children[1].setY(-20);
            peg2.children[1].setY(0);
        }
        
    }
}

/**
* Updates pegs to match the current indexes. Used when restoring a game state and during undo.
* 
*/
function updatePegs() {
    if (hasPegs) {
        updateScores();

        pegBlueOne.setX(rowOne[pegIndexes[0]].x);
        pegBlueOne.setY(rowOne[pegIndexes[0]].y);
        pegBlueTwo.setX(rowOne[pegIndexes[1]].x);
        pegBlueTwo.setY(rowOne[pegIndexes[1]].y);

        pegYellowOne.setX(rowTwo[pegIndexes[2]].x);
        pegYellowOne.setY(rowTwo[pegIndexes[2]].y);
        pegYellowTwo.setX(rowTwo[pegIndexes[3]].x);
        pegYellowTwo.setY(rowTwo[pegIndexes[3]].y);

        pegRedOne.setX(rowThree[pegIndexes[4]].x);
        pegRedOne.setY(rowThree[pegIndexes[4]].y);
        pegRedTwo.setX(rowThree[pegIndexes[5]].x);
        pegRedTwo.setY(rowThree[pegIndexes[5]].y);

        normalizePegs(4, 5, pegRedOne, pegRedTwo);
        normalizePegs(0, 1, pegBlueOne, pegBlueTwo);
        normalizePegs(2, 3, pegYellowOne, pegYellowTwo);

        pegLayer.draw();
        pegLayer.draw();
        pegLayer.draw();
    }
}

/**
* Creates pegs using loaded image assets. Draws the Kinetic Circle objects to the Kinetic Layers.
*  
* @param images array
* 
*/
function drawPegs(images) {
    pegBlueOne = drawPeg(pegOneColor, 'pegBlueOne', images.bluePegImage);
    pegLayer.add(pegBlueOne);

    pegBlueTwo = drawPeg(pegOneColor, 'pegBlueTwo', images.bluePegImage);
    pegLayer.add(pegBlueTwo);

    pegYellowOne = drawPeg(pegTwoColor, 'pegYellowOne', images.yellowPegImage);
    pegLayer.add(pegYellowOne);

    pegYellowTwo = drawPeg(pegTwoColor, 'pegYellowTwo', images.yellowPegImage);
    pegLayer.add(pegYellowTwo);

    pegRedOne = drawPeg(pegThreeColor, 'pegRedOne', images.redPegImage);
    pegLayer.add(pegRedOne);

    pegRedTwo = drawPeg(pegThreeColor, 'pegRedTwo', images.redPegImage);
    pegLayer.add(pegRedTwo);
    hasPegs = true;
    updatePegs();
    
}

