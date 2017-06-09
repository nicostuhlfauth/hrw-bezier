const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const point_color = '#40f040';


class Curve {
    constructor(ctx) {
        this.ctx = ctx;
        this.numPoints = 3;
        this.data = [];
        this.maxDepth = 7;
        this.t = 0.5;
    }

    drawCurve(p0, p1) {

        for (let i = 0; i < this.numPoints; i++) {
            this.drawPoints(this.data[i]);
        }

        const line_color = '#ff1010';

        this.ctx.strokeStyle = line_color;
        this.ctx.lineWidth = line_width;

        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.stroke();
    }

    drawAuxiliary(p0, p1, depth) {
        const line_color = '#00ffff';
        this.ctx.strokeStyle = line_color;
        this.ctx.lineWidth = (line_width - 1) / depth * 2;

        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.stroke();
    }

    drawPoints (p) {
        this.ctx.fillStyle = point_color;
        this.ctx.fillRect(p.x - point_size / 2, p.y - point_size / 2, point_size, point_size);
    }

    drawBackground() {
        this.ctx.fillStyle = back_color;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    }

    generateRandomPoints(width, height) {
        this.data = [];
        for (let i = 0; i < this.numPoints; i++) {
            this.data.push(new Point(Math.floor(Math.random() * width),
                Math.floor(Math.random() * (height - 50))));
        }
    }

    bezierAlgorithm(temp, depth) {
        if (depth === 0) {
            //draw.bezier(ctx, tempPoints[0], tempPoints[tempPoints.length - 1]);
            this.drawCurve(temp[0], temp[temp.length - 1]);
        }

        else {
            let myReturnArray1 = [];
            let myReturnArray2 = [];

            let myPoints = [];

            myPoints.push(temp);

            for (let h = 0; h < temp.length - 1; h++) {
                myPoints.push([])
            }

            for (let j = 1; j < this.numPoints; j++) {
                for (let k = 0; k < this.numPoints - j; k++) {
                    myPoints[j].push(myHelper.pointAddition(myHelper.pointMultiply(myPoints[j - 1][k],
                        (1 - this.t)), myHelper.pointMultiply(myPoints[j - 1][k + 1], this.t)));
                    if (depth >= this.maxDepth) {
                        this.drawAuxiliary(myPoints[j - 1][k], myPoints[j - 1][k + 1], depth);
                    }
                }
            }

            for (let i = 0; i < myPoints.length; i++) {
                myReturnArray1.push(myPoints[i][0]);
            }
            for (let i = myPoints.length; i > 0; i--) {
                myReturnArray2.push(myPoints[i - 1][myPoints[i - 1].length - 1]);
            }

            this.bezierAlgorithm(myReturnArray1, depth - 1);
            this.bezierAlgorithm(myReturnArray2, depth - 1);
        }
    }

    addPoint(x, y) {
        this.data.push(new Point(x, y));
        this.numPoints++;
    }

    removePoint(x, y) {
        let temp = [];
        for (let i = 0; i < this.numPoints; i++) {
            if (x > this.data[i].x + 5 || x < this.data[i].x - 5 &&
                y > this.data[i].y + 5 || y < this.data[i].y - 5) {
                temp.push(this.data[i]);
                }
        }
        this.numPoints = temp.length;
        this.data = temp;
    }

    movePoint(x, y, newX, newY) {
        let temp = [];
        for (let i = 0; i < this.numPoints; i++) {
            if (x > this.data[i].x + 15 || x < this.data[i].x - 15 &&
                y > this.data[i].y + 15 || y < this.data[i].y - 15) {
                temp.push(this.data[i]);
            }
            else {
                temp.push(new Point(newX, newY));
            }
        }
        this.data = temp;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Helper {

    pointMultiply(p, t) {
        return new Point(p.x * t, p.y * t);
    }

    pointAddition(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }
}

let myHelper = new Helper();
