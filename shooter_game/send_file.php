<?php 
$fd = fopen ($_POST['filemane'], "w");
$fd2 = fopen (test.txt,"w");
fwrite($fd2, "ok ça marche");
fwrite($fd, "ok ça marche");
fwrite($fd2, $_POST['data']);
print_r($_POST);
if ($fd) {
  fwrite($fd, $_POST['data']);
  fclose($fd);
} ?>