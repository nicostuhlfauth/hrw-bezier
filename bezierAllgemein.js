function P(x, y) {
    this.x = x;
    this.y = y;
}

var inputArray = new Array();
inputArray.push(new P(5, 3));
inputArray.push(new P(7, 9));
inputArray.push(new P(1, 8));
inputArray.push(new P(3, 7));
inputArray.push(new P(7, 7));

function bezier(points, tiefe) {
    var outputArray = new Array();
    if (tiefe !== 0) {
        for (var i = 0; i < points.length - 1; i++) {
            outputArray.push(new P(0.5 * (points[i].x + points[i + 1].x), 0.5 * (points[i].y + points[i + 1].y)));
        }
        bezier(outputArray, tiefe-1);
    }
    return outputArray;
}

function bezier2(points, depth) {
    var myPoints = new Array();
    var counter = 1;
    if (depth !== 0) {
        for (var i = 0; i < points.length-1; i++) {
            var layerPoints = new Array();
            for (j = counter; j < points.length; j++) {
                if (counter == 1) {
                    layerPoints.push(new P(0.5 * (points[j-1].x + points[j].x), 0.5 * (points[j-1].y + points[j].y)));
                }
                else {
                    //layerPoints.push();
                }
            }
            counter++;
            myPoints.push(layerPoints);
        }
        console.log(myPoints[0]);
    }
}

bezier2(inputArray, 5);