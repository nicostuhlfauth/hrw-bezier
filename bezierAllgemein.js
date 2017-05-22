function P(x, y) {
    this.x = x;
    this.y = y;
}

var inputArray = new Array();
inputArray.push(new P(5, 3));
inputArray.push(new P(7, 9));
inputArray.push(new P(1, 8));

var outputArray = new Array();


function bezier(inputArray, tiefe) {
    if(tiefe != 0) {
        for (var i = 0; i < inputArray.length - 1; i++) {
            outputArray.push(new P(0.5 * (inputArray[i].x + inputArray[i + 1].x), 0.5 * (inputArray[i].y + inputArray[i + 1].y)));

            console.log(outputArray);
        }
        bezier(outputArray, tiefe-1);
    }
}


bezier(inputArray, 5);

