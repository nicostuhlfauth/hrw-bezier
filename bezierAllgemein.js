function P(x, y) {
    this.x = x;
    this.y = y;
}

var inputArray = [];

function bezier(points, tiefe) {
    const outputArray = [];
    if (tiefe !== 0) {
        for (let i = 0; i < points.length - 1; i++) {
            outputArray.push(new P(0.5 * (points[i].x + points[i + 1].x), 0.5 * (points[i].y + points[i + 1].y)));
        }
        bezier(outputArray, tiefe-1);
    }
    return outputArray;
}

function bezierAllgemein(points, depth) {
    const myPoints = [];
    let counter = 1;
    if (depth !== 0) {
        for (let i = 0; i < points.length-1; i++) {
            const layerPoints = [];
            for (let j = counter; j < points.length; j++) {
                let firstEntry = 0;
                if (counter === 1) {
                    layerPoints.push(new P(0.5 * (points[j-1].x + points[j].x), 0.5 * (points[j-1].y + points[j].y)));
                }
                else {
                    //console.log(i, j);
                    layerPoints.push(new P(0.5 * (myPoints[counter-2][firstEntry].x + myPoints[counter-2][firstEntry+1].x),
                        0.5 * (myPoints[counter-2][firstEntry].y + myPoints[counter-2][firstEntry+1].y)));
                    firstEntry++;
                }
            }
            counter++;
            myPoints.push(layerPoints);
        }
        console.log(myPoints);
    }
}

bezierAllgemein(inputArray, 5);