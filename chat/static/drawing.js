var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

let clickX = [];
let clickY = [];
let clickDrag = [];
let paint = false;

//methods
function addClick(x, y, drag) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
}

function redraw(ctx, clickX, clickY, clickDrag) {
    //clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;

    for (let i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if (clickDrag[i] && i) {
            ctx.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            ctx.moveTo(clickX[i] - 1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.stroke();
    }
}

function getDrawPaths() {
    return {x: clickX, y: clickY, drag: clickDrag};
}

function clearDrawPaths() {
    clickX = [];
    clickY = [];
    clickDrag = [];
    redraw(ctx, clickX, clickY, clickDrag);
}

//src: https://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf
//magical :)
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//**********************************************************************************************************************
//mouse event
canvas.onmousedown = function (e) {
    paint = true;

    let x = getMousePos(canvas, e).x;
    let y = getMousePos(canvas, e).y;

    addClick(x, y, false);
    redraw(ctx, clickX, clickY, clickDrag);
};

canvas.onmousemove = function (e) {
    if (paint) {
        let x = getMousePos(canvas, e).x;
        let y = getMousePos(canvas, e).y;

        addClick(x, y, true);
        redraw(ctx, clickX, clickY, clickDrag);
    }
};

canvas.onmouseup = function (e) {
    paint = false;
};

canvas.onmouseleave = function (e) {
    paint = false;
};

//export
export {redraw, clearDrawPaths, getDrawPaths};