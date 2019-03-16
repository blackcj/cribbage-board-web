function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

/**
 * Complex trig used to determine the midpoint of a parallel line. Used to snap 
 * the walls during a move. You really don't want to edit this function...
 *  
 * http://www.intmath.com/Plane-analytic-geometry/Perpendicular-distance-point-line.php
 * 
 * @param startPoint
 * @param endPoint
 * @param nextPoint
 * @param angle
 * @return 
 * 
 */
function getRightAnglePoint(startPoint, endPoint, nextPoint, angle) {
    angle = Math.round(angle);
    var lineLength = getDistanceGivenPoints(startPoint, endPoint);
    lineLength = lineLength / 2;
    var midPoint = getMidPoint(startPoint, endPoint);
    var distance = getDistanceGivenLine(startPoint, endPoint, nextPoint);
    distance = Math.floor(distance / 10) * 10;
    /*
    * Angle between the line and the shortest distance to that line given a point.     
    */
    //var tempAngle:Number = Math.atan(distance / lineLength)/(Math.PI / 180);

    /*
    * Normalize the sign. Account for edge cases (90 / 270)    
    */
    if (angle > 90 && angle < 270) {
        distance = -distance;
    } else if (angle == 90/* angle >= 80 && angle <= 100 */) {
        distance = startPoint.x - nextPoint.x;
    } else if (angle == 270/* angle >= 260 && angle <= 280 */) {
        distance = startPoint.x + nextPoint.x;
    }
    //var d2:Number = lineLength * Math.tan((angle % 90 - tempAngle) / (180 / Math.PI));
    var corner = getPointGivenDist(distance, (angle + 90) % 360, midPoint);
    return corner;

}

/**
* Returns the closest distance from a point to a line. Start and end points are used
* to calculate the line in y = m * x + b format. The distance between a point and a
* line in slope intecept format is: |y1 - m * x1 - b| / sqrt(m^2 + 1). Where 
* (y1, x1) is a point not on the line. 
* 
* DOES NOT WORK FOR LINES AT 90 or 270 DEGREES. (You will need separate use cases 
* for these values).
* 
* http://math.ucsd.edu/~wgarner/math4c/derivations/distance/distptline.htm
* 
* @param startPoint
* @param endPoint
* @param nextPoint
* 
*/
function getDistanceGivenLine(startPoint, endPoint, nextPoint) {
    // Slope of the line
    var m = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);

    // Y-Intercept
    var b = startPoint.y - (m * startPoint.x);

    return (nextPoint.y - m * nextPoint.x - b) / Math.sqrt(Math.pow(m, 2) + 1);
}

function getXGivenY(pointY, slope, b) {
    return (pointY - b) / slope;
}

function getYGivenX(pointX, slope, b) {
    return (slope * pointX) + b;
}

function getRecipricolSlope(startPoint, endPoint) {
    var top = endPoint.y - startPoint.y;
    var bottom = endPoint.x - startPoint.x;

    return -(bottom / top);
}

function getB(slope, point) {
    return point.y - (slope * point.x);
}

function getMidPoint(startPoint, endPoint) {
    return new Point((endPoint.x + startPoint.x) / 2, (endPoint.y + startPoint.y) / 2);
}

/**
 * Distance formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)
 *  
 * @param startPoint
 * @param endPoint
 * @return 
 * 
 */
function getDistanceGivenPoints(startPoint, endPoint) {
    return Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
}

/**
* Returns a point that is the given distance / angle away from the start point.
*  
* @param dist
* @param angle
* @param startPt
* @return 
* 
*/
function getPointGivenDist(dist, angle, startPt) {
    var result = new Point();
    //var radAngle:Number = angle / (180/ Math.PI);
    if (angle <= 90) {
        result.x = startPt.x + Math.cos(angle / (180 / Math.PI)) * dist;
        result.y = startPt.y + Math.sin(angle / (180 / Math.PI)) * dist;
    } else if (angle <= 180) {
        result.x = startPt.x - Math.sin((angle - 90) / (180 / Math.PI)) * dist;
        result.y = startPt.y + Math.cos((angle - 90) / (180 / Math.PI)) * dist;
    } else if (angle <= 270) {
        result.x = startPt.x - Math.cos((angle - 180) / (180 / Math.PI)) * dist;
        result.y = startPt.y - Math.sin((angle - 180) / (180 / Math.PI)) * dist;
    } else {
        result.x = startPt.x + Math.sin((angle - 270) / (180 / Math.PI)) * dist;
        result.y = startPt.y - Math.cos((angle - 270) / (180 / Math.PI)) * dist;
    }
    return result;
}

/**
* Given a point it returns a 'snap point' which is snapped to the angle passed in.
* 
* This could be re-done using polar coordinates to make it more customizable. Right
* now the angels are hard coded.
*  
* @param startPoint
* @param endPoint
* @param angle
* @return 
* 
*/
function getNormalizedPoint(startPoint, endPoint, angle) {
    var result = new Point();
    var distance = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
    distance = Math.round(distance / 10) * 10
    var adj = distance * Math.sin(45 / (180 / Math.PI));
    if (angle == 0) {
        result = new Point(startPoint.x + distance, startPoint.y);
    } else if (angle == 90) {
        result = new Point(startPoint.x, startPoint.y + distance);
    } else if (angle == 180) {
        result = new Point(startPoint.x - distance, startPoint.y);
    } else if (angle == 270) {
        result = new Point(startPoint.x, startPoint.y - distance);
    } else if (angle == 45) {
        result = new Point(startPoint.x + adj, startPoint.y + adj);
    } else if (angle == 135) {
        result = new Point(startPoint.x - adj, startPoint.y + adj);
    } else if (angle == 225) {
        result = new Point(startPoint.x - adj, startPoint.y - adj);
    } else {
        result = new Point(startPoint.x + adj, startPoint.y - adj);
    }
    return result;
}

/**
* Hard coded 'snap angles' that are feed into getNormalizedPoint
* 
* This could be re-done using polar coordinates to make it more customizable. Right
* now the angels are hard coded.
* 
* @param value
* @return 
* 
*/
function normalizeAngle(value) {
    var result = 0;
    if (value >= 22.5 && value < 67.5) {
        result = 45;
    } else if (value >= 67.5 && value < 112.5) {
        result = 90;
    } else if (value >= 112.5 && value < 157.5) {
        result = 135;
    } else if (value >= 157.5 && value < 202.5) {
        result = 180;
    } else if (value >= 202.5 && value < 247.5) {
        result = 225;
    } else if (value >= 247.5 && value < 292.5) {
        result = 270;
    } else if (value >= 292.5 && value < 337.5) {
        result = 315;
    }
    return result;
}

/**
* Trigonomitry. Returns an angle give the adj and opp. Needs four use
* cases since the adj / opp will very depending on which quadrant you are in.
*  
* http://en.wikipedia.org/wiki/Triangle
* 
* @param adj
* @param opp
* @return 
* 
*/
function getAngle(adj, opp) {
    var result = 0;
    if (adj <= 0 && opp <= 0) {
        result = 180 + (Math.atan(Math.abs(adj) / Math.abs(opp)) / (Math.PI / 180))
    } else if (adj >= 0 && opp <= 0) {
        result = 90 + (Math.atan(Math.abs(opp) / Math.abs(adj)) / (Math.PI / 180))
    } else if (adj <= 0 && opp >= 0) {
        result = 270 + (Math.atan(Math.abs(opp) / Math.abs(adj)) / (Math.PI / 180))
    } else {
        result = (Math.atan(Math.abs(adj) / Math.abs(opp)) / (Math.PI / 180))
    }
    return result;
}
