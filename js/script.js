const x = 480; // 横の幅
const y = 480; // 縦の幅
const interval = 80; // 1マスの間隔
const playerBlack = 'black';
const playerWhite = 'white';
const ImagePath = {
    black:'./images/black.png',
    white:'./images/white.png'
};
var player = playerBlack; // 現在のプレイヤーを保持する変数
var canvas = ''; // canvasのDOMを取得
var ctx = ''; // 
var matrixArr = { // マスの状態を保持する配列
    1:{1:'',2:'',3:'',4:'',5:'',6:''},
    2:{1:'',2:'',3:'',4:'',5:'',6:''},
    3:{1:'',2:'',3:'',4:'',5:'',6:''},
    4:{1:'',2:'',3:'',4:'',5:'',6:''},
    5:{1:'',2:'',3:'',4:'',5:'',6:''},
    6:{1:'',2:'',3:'',4:'',5:'',6:''}
}
var possiblePosition = []; // 配置可能な場所を格納する配列


// 初期化
function initial() {

    canvas = document.querySelector('#canvas');

    // Canvas対応ブラウザで処理を実行
    if (canvas.getContext) {

        ctx = canvas.getContext('2d');
        // 盤面の描画
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, x, y);

        for (let i = 1; i <= 6; i++) {
            // 横線の描画
            // ctx.beginPath();
            // ctx.strokeStyle = "black";
            ctx.moveTo(0, interval * i);
            ctx.lineTo(x, interval * i);
            // ctx.closePath();
            // ctx.stroke();

            // 縦線の描画
            ctx.moveTo(interval * i, 0);
            ctx.lineTo(interval * i, y);
            ctx.stroke();
        }

        // 初期位置
        drawImage(playerBlack, 3, 4);
        drawImage(playerBlack, 4, 3);
        drawImage(playerWhite, 3, 3);
        drawImage(playerWhite, 4, 4);

        // 現在のプレイヤーを表示
        turnOutput();

        // クリック時の処理
        canvas.onclick = move;
        
    }
}

// ターンを表示する
function turnOutput() {
    var turn = document.getElementById('turn');
    var color = '';
    if (player === 'black') {
        color = '黒';
    } else {
        color = '白';
    }
    turn.innerHTML = color + 'の番です';
}

// クリック時して石を置く処理
function move(event) {

    // クリック位置の計算
    var click_x = event.clientX - canvas.offsetLeft;
    var click_y = event.clientY - canvas.offsetTop;

    var matrixX = parseInt(click_x / interval) + 1; // 横マスの設定(1-6)
    var matrixY = parseInt(click_y / interval) + 1; // 縦マスの設定(1-6)

    // すでに置かれているマスがクリックされたら処理しない
    if (matrixArr[matrixX][matrixY] !== '') {
        console.log('そこには置けません');
        return;
    }

    // 石を置いて反転させる(置けない場所が指定されたら処理しない)
    if (!reverseStone(player, matrixX, matrixY)) {
        console.log("残念ながらそこには置けません");
        return;
    }

    // プレイヤーを交代する(マスが全て埋まったらゲーム終了)
    if (checkEmptyPosition() && !checkOnlyOneColor()) {
        changePlayer();
    } else {
        result();
        return;
    }

    // CPUの設定
    if (player === 'white') {
        cpu();
        // プレイヤーを交代する(マスが全て埋まったらゲーム終了)
        if (checkEmptyPosition() && !checkOnlyOneColor()) {
            changePlayer();
        } else {
            result();
            return;
        }
    }
}


// 石の描画
function drawImage(color, x, y) {
    var img = new Image();
    img.src = ImagePath[color];
    img.onload = function() {
        ctx.drawImage(img, interval * (x - 1), interval * (y - 1));
    }
    // 置いた場所の情報を保持する
    matrixArr[x][y] = color;
}


