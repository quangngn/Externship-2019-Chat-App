var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

let clickX = [];
let clickY = [];
let clickDrag = [];
let paint = false;

//methods
function addClick (x, y, drag) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
}

function redraw(ctx, clickX, clickY, clickDrag) {
    //clear the canvas
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle ="#18184e";
    ctx.lineJoin ="round";
    ctx.lineWidth = 5;

    for(let i = 0; i < clickX.length; i ++) {
        ctx.beginPath();
        if(clickDrag[i] && i) {
            ctx.moveTo(clickX[i - 1], clickY[i  - 1]);
        } else {
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.stroke();
    }
}

function getDrawPaths(){
    return {x:clickX, y:clickY, drag:clickDrag};
}

function clearDrawPaths() {
    clickX =[];
    clickY = [];
    clickDrag = [];
    redraw(ctx, clickX, clickY, clickDrag);
}

//mouse event
canvas.onmousedown = function(e) {
    var mouseX = e.pageX - canvas.offsetLeft;
    var mouseY = e.pageY - canvas.offsetTop;

    paint = true;
    addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
    //console.log(`event mouse down: x = ${e.pageX - this.offsetLeft}, y = ${e.pageY - this.offsetTop}`);
    redraw(ctx, clickX, clickY, clickDrag);
};

canvas.onmousemove = function(e) {
    if(paint) {
        addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
        //console.log(`event mouse move: x = ${e.pageX - this.offsetLeft}, y = ${e.pageY - this.offsetTop}`);
        redraw(ctx, clickX, clickY, clickDrag);
    }
};

canvas.onmouseup = function(e) {
    paint = false;
};

canvas.onmouseleave = function (e) {
    paint = false;
};

//export
export {redraw, clearDrawPaths, getDrawPaths};