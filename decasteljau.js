let max_bezier_depth = 10;
let num_points = 3;
let CP = new Array(num_points);
let t = .5;

const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const point_color = '#40f040';

function P(x, y) {
    this.x = x;
    this.y = y;
}

const draw = {
    point: (p) => {
        ctx.fillStyle = point_color;
        ctx.fillRect(p.x - point_size / 2, p.y - point_size / 2, point_size, point_size);
    },
    bezier: (ctx, p0, p1) => {
        const line_color = '#ff1010';
        ctx.strokeStyle = line_color;
        ctx.lineWidth = line_width;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    },
    auxiliary: (ctx, p0, p1, depth) => {
        const line_color = '#00ffff';
        ctx.strokeStyle = line_color;
        ctx.lineWidth = (line_width-1)/depth*2;


        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    },
    backgroundColor: (ctx, width, height) => {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < num_points; i++) {
            draw.point(CP[i]);
        }
    }
};

const helper = {
    pointMultiply: (p, t) => {
        return new P(p.x*t, p.y*t);
    },
    pointAddition: (p1, p2) => {
        return new P(p1.x+p2.x, p1.y+p2.y);
    },
    getRandomPoint: (width, height) => {
        return new P(Math.floor(Math.random() * width),
            Math.floor(Math.random() * (height-50)));
    },
    addPoint: (x, y) => {
        CP.push(new P(x, y));
        num_points++;
    },
    randomPoints: (width, height) => {
        for (let i = 0; i < num_points; i++) {
            CP[i] = helper.getRandomPoint(width, height);
        }
    }
};

function generateRandomView(ctx, width, height) {
    helper.randomPoints(width, height);
    if (ctx) {
        draw.backgroundColor(ctx, width, height);
    }
}

function bezier(ctx, tempPoints, t, depth) {
    if (depth === 0) {
        draw.bezier(ctx, tempPoints[0], tempPoints[tempPoints.length - 1]);
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
                myPoints[j].push(helper.pointAddition(helper.pointMultiply(myPoints[j - 1][k], (1 - t)), helper.pointMultiply(myPoints[j - 1][k + 1], t)));
                if (depth >= max_bezier_depth) {
                    draw.auxiliary(ctx, myPoints[j - 1][k], myPoints[j - 1][k + 1], depth);
                }
            }
        }

        for (let i = 0; i < myPoints.length; i++) {
            myReturnArray1.push(myPoints[i][0]);
        }
        for (let i = myPoints.length; i > 0; i--) {
            myReturnArray2.push(myPoints[i - 1][myPoints[i - 1].length - 1]);
        }

        bezier(ctx, myReturnArray1, t, depth - 1);
        bezier(ctx, myReturnArray2, t, depth - 1);
    }
}

function domloaded(ctx) {
    bezier(ctx, CP, t, max_bezier_depth);
}