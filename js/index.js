var isLoaded = false;
isReady = true;
var undoData = new Array();
var backgroundColor = '#1a1a1a';


// Current scores for each color
var redScore = 0;
var greenScore = 0;
var blueScore = 0;

// Current position for each peg
var pegIndexes = [0, 1, 0, 1, 0, 1];

buildArrays();
loadComplete();
function loadComplete() {
    isLoaded = true;
    if (isReady) {
        init();
    }
}

/**
 * Minimum size of the stage for a Windows 8 tablet app is 1024x768.
 *
 */
function init() {
    // Calculate the scale based on the window size.
    var scale = window.innerHeight / 768;

    // Update the container div
    document.getElementById('desktop-view').style.width = (1024 * scale) + "px";
    document.getElementById('desktop-view').style.height = window.innerHeight + "px";

    if (stage) {
        // If we have a stage, resize.
        stage.setWidth(1024 * scale);
        stage.setHeight(window.innerHeight);
        stage.setScale(scale);
        stage.draw();
    } else {
        var sources = {
            redPegImage: 'images/pegRed.png',
            yellowPegImage: 'images/pegGreen.png',
            bluePegImage: 'images/pegBlue.png'
        };

        loadImages(sources, function (images) {
            drawPegs(images);
        });

        // If we don't have a stage, build one and initialize the app
        stage = new Konva.Stage({
            container: 'desktop-view',
            width: 1024 * scale,
            height: window.innerHeight,
            scale: {x:scale, y: scale}
        });
        var backgroundLayer = new Konva.FastLayer();
        
        stage.add(backgroundLayer);

        var imageObj = new Image();
        imageObj.onload = function () {
            var board = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: 1024,
                height: 768
            });
            board.cache();
            // add the shape to the layer
            backgroundLayer.add(board);
            backgroundLayer.draw();
        };
        // background image
        imageObj.src = 'images/cribbage.png';

        lineLayer.add(redLine);
        lineLayer.add(blueLine);
        lineLayer.add(yellowLine);
        lineLayer.add(simpleText);
        stage.add(lineLayer);
        stage.add(pegLayer);
        
        //stage.add(messageLayer);
    }
    isReady = true;
    isLoaded = true;

}

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }

}

function writeMessage(message, xPos, yPos, color) {
    simpleText.setText(message);
    simpleText.setX(xPos - 20);
    simpleText.setY(yPos - 100);
    simpleText.setFill(color);
}

function placePeg(peg, row) {
    var blueIndex = 0;
    var closest = 500;
    var pegPoint = new Point(peg.getX(), peg.getY());
    for (var p = 0; p < row.length; p++) {
        var dist = getDistanceGivenPoints(pegPoint, row[p]);

        if (dist < closest) {
            closest = dist;
            blueIndex = p;
        }
    }
    switch (peg) {
        case pegBlueOne:
            if (blueIndex == pegIndexes[1]) {
                blueIndex++;
            }
            break;
        case pegBlueTwo:
            if (blueIndex == pegIndexes[0]) {
                blueIndex++;
            }
            break;
        case pegYellowOne:
            if (blueIndex == pegIndexes[3]) {
                blueIndex++;
            }
            break;
        case pegYellowTwo:
            if (blueIndex == pegIndexes[2]) {
                blueIndex++;
            }
            break;
        case pegRedOne:
            if (blueIndex == pegIndexes[5]) {
                blueIndex++;
            }
            break;
        case pegRedTwo:
            if (blueIndex == pegIndexes[4]) {
                blueIndex++;
            }
            break;
    }
    if (blueIndex > row.length - 1) {
        blueIndex = 0;
    }
    peg.setX(row[blueIndex].x);
    peg.setY(row[blueIndex].y);

    return blueIndex;
}

function resetGame() {
    undoData = new Array();
    pegIndexes = [0, 1, 0, 1, 0, 1];
    document.getElementById("undoButton").disabled = true;
    updatePegs();
}

function addBlue() {
    if (blueScore < 121) {
        undoData.push(pegIndexes.slice(0));
        document.getElementById("undoButton").disabled = false;
        if (pegIndexes[0] > pegIndexes[1]) {
            pegIndexes[0]++;
        } else {
            pegIndexes[1]++;
        }
        updateScores();
    }
}

function addGreen() {
    if (greenScore < 121) {
        undoData.push(pegIndexes.slice(0));
        document.getElementById("undoButton").disabled = false;
        if (pegIndexes[2] > pegIndexes[3]) {
            pegIndexes[2]++;
        } else {
            pegIndexes[3]++;
        }
        updateScores();
    }
}

function addRed() {
    if (redScore < 121) {
        undoData.push(pegIndexes.slice(0));
        document.getElementById("undoButton").disabled = false;
        if (pegIndexes[4] > pegIndexes[5]) {
            pegIndexes[4]++;
        } else {
            pegIndexes[5]++;
        }
        updateScores();
    }
}

function updateScores() {
    if (pegIndexes[0] > pegIndexes[1]) {
        blueScore = pegIndexes[0] - 1;
    } else {
        blueScore = pegIndexes[1] - 1;
    }
    document.getElementById("blueScoreDiv").innerHTML = blueScore;
    if (pegIndexes[2] > pegIndexes[3]) {
        greenScore = pegIndexes[2] - 1;
    } else {
        greenScore = pegIndexes[3] - 1;
    }
    document.getElementById("greenScoreDiv").innerHTML = greenScore;
    if (pegIndexes[4] > pegIndexes[5]) {
        redScore = pegIndexes[4] - 1;
    } else {
        redScore = pegIndexes[5] - 1;
    }
    document.getElementById("redScoreDiv").innerHTML = redScore;

    if (blueScore > redScore && blueScore > greenScore) {
        setColors(pegOneColor);
    } else if (greenScore > redScore) {
        setColors(pegTwoColor);
    } else {
        setColors(pegThreeColor);
    }
}

function setColors(color) {
    document.body.style.backgroundColor = color;
    document.getElementById("mobile-view").style.backgroundColor = color;
    document.getElementById("subtractRed").style.color = color;
    document.getElementById("subtractGreen").style.color = color;
    document.getElementById("subtractBlue").style.color = color;
    document.getElementById("addRed").style.color = color;
    document.getElementById("addGreen").style.color = color;
    document.getElementById("addBlue").style.color = color;
}

// Undo the last move
function undo() {
    if (undoData.length > 0) {
        pegIndexes = undoData.pop();
        updatePegs();
    }
    if (undoData.length == 0) {
        document.getElementById("undoButton").disabled = true;
    }

}

/*
    Window Resize
    Handle window resize. Switch between regular and snap view sizes.
*/
window.addEventListener("resize", onResize, false);

function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (isReady) {
        if (w >= 850 && w > h && h >= 580) {
            init();
            updatePegs();
        } else {
            updateScores();
        }
        //messageLayer.hide();
    }
}
		// END Resize