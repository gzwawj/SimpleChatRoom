var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "html2canvas"], function (require, exports, html2canvas_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    html2canvas_1 = __importDefault(html2canvas_1);
    var jietu = function (html_canvas, dom) {
        var isDrawing = false;
        var x = 0;
        var y = 0;
        var myPics = document.createElement('canvas');
        myPics.height = html_canvas.height;
        myPics.width = html_canvas.width;
        myPics.style.position = "absolute";
        myPics.style.left = dom.offsetLeft + "px";
        myPics.style.top = dom.offsetTop + "px";
        document.body.append(myPics);
        var context = myPics.getContext('2d');
        context.drawImage(html_canvas, 0, 0);
        drawRect(myPics, html_canvas, context, 0, 0, 0, 0);
        myPics.addEventListener('mousedown', function (e) {
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
        });
        myPics.addEventListener('mousemove', function (e) {
            if (isDrawing === true) {
                drawRect(myPics, html_canvas, context, x, y, e.offsetX - x, e.offsetY - y);
            }
        });
        window.addEventListener('mouseup', function (e) {
            if (isDrawing === true) {
                drawRect(myPics, html_canvas, context, x, y, e.offsetX - x, e.offsetY - y);
                if (confirm("保留截图")) {
                    var can = createScreenshots(html_canvas, x, y, e.offsetX - x, e.offsetY - y);
                    var canvas_list = document.getElementById("lineArea");
                    canvas_list.append(can);
                    document.body.removeChild(myPics);
                }
                else {
                    document.body.removeChild(myPics);
                }
                x = 0;
                y = 0;
                isDrawing = false;
            }
        });
    };
    function drawRect(_canvas, _img, _context, _x1, _y1, _x2, _y2) {
        _canvas.height = _canvas.height;
        _context.drawImage(_img, 0, 0);
        _context.fillStyle = "#00000055";
        _context.beginPath();
        _context.moveTo(0, 0);
        _context.lineTo(_canvas.width, 0);
        _context.lineTo(_canvas.width, _canvas.height);
        _context.lineTo(0, _canvas.height);
        _context.lineTo(_x1, _y2 + _y1);
        _context.lineTo(_x2 + _x1, _y2 + _y1);
        _context.lineTo(_x2 + _x1, _y1);
        _context.lineTo(_x1, _y1);
        _context.lineTo(_x1, _y2 + _y1);
        _context.lineTo(0, _canvas.height);
        _context.lineTo(0, 0);
        _context.closePath();
        _context.fill();
    }
    function createScreenshots(_img, _x1, _y1, _x2, _y2) {
        var _canvas = document.createElement('canvas');
        _canvas.height = _y2;
        _canvas.width = _x2;
        var _ctx = _canvas.getContext("2d");
        _ctx.drawImage(_img, _x1, _y1, _x2, _y2, 0, 0, _x2, _y2);
        return _canvas;
    }
    function createJietu() {
        var dom = document.getElementById("can-test");
        html2canvas_1.default(dom).then(function (canvas) {
            jietu(canvas, dom);
        });
    }
    var ajax_text = function (dom, url, data, method) {
        if (data === void 0) { data = {}; }
        if (method === void 0) { method = "POST"; }
        return dom.ajax({
            url: url,
            data: data,
            method: method,
            type: "JSON"
        });
    };
    exports.ajax_text = ajax_text;
});
