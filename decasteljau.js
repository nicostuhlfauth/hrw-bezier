let max_bezier_depth = 10;
let num_points = 3;
let CP = new Array(num_points);
let t = 0.5; //document.getElementById("myT").value;

const line_width = 2;
const point_size = 3;
const back_color = '#303030';
const point_color = '#40f040';

/**
 * Represents a point object.
 * @method P
 * @param {int} x
 * @param {int} y
 * @return 
 */
function P(x, y) {
    this.x = x;
    this.y = y;
}

const draw = {
     /**
 * Draws a Point.
 * @method draw.point
 * @param {P} p
 * @return 
 */
    point: (p) => {
        ctx.fillStyle = point_color;
        ctx.fillRect(p.x - point_size / 2, p.y - point_size / 2, point_size, point_size);
    },
     /**
 * Draws a curve.
 * @method draw.bezier
 * @param {canvasContext} ctx
 * @param {P} p0
 * @param {P} p1
 * @return 
 */
    bezier: (ctx, p0, p1) => {
        const line_color = '#ff1010';
        ctx.strokeStyle = line_color;
        ctx.lineWidth = line_width;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    },
     /**
 * Draws auxiliaries
 * @method draw.auxiliary
 * @param {canvasContext} ctx
 * @param {P} p0
 * @param {P} p1
 * @param {int} depth
 * @return 
 */
    auxiliary: (ctx, p0, p1, depth) => {
        const line_color = '#00ffff';
        ctx.strokeStyle = line_color;
        ctx.lineWidth = (line_width - 1) / depth * 2;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    },
     /**
 * Sets backround color.
 * @method draw.backgroundColor
 * @param {canvasContext} ctx
 * @param {int} width
 * @param {int} height  
 * @return 
 */
    backgroundColor: (ctx, width, height) => {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);
        for (var i = 0; i < num_points; i++) {
            draw.point(CP[i]);
        }
    }
};

const helper = {
       /**
 * Multiplies the coordinates of a point P with a constant value.
 * @method helper.pointMultiply
 * @param {P} p
 * @param {int} t
 * @return P
 */
    pointMultiply: (p, t) => {
        return new P(p.x * t, p.y * t);
    },
       /**
 * Multiplies the coordinates of a point P with a constant value.
 * @method helper.pointMultiply
 * @param {P} p
 * @param {int} t
 * @return P
 */
    pointAddition: (p1, p2) => {
        return new P(p1.x + p2.x, p1.y + p2.y);
    },
      /**
 * Generates a new random Point
 * @method helper.getRandomPoint
 * @param {int} width
 * @param {int} height
 * @return P
 */
    getRandomPoint: (width, height) => {
        return new P(Math.floor(Math.random() * width),
            Math.floor(Math.random() * (height - 50)));
    },
      /**
 * Pushs a new point to the array
 * @method helper.addPoint
 * @param {int} x
 * @param {int} y
 * @return
 */
    addPoint: (x, y) => {
        CP.push(new P(x, y));
        num_points++;
    },
      /**
 * Adds multiple random points to the array, depends on # of num_points
 * @method helper.randomPoints
 * @param {int} width
 * @param {int} height
 * @return
 */
    randomPoints: (width, height) => {
        for (let i = 0; i < num_points; i++) {
            CP[i] = helper.getRandomPoint(width, height);
        }
    },
      /**
 * Removes a point from the array
 * @method helper.removePoint
 * @param {int} x
 * @param {int} y
 * @return
 */
    removePoint: (x, y) => {
        let temp = [];
        for (let i = 0; i < num_points; i++) {
            if (x > CP[i].x + 5 || x < CP[i].x - 5 &&
                y > CP[i].y + 5 || y < CP[i].y - 5) {
                temp.push(CP[i]);
            }
        }
        num_points = temp.length;
        CP = temp;
    },
      /**
 * Generates a new random Point
 * @method helper.movePoint
 * @param {int} x
 * @param {int} y
 * @param {int} newX
 * @param {int} newY
 * @return
 */
    movePoint: (x, y, newX, newY) => {
        let temp = [];
        for (let i = 0; i < num_points; i++) {
            if (x > CP[i].x + 5 || x < CP[i].x - 5 &&
                y > CP[i].y + 5 || y < CP[i].y - 5) {
                temp.push(CP[i]);
            }
            else {
                temp.push(new P(newX, newY));
            }
        }
        CP = temp;
    },
      /**
 * Getter for numPoints
 * @method helper.getRandomPoint
 * @return int
 */
    getNumPoints: () => {
        return num_points;
    },
      /**
 * Setter for numPoints
 * @method helper.getRandomPoint
 * @param {int} i
 * @return
 */
    setNumPoints: (i) => {
        num_points = i;
    },
    setT: (myT) => {
        t = myT;
    }

};

/**
 * Generates a view with n random points. #no of points depends on num_points value
 * @method helper.generateRandomView
 * @param {canvasContext} ctx
 * @param {int} width
 * @param {int} height
 * @return 
 */
function generateRandomView(ctx, width, height) {
    helper.randomPoints(width, height);
    if (ctx) {
        draw.backgroundColor(ctx, width, height);
    }
}

/**
 * Implements De Casteljau's algorithm
 * Calls draw methods to push the generated data to the Canvas
 * @method bezier
 * @param {canvasContext} ctx
 * @param {field of P objects} tempPoints
 * @param {int} t
 * @param {int} depth
 * @return 
 */
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
                myPoints[j].push(helper.pointAddition(helper.pointMultiply(myPoints[j - 1][k],
                    (1 - t)), helper.pointMultiply(myPoints[j - 1][k + 1], t)));
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

/**
 * Method is called directly after starting the software or pressing reload button.
 * Calls generateRandomView and bezier method.
 * @method domloaded
 * @param {canvas} canvas
 * @param {canvasContext} ctx
 * @return 
 */
function domloaded(ctx) {
    bezier(ctx, CP, t, max_bezier_depth);
}