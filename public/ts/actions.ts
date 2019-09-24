import html2canvas from 'html2canvas'

let jietu = function (html_canvas: any, dom: any) {
    let isDrawing = false;
    let x = 0;
    let y = 0;

    const myPics = document.createElement('canvas')
    myPics.height = html_canvas.height
    myPics.width = html_canvas.width
    myPics.style.position = "absolute"
    myPics.style.left = dom.offsetLeft + "px"
    myPics.style.top = dom.offsetTop + "px"
    document.body.append(myPics)

    const context: any = myPics.getContext('2d');
    context.drawImage(html_canvas, 0, 0)
    drawRect(myPics, html_canvas, context, 0, 0, 0, 0)

    myPics.addEventListener('mousedown', e => {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });
    myPics.addEventListener('mousemove', e => {
        if (isDrawing === true) {
            drawRect(myPics, html_canvas, context, x, y, e.offsetX - x, e.offsetY - y)
        }
    });

    window.addEventListener('mouseup', e => {
        if (isDrawing === true) {
            drawRect(myPics, html_canvas, context, x, y, e.offsetX - x, e.offsetY - y)
            if (confirm("保留截图")) {
                let can = createScreenshots(html_canvas, x, y, e.offsetX - x, e.offsetY - y)
                let canvas_list: any = document.getElementById("lineArea")
                canvas_list.append(can)
                // drawRect(myPics, img, context, 0, 0, 0, 0)
                // myPics.height = myPics.height
                // context.drawImage(html_canvas, 0, 0)
                document.body.removeChild(myPics)
            } else {
                // drawRect(myPics, img, context, 0, 0, 0, 0)
                // myPics.height = myPics.height
                // context.drawImage(html_canvas, 0, 0)
                document.body.removeChild(myPics)
            }
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

}
/**
* 绘制矩形，canvas对象，原图_img,起点_x1,_y1,终点_x2,_y2
**/
function drawRect(_canvas: any, _img: any, _context: any, _x1: number, _y1: number, _x2: number, _y2: number) {
    _canvas.height = _canvas.height
    _context.drawImage(_img, 0, 0)
    //填充颜色
    _context.fillStyle = "#00000055"
    _context.beginPath();
    //外部区域
    _context.moveTo(0, 0);
    _context.lineTo(_canvas.width, 0);
    _context.lineTo(_canvas.width, _canvas.height);
    _context.lineTo(0, _canvas.height);
    //内部区域
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
/**
 * 创建截图，原图_img,起点_x1,_y1,终点_x2,_y2
 **/
function createScreenshots(_img: any, _x1: number, _y1: number, _x2: number, _y2: number) {
    let _canvas = document.createElement('canvas');
    _canvas.height = _y2
    _canvas.width = _x2
    let _ctx: any = _canvas.getContext("2d")
    _ctx.drawImage(_img, _x1, _y1, _x2, _y2, 0, 0, _x2, _y2)
    return _canvas
}

function createJietu() {
    let dom: any = document.getElementById("can-test")
    html2canvas(dom).then(function (canvas: any) {
        jietu(canvas, dom)
    });
}

let ajax_text = function (dom: any, url: string, data: object = {}, method: string = "POST") {
    return dom.ajax({
        url: url,
        data: data,
        method: method,
        type: "JSON"
    })
}

export { ajax_text }