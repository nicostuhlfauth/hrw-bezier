'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Copyright (c) 2017 Nicolas Stuhlfauth and Benedikt Rauch
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

var line_width = 2;
var point_size = 3;
var back_color = '#303030';
var point_color = '#40f040';

/**
 * Represents a Beziere Curve object.
 *
 * @class Curve
 */

var Curve = function () {
    function Curve(ctx) {
        _classCallCheck(this, Curve);

        this.ctx = ctx;
        this.numPoints = 3;
        this.data = [];
        this.maxDepth = 7;
        this.t = 0.5;
        this.aux = true;
    }

    /**
     * Draws the Curve with given points.
     *
     * @param {Point} p0
     * @param {Point} p1
     *
     * @memberOf Curve
     */


    _createClass(Curve, [{
        key: 'drawCurve',
        value: function drawCurve(p0, p1) {

            for (var i = 0; i < this.numPoints; i++) {
                this.drawPoints(this.data[i]);
            }

            var line_color = '#ff1010';

            this.ctx.strokeStyle = line_color;
            this.ctx.lineWidth = line_width;

            this.ctx.beginPath();
            this.ctx.moveTo(p0.x, p0.y);
            this.ctx.lineTo(p1.x, p1.y);
            this.ctx.stroke();
        }

        /**
         * Draws auxiliary
         *
         * @param {Point} p0
         * @param {Point} p1
         * @param {int} depth
         *
         * @memberOf Curve
         */

    }, {
        key: 'drawAuxiliary',
        value: function drawAuxiliary(p0, p1, depth) {
            var line_color = '#00ffff';
            this.ctx.strokeStyle = line_color;
            this.ctx.lineWidth = (line_width - 1) / depth * 2;

            this.ctx.beginPath();
            this.ctx.moveTo(p0.x, p0.y);
            this.ctx.lineTo(p1.x, p1.y);
            this.ctx.stroke();
        }
    }, {
        key: 'renewAux',
        value: function renewAux() {
            this.aux = !this.aux;
        }
    }, {
        key: 'getAux',
        value: function getAux() {
            return this.aux;
        }

        /**
         * Draws a point to Canvas.
         *
         * @param {Point} p
         *
         * @memberOf Curve
         */

    }, {
        key: 'drawPoints',
        value: function drawPoints(p) {
            this.ctx.fillStyle = point_color;
            this.ctx.fillRect(p.x - point_size / 2, p.y - point_size / 2, point_size, point_size);
        }

        /**
         * Draws Canvas background color
         *
         *
         * @memberOf Curve
         */

    }, {
        key: 'drawBackground',
        value: function drawBackground() {
            this.ctx.fillStyle = back_color;
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }

        /**
         * Generates random points, # depends on numpoints attribute
         *
         * @param {int} width
         * @param {int} height
         *
         * @memberOf Curve
         */

    }, {
        key: 'generateRandomPoints',
        value: function generateRandomPoints(width, height) {
            this.data = [];
            for (var i = 0; i < this.numPoints; i++) {
                this.data.push(new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * (height - 50))));
            }
        }

        /**
         * Implements De Casteljau's Algorithm
         * Calls draw methods to push the generated data to the Canvas
         *
         * @param {Array of Points} temp
         * @param {int} depth
         *
         * @memberOf Curve
         */

    }, {
        key: 'bezierAlgorithm',
        value: function bezierAlgorithm(temp, depth) {
            if (depth === 0) {
                this.drawCurve(temp[0], temp[temp.length - 1]);
            } else {
                var myReturnArray1 = [];
                var myReturnArray2 = [];

                var myPoints = [];

                myPoints.push(temp);

                for (var h = 0; h < temp.length - 1; h++) {
                    myPoints.push([]);
                }

                for (var j = 1; j < this.numPoints; j++) {
                    for (var k = 0; k < this.numPoints - j; k++) {
                        myPoints[j].push(myHelper.pointAddition(myHelper.pointMultiply(myPoints[j - 1][k], 1 - this.t), myHelper.pointMultiply(myPoints[j - 1][k + 1], this.t)));
                        if (depth >= this.maxDepth && this.aux) {
                            this.drawAuxiliary(myPoints[j - 1][k], myPoints[j - 1][k + 1], depth);
                        }
                    }
                }

                for (var i = 0; i < myPoints.length; i++) {
                    myReturnArray1.push(myPoints[i][0]);
                }
                for (var _i = myPoints.length; _i > 0; _i--) {
                    myReturnArray2.push(myPoints[_i - 1][myPoints[_i - 1].length - 1]);
                }

                this.bezierAlgorithm(myReturnArray1, depth - 1);
                this.bezierAlgorithm(myReturnArray2, depth - 1);
            }
        }

        /**
         * Pushs a new point to the array
         *
         * @param {int} x
         * @param {int} y
         *
         * @memberOf Curve
         */

    }, {
        key: 'addPoint',
        value: function addPoint(x, y) {
            this.data.push(new Point(x, y));
            this.numPoints++;
        }

        /**
         * Removes a given point from the array
         *
         * @param {int} x
         * @param {int} y
         *
         * @memberOf Curve
         */

    }, {
        key: 'removePoint',
        value: function removePoint(x, y) {
            var temp = [];
            for (var i = 0; i < this.numPoints; i++) {
                if (x > this.data[i].x + 5 || x < this.data[i].x - 5 && y > this.data[i].y + 5 || y < this.data[i].y - 5) {
                    temp.push(this.data[i]);
                }
            }
            if (x === 0 && y === 0) {
                temp.pop();
            }
            this.numPoints = temp.length;
            this.data = temp;
        }

        /**
         * Moves a given point to a new position
         *
         * @param {int} x
         * @param {int} y
         * @param {int} newX
         * @param {int} newY
         *
         * @memberOf Curve
         */

    }, {
        key: 'movePoint',
        value: function movePoint(x, y, newX, newY) {
            var temp = [];
            for (var i = 0; i < this.numPoints; i++) {
                if (x > this.data[i].x + 15 || x < this.data[i].x - 15 && y > this.data[i].y + 15 || y < this.data[i].y - 15) {
                    temp.push(this.data[i]);
                } else {
                    temp.push(new Point(newX, newY));
                }
            }
            this.data = temp;
        }
    }]);

    return Curve;
}();

/**
 * Represents a Point object.
 *
 * @class Point
 */


var Point = function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
};

/**
 * Helper Class
 *
 * @class Helper
 */


var Helper = function () {
    function Helper() {
        _classCallCheck(this, Helper);
    }

    _createClass(Helper, [{
        key: 'pointMultiply',


        /**
         * Multiplies a point with a constant value
         *
         * @param {Point} p
         * @param {float} t
         * @returns
         *
         * @memberOf Helper
         */
        value: function pointMultiply(p, t) {
            return new Point(p.x * t, p.y * t);
        }

        /**
         * Adds two points.
         *
         * @param {Point} p1
         * @param {Point} p2
         * @returns
         *
         * @memberOf Helper
         */

    }, {
        key: 'pointAddition',
        value: function pointAddition(p1, p2) {
            return new Point(p1.x + p2.x, p1.y + p2.y);
        }
    }]);

    return Helper;
}();

var myHelper = new Helper();