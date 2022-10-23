<?php 
$fd = fopen ($_POST['filemane'], "w");
print_r($_POST);
if ($fd) {
  fwrite($fd, $_POST['data']);
  fclose($fd);
} ?>