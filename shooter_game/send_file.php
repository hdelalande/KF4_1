<?php 
$fd = fopen ($_POST['filemane'], "w");
fwrite($fd, "ok ça marche");
if ($fd) {
  fwrite($fd, $_POST['data']);
  fclose($fd);
} ?>