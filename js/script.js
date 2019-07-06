function initial() {

    const x = 480; // 横の幅
    const y = 480; // 縦の幅
    const interval = 80; // 1マスの間隔

    var canvas = document.querySelector('#canvas');

    // Canvas対応ブラウザで処理を実行
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = "green";
        ctx.fillRect(0,0,x,y);

        for (var i = 1; i <= 6; i++) {
            // 横線
            // ctx.beginPath();
            // ctx.strokeStyle = "red";
            ctx.moveTo(0, interval * i);
            ctx.lineTo(x, interval *i);
            // ctx.closePath();
            // ctx.stroke();

            // 縦線
            // ctx.beginPath();
            // ctx.strokeStyle = "black";
            ctx.moveTo(interval * i, 0);
            ctx.lineTo(interval * i, y);
            // ctx.closePath();
            ctx.stroke();
        }

        var black = new Image();
        var white = new Image();
        black.src = "./images/black.png";
        white.src = "./images/white.png";
        black.onload = function() {
            ctx.drawImage(black, interval * 2, interval * 3);
            ctx.drawImage(black, interval * 3, interval * 2);
        }
        white.onload = function() {
            ctx.drawImage(white, interval * 2, interval * 2);
            ctx.drawImage(white, interval * 3, interval * 3);
        }
    }
}