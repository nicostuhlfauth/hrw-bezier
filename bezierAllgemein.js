function P(x, y) {
    this.x = x;
    this.y = y;
}

var inputArray = new Array();
inputArray.push(new P(5, 3));
inputArray.push(new P(7, 9));
inputArray.push(new P(1, 8));
inputArray.push(new P(3, 7));

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

console.log(bezier(inputArray, 3));