var canvas;
var ctx;

function P(x, y) {
    this.x = x;
    this.y = y;
}
function getRandomPoint(width, height) {
    return new P(Math.floor(Math.random() * width),
        Math.floor(Math.random() * height));
}

const inputArray = [];
let myReturnArray;
const width = 600;
const height = 600;
const max_bezier_depth = 5;
const num_points = 4;
const CP = Array(num_points);
const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const line_color = '#ff1010';
const point_color = '#40f040';

function draw () {
    for (var i=0; i<num_points; i++) {
        CP[i] = getRandomPoint(width, height);
    }
    if (ctx) {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = line_width;
        ctx.strokeStyle = line_color;

        myReturnArray = bezierAllgemein(CP, max_bezier_depth);

        //console.log(myReturnArray[0], myReturnArray[myReturnArray.length-1]);

        line(myReturnArray[0], myReturnArray[myReturnArray.length-1]);

        for (var i=0; i<num_points; i++) {
            point(CP[i]);
        }
    }
}

function point (P)
{
    ctx.fillStyle = point_color;
    ctx.fillRect(P.x-point_size/2,P.y-point_size/2,point_size,point_size);
}

function line (P0, P1) {
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

function bezier4 (P0, P1, P2, P3, tiefe) {
    if (tiefe == 0) line(P0, P3);
    else {
        var P01   = new P(0.5*(P0.x+P1.x), 0.5*(P0.y+P1.y));
        var P12   = new P(0.5*(P1.x+P2.x), 0.5*(P1.y+P2.y));
        var P23   = new P(0.5*(P2.x+P3.x), 0.5*(P2.y+P3.y));

        var P012  = new P(0.5*(P01.x+P12.x), 0.5*(P01.y+P12.y));
        var P123  = new P(0.5*(P12.x+P23.x), 0.5*(P12.y+P23.y));

        var P0123 = new P(0.5*(P012.x+P123.x), 0.5*(P012.y+P123.y));

        bezier4(P0, P01, P012, P0123, tiefe-1);
        bezier4(P0123, P123, P23, P3, tiefe-1);
    }
}

function bezier (points) {
    if (points.length == 4) {
        bezier4 (points[0], points[1], points[2], points[3], max_bezier_depth);
    }
}


function bezierAllgemein(points, depth) {
    const myPoints = [];
    const myReturnArray1 = [];
    const myReturnArray2 = [];

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
        myReturnArray1.push(points[0]);
        for (let i = 0; i < myPoints.length; i++) {
            myReturnArray1.push(myPoints[i][0])
        }
        for (let j = myPoints.length-1; j >= 0; j--){
            myReturnArray2.push(myPoints[j][myPoints[j].length-1]);
        }
        myReturnArray2.push(points[points.length-1]);

        console.log(myReturnArray1, depth-1);
        console.log(myReturnArray2,depth-1);
        return bezierAllgemein(myReturnArray1, depth-1) && bezierAllgemein(myReturnArray2,depth-1);

    } else {
        //console.log(points);
        return points;
    }
}