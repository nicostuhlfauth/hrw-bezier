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

let depth = 0;
const width = 600;
const height = 600;
const max_bezier_depth = 5;
const num_points = 4;
const CP = Array(num_points);
const t = .5;

const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const line_color = '#ff1010';
const point_color = '#40f040';

function draw () {
    for (var i=0; i<num_points; i++) {
        CP[i] = getRandomPoint(width, height);
        //console.log(CP[i])
    }
    if (ctx) {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = line_width;
        ctx.strokeStyle = line_color;

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
    ctx.moveTo(P0[0].x, P0[0].y);
    ctx.lineTo(P1[0].x, P1[0].y);
    ctx.stroke();
}

function pointMultiply(myPoint, t) {
    return new P(myPoint.x*t, myPoint.y*t);
}

function pointAddition(myPoint1, myPoint2) {
    return new P(myPoint1.x+myPoint2.x, myPoint1.y+myPoint2.y);
}

function bezier(tempPoints, t, tiefe) {
    if (tiefe === 0) {
        line(tempPoints[0], tempPoints[tempPoints.length-1]);
        console.log(tempPoints[tempPoints.length-1]);
    }
    else {
        let myReturnArray1 = [];
        let myReturnArray2 = [];

        let myPoints = [];

        myPoints.push(tempPoints);

        for (let h = 0; h < tempPoints.length-1; h++ ) {
            myPoints.push([])
        }

        for (let j = 1; j < num_points; j++) {
            for (let k = 0; k < num_points-j; k++) {
                myPoints[j].push(pointAddition(pointMultiply(myPoints[j-1][k], (1-t)), pointMultiply(myPoints[j-1][k+1], t)));
            }
        }
        for (let i = 0; i< myPoints.length; i++) {
            myReturnArray1.push(myPoints[i][0]);
        }
        for (let i = myPoints.length; i> 0; i--) {
            myReturnArray2.push(myPoints[i-1][myPoints[i-1].length-1]);
        }

        bezier(myReturnArray1, t, tiefe-1);
        bezier(myReturnArray2, t, tiefe-1);
    }
}

draw();
bezier(CP, t, max_bezier_depth);