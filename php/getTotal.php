<?php

$fp = @fopen('total.txt', 'r');

if ($fp) {
    echo "現在 " . fgets($fp) . " 連勝中";
}
?>