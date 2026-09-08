<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

$sql = "SELECT * FROM properties";

$result = mysqli_query($conn, $sql);

$properties = [];

while ($row = mysqli_fetch_assoc($result)) {
    $properties[] = $row;
}

echo json_encode($properties);

?>