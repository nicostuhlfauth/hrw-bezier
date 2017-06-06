const max_bezier_depth = 10;
const num_points = 3;
const CP = new Array(num_points);
const t = .5;

const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const point_color = '#40f040';

function P(x, y) {
    this.x = x;
    this.y = y;
}

function getRandomPoint(width, height) {
    return new P(Math.floor(Math.random() * width),
        Math.floor(Math.random() * height));
}

function draw(ctx, width, height) {
    for (let i = 0; i < num_points; i++) {
        CP[i] = getRandomPoint(width, height);
    }
    if (ctx) {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < num_points; i++) {
            point(CP[i]);
        }
    }
}

function point(P) {
    ctx.fillStyle = point_color;
    ctx.fillRect(P.x - point_size / 2, P.y - point_size / 2, point_size, point_size);
}


function pointMultiply(myPoint, t) {
    return new P(myPoint.x * t, myPoint.y * t);
}

function pointAddition(myPoint1, myPoint2) {
    return new P(myPoint1.x + myPoint2.x, myPoint1.y + myPoint2.y);
}

function line(ctx, P0, P1) {
    const line_color = '#ff1010';
    ctx.strokeStyle = line_color;
    ctx.lineWidth = line_width;

    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

function tangent(ctx, P0, P1, tiefe) {
    const line_color = '#00ffff';
    ctx.strokeStyle = line_color;
    ctx.lineWidth = (line_width-1)/tiefe*2;


    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

function bezier(ctx, tempPoints, t, tiefe) {
    if (tiefe === 0) {
        line(ctx, tempPoints[0], tempPoints[tempPoints.length - 1]);
    }

    else {
        let myReturnArray1 = [];
        let myReturnArray2 = [];

        let myPoints = [];

        myPoints.push(tempPoints);

        for (let h = 0; h < tempPoints.length - 1; h++) {
            myPoints.push([])
        }

        for (let j = 1; j < num_points; j++) {
            for (let k = 0; k < num_points - j; k++) {
                myPoints[j].push(pointAddition(pointMultiply(myPoints[j - 1][k], (1 - t)), pointMultiply(myPoints[j - 1][k + 1], t)));
                if (tiefe >= max_bezier_depth) {
                    tangent(ctx, myPoints[j - 1][k], myPoints[j - 1][k + 1], tiefe);
                }
            }
        }

        for (let i = 0; i < myPoints.length; i++) {
            myReturnArray1.push(myPoints[i][0]);
        }
        for (let i = myPoints.length; i > 0; i--) {
            myReturnArray2.push(myPoints[i - 1][myPoints[i - 1].length - 1]);
        }

        bezier(ctx, myReturnArray1, t, tiefe - 1);
        bezier(ctx, myReturnArray2, t, tiefe - 1);
    }
}

function domloaded(canvas, ctx) {
    const width = canvas.width;
    const height = canvas.height;

    draw(ctx, width, height);
    bezier(ctx, CP, t, max_bezier_depth);
}