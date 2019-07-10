<?php

$fr = @fopen('totalPlayTime.txt', 'r');

// total.txtファイルが存在しない場合は処理しない
if (!$fr) {
    exit;
}

// プレイ回数を変数へ格納
$total = fgets($fr);
fclose($fr);

// プレイ回数を+1して上書き
$fw = fopen('totalPlayTime.txt', 'w');
fputs($fw, ++$total);
fclose($fw);

?>