<?php

// リクエストパラメータの指定がない場合は処理しない
if (!isset($_POST['winner'])) {
    exit;
}

$fr = @fopen('total.txt', 'r');

// total.txtファイルが存在しない場合は処理しない
if (!$fr) {
    exit;
}

// 連勝数を変数へ格納
$total = fgets($fr);
fclose($fr);

$msg = ""; // メッセージ

if ($_POST['winner'] === '黒') {
    $total++; // 連勝数を+1
    $msg = "連勝記録が " . $total . " になりました！";
} elseif ($_POST['winner'] === '白') {
    $total = 0; // 連勝数をリセット
    $msg = "連勝記録がリセットされました";
} else {
    $msg = "連勝記録は " . $total . " です";
}

$fw = fopen('total.txt', 'w');
fputs($fw, $total);
fclose($fw);

echo $msg;

// プレイ回数を記録する
include 'playTimeSave.php';

?>