// 指定の場所に置けるか確認
function reverseStone(color, x, y) {

    var reverseStones = [[x, y]]; // 反転するマスを格納する配列
    var preReverseStones = [];    // 異色を挟んだ状態になったらreverseStonesに格納する

    // 下方向のチェック
    for (let i = y + 1; i <= 6; i++) {

        // 何も置かれていない場合、for文抜ける
        if (matrixArr[x][i] === '') {
            break;
        }

        if (matrixArr[x][i] !== color) { // 異色の場合
            preReverseStones.push([x, i]);
        } else if (preReverseStones.length == 0 && matrixArr[x][i] === color) { // 真下が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x][i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 上方向のチェック
    preReverseStones = [];
    for (let i = y - 1; i >= 1; i--) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[x][i] === '') {
            break;
        }

        if (matrixArr[x][i] !== color) { // 異色の場合
            preReverseStones.push([x, i]);
        } else if (preReverseStones.length == 0 && matrixArr[x][i] === color) { // 真上が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x][i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 右方向のチェック
    preReverseStones = [];
    for (let i = x + 1; i <= 6; i++) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[i][y] === '') {
            break;
        }

        if (matrixArr[i][y] !== color) { // 異色の場合
            preReverseStones.push([i, y]);
        } else if (preReverseStones.length == 0 && matrixArr[i][y] === color) { // 真右が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[i][y] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 左方向のチェック
    preReverseStones = [];
    for (let i = x - 1; i >= 1; i--) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[i][y] === '') {
            break;
        }

        if (matrixArr[i][y] !== color) { // 異色の場合
            preReverseStones.push([i, y]);
        } else if (preReverseStones.length == 0 && matrixArr[i][y] === color) { // 真左が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[i][y] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 右斜め下方向のチェック
    preReverseStones = [];
    for (let i = 1; i <= 6; i++) {

        // 一番下または一番右のマスの場合はfor文を抜ける
        if (x + i === 7 || y + i === 7 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x + i][y + i] === '') {
            break;
        }
        if (matrixArr[x + i][y + i] !== color) { // 異色の場合
            preReverseStones.push([x + i, y + i]);
        } else if (preReverseStones.length == 0 && matrixArr[x + i][y + i] === color) { // 右斜め下が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x + i][y + i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 右斜め上方向のチェック
    preReverseStones = [];
    for (let i = 1; i <= 6; i++) {

        // 一番上または一番右のマスの場合はfor文を抜ける
        if (x + i === 7 || y - i === 0 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x + i][y - i] === '') {
            break;
        }
        if (matrixArr[x + i][y - i] !== color) { // 異色の場合
            preReverseStones.push([x + i, y - i]);
        } else if (preReverseStones.length == 0 && matrixArr[x + i][y - i] === color) { // 右斜め上が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x + i][y - i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 左斜め下方向のチェック
    preReverseStones = [];
    for (let i = 1; i <= 6; i++) {

        // 一番下または一番右のマスの場合はfor文を抜ける
        if (x - i === 0 || y + i === 7 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x - i][y + i] === '') {
            break;
        }
        if (matrixArr[x - i][y + i] !== color) { // 異色の場合
            preReverseStones.push([x - i, y + i]);
        } else if (preReverseStones.length == 0 && matrixArr[x - i][y + i] === color) { // 左斜め下が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x - i][y + i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 左斜め上方向のチェック
    preReverseStones = [];
    for (let i = 1; i <= 6; i++) {

        // 一番上または一番左のマスの場合はfor文を抜ける
        if (x - i === 0 || y - i === 0 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x - i][y - i] === '') {
            break;
        }
        if (matrixArr[x - i][y - i] !== color) { // 異色の場合
            preReverseStones.push([x - i, y - i]);
        } else if (preReverseStones.length == 0 && matrixArr[x - i][y - i] === color) { // 左斜め上が同色の場合
            break;
        } else if (preReverseStones.length > 0 && matrixArr[x - i][y - i] === color) { // 異色を挟んだ形の場合
            reverseStones = reverseStones.concat(preReverseStones);
            break;
        }
    }

    // 石を置いて挟んだ色を反転させる
    if (reverseStones.length > 1) {
        for (val of reverseStones) {
            drawImage(color, val[0], val[1]);
        }
        return true;
    } else {
        return false;
    }

}


/**
 * プレイヤーを交代する関数
 */
function changePlayer() {

    if (player === playerBlack) {
        player = playerWhite;
    } else {
        player = playerBlack;
    }

    // 置ける場所がない場合は再度プレイヤーを変える
    if (!existPossiblePositionCheck(player)) {
        changePlayer(player);
    }
    
    // 現在のプレイヤーを表示する
    turnOutput();
}


/**
 * 置ける場所があるかどうか判定する関数
 * @param {string} color
 * @return {boolean} 置く場所ありtrue, 置く場所なしfalse
 */
function existPossiblePositionCheck(color) {
    
    possiblePosition = []; // 配置可能マスの初期化

    for (let x = 1; x <=6; x++) {
        for (let y = 1; y <= 6; y++) {
            // すでに置かれているマスは対象外
            if (matrixArr[x][y] !== '') {
                continue;
            }
            
            // 置けるか判別し、置ければpossiblePositionに追加する。
            outflankingPlaces(color, x, y);
        }
    }

    // 1箇所以上置ける場所があるか判定
    if (possiblePosition.length === 0) {
        return false;
    }

    return true;
}


/**
 * 指定の場所が配置可能ならpossiblePositionに設定する関数
 * @param {string} color
 * @param {number} x
 * @param {number} y
 */
function outflankingPlaces(color, x, y) {

    var counter = 0;

    // 下方向のチェック
    for (let i = y + 1; i <= 6; i++) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[x][i] === '') {
            break;
        }

        if (matrixArr[x][i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x][i] === color) { // 真下が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x][i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 上方向のチェック
    counter = 0;
    for (let i = y - 1; i >= 1; i--) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[x][i] === '') {
            break;
        }

        if (matrixArr[x][i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x][i] === color) { // 真上が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x][i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 右方向のチェック
    counter = 0;
    for (let i = x + 1; i <= 6; i++) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[i][y] === '') {
            break;
        }

        if (matrixArr[i][y] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[i][y] === color) { // 真右が同色の場合
            break;
        } else if (counter > 0 && matrixArr[i][y] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 左方向のチェック
    counter = 0;
    for (let i = x - 1; i >= 1; i--) {
        // 何も置かれていない場合、for文抜ける
        if (matrixArr[i][y] === '') {
            break;
        }

        if (matrixArr[i][y] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[i][y] === color) { // 真左が同色の場合
            break;
        } else if (counter > 0 && matrixArr[i][y] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 右斜め下方向のチェック
    counter = 0;
    for (let i = 1; i <= 6; i++) {

        // 一番下または一番右のマスの場合はfor文を抜ける
        if (x + i === 7 || y + i === 7 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x + i][y + i] === '') {
            break;
        }
        if (matrixArr[x + i][y + i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x + i][y + i] === color) { // 右斜め下が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x + i][y + i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 右斜め上方向のチェック
    counter = 0;
    for (let i = 1; i <= 6; i++) {

        // 一番上または一番右のマスの場合はfor文を抜ける
        if (x + i === 7 || y - i === 0 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x + i][y - i] === '') {
            break;
        }
        if (matrixArr[x + i][y - i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x + i][y - i] === color) { // 右斜め上が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x + i][y - i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 左斜め下方向のチェック
    counter = 0;
    for (let i = 1; i <= 6; i++) {

        // 一番下または一番右のマスの場合はfor文を抜ける
        if (x - i === 0 || y + i === 7 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x - i][y + i] === '') {
            break;
        }
        if (matrixArr[x - i][y + i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x - i][y + i] === color) { // 左斜め下が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x - i][y + i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }

    // 左斜め上方向のチェック
    counter = 0;
    for (let i = 1; i <= 6; i++) {

        // 一番上または一番左のマスの場合はfor文を抜ける
        if (x - i === 0 || y - i === 0 ) {
            break;
        }

        // 何も置かれていない場合、for文を抜ける
        if (matrixArr[x - i][y - i] === '') {
            break;
        }
        if (matrixArr[x - i][y - i] !== color) { // 異色の場合
            counter++;
        } else if (counter == 0 && matrixArr[x - i][y - i] === color) { // 左斜め上が同色の場合
            break;
        } else if (counter > 0 && matrixArr[x - i][y - i] === color) { // 異色を挟んだ形の場合
            possiblePosition.push([[x,y]]);
            return;
        }
    }
}


/**
 * マスが全て空きがあるか判定する関数
 * @return {boolean} 空きありtrue, 空きなしfalse
 */
function checkEmptyPosition() {

    for (let x = 1; x <=6; x++) {
        for (let y = 1; y <= 6; y++) {
            if (matrixArr[x][y] === '') {
                return true;
            }
        }
    }
    return false;

    // 下のような書き方もある
    // for (var key1 in matrixArr) { // memo: 連想配列のfor文でofは使えない。
    //     for (var key2 in matrixArr[key]) {
    //         if (matrixArr[key1][key2] === '') {
    //             return true;
    //         }
    //     }
    // }
    // return false;
}


/**
 * 色が全て同色のみになったかどうかを判定する関数
 */
function checkOnlyOneColor() {

    var black = 0;
    var white = 0;

    for (let x = 1; x <=6; x++) {
        for (let y = 1; y <= 6; y++) {
            if (matrixArr[x][y] === 'black') {
                black++;
            } else if (matrixArr[x][y] === 'white') {
                white++;
            }
            if (black > 0 && white > 0) {
                return false;
            }
        }
    }
    return true;
}


/**
 * 結果を表示する関数
 */
function result() {

    var black = 0;
    var white = 0;
    var win = '';
    var turn = document.getElementById('turn');

    // 各色のカウント
    for (let x = 1; x <=6; x++) {
        for (let y = 1; y <= 6; y++) {
            if (matrixArr[x][y] === 'black') {
                black++;
            } else if (matrixArr[x][y] === 'white'){
                white++;
            }
        }
    }
    
    // 勝敗の計算
    if (black > white) {
        win = '黒';
    } else if (black < white) {
        win = '白';
    }

    // 結果の表示
    if (win !== '') {
        turn.innerHTML = '黒' + black + ' ー 白' + white + ' (' + win + 'の勝ちです！' + ')';
    } else {
        turn.innerHTML = '黒' + black + ' ー 白' + white + ' (引き明けです)';
    }

}

function cpu () {

    // 置ける場所をチェック
    if (existPossiblePositionCheck(player)) {
        var key = Math.floor(Math.random() * possiblePosition.length);
        reverseStone(player, possiblePosition[key][0][0], possiblePosition[key][0][1]);
    }

}