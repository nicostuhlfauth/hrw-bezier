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

var width = 600;
var height = 600;
var max_bezier_depth = 5;
var num_points = 3;
var CP = Array(num_points);
var line_width = 2;
var point_size = 3;
var back_color = '#303030';
var line_color = '#ff1010';
var point_color = '#40f040';
var tangent_color = '#1010f0';

function draw() {
    for (var i = 0; i < num_points; i++) {
        CP[i] = getRandomPoint(width, height);
    }
    if (ctx) {
        ctx.fillStyle = back_color;
        ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = line_width;
        ctx.strokeStyle = line_color;
        bezier(CP);

        for (var i = 0; i < num_points; i++) {
            point(CP[i]);
        }
    }
}

function point(P) {
    ctx.fillStyle = point_color;
    ctx.fillRect(P.x - point_size / 2, P.y - point_size / 2, point_size, point_size);
}
function line(P0, P1) {
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

function tangentLine(P0, P1) {
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.lineTo(P1.x, P1.y);
    ctx.stroke();
}

function bezier3(P0, P1, P2, tiefe) {
    if (tiefe == 0) line(P0, P2);
    else {
        var P01 = new P(0.5 * (P0.x + P1.x), 0.5 * (P0.y + P1.y));
        var P12 = new P(0.5 * (P1.x + P2.x), 0.5 * (P1.y + P2.y));

        var P012 = new P(0.5 * (P01.x + P12.x), 0.5 * (P01.y + P12.y));

        bezier3(P0, P01, P012, tiefe - 1);
        bezier3(P012, P12, P2, tiefe - 1);
    }
}
function bezier4(P0, P1, P2, P3, tiefe) {
    if (tiefe == 0) line(P0, P3);
    else {
        var P01 = new P(0.5 * (P0.x + P1.x), 0.5 * (P0.y + P1.y));
        var P12 = new P(0.5 * (P1.x + P2.x), 0.5 * (P1.y + P2.y));
        var P23 = new P(0.5 * (P2.x + P3.x), 0.5 * (P2.y + P3.y));
        tangentLine(P01, P12);
        tangentLine(P12, P23);

        var P012 = new P(0.5 * (P01.x + P12.x), 0.5 * (P01.y + P12.y));
        var P123 = new P(0.5 * (P12.x + P23.x), 0.5 * (P12.y + P23.y));
        tangentLine(P012, P123);


        var P0123 = new P(0.5 * (P012.x + P123.x), 0.5 * (P012.y + P123.y));

        bezier4(P0, P01, P012, P0123, tiefe - 1);
        bezier4(P0123, P123, P23, P3, tiefe - 1);
    }
}

function bezier5(P0, P1, P2, P3, P4, tiefe) {
    if (tiefe == 0) line(P0, P4);
    else {
        var P01 = new P(0.5 * (P0.x + P1.x), 0.5 * (P0.y + P1.y));
        var P12 = new P(0.5 * (P1.x + P2.x), 0.5 * (P1.y + P2.y));
        var P23 = new P(0.5 * (P2.x + P3.x), 0.5 * (P2.y + P3.y));
        var P34 = new P(0.5 * (P3.x + P4.x), 0.5 * (P3.y + P4.y));

        var P012 = new P(0.5 * (P01.x + P12.x), 0.5 * (P01.y + P12.y));
        var P123 = new P(0.5 * (P12.x + P23.x), 0.5 * (P12.y + P23.y));
        var P234 = new P(0.5 * (P23.x + P34.x), 0.5 * (P23.y + P34.y));

        var P0123 = new P(0.5 * (P012.x + P123.x), 0.5 * (P012.y + P123.y));
        var P1234 = new P(0.5 * (P123.x + P234.x), 0.5 * (P123.y + P234.y));

        var P01234 = new P(0.5 * (P0123.x + P1234.x), 0.5 * (P0123.y + P1234.y));


        bezier5(P0, P01, P012, P0123, P01234, tiefe - 1);
        bezier5(P01234, P1234, P234, P34, P4, tiefe - 1);
    }
}

function bezier(points) {

    if (points.length == 3) {
        bezier3(points[0], points[1], points[2], max_bezier_depth);
    }
    if (points.length == 4) {
        bezier4(points[0], points[1], points[2], points[3], max_bezier_depth);
    }
    if (points.length == 5) {
        bezier5(points[0], points[1], points[2], points[3], points[4], max_bezier_depth);
    }
}