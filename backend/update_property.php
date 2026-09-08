<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";
$title = $data["title"] ?? "";
$location = $data["location"] ?? "";
$price = $data["price"] ?? "";
$description = $data["description"] ?? "";
$image = $data["image"] ?? "";

if (
    $id === "" ||
    $title === "" ||
    $location === "" ||
    $price === "" ||
    $description === "" ||
    $image === ""
) {
    echo json_encode([
        "success" => false,
        "message" => "All property details are required"
    ]);
    exit;
}

$title = mysqli_real_escape_string($conn, $title);
$location = mysqli_real_escape_string($conn, $location);
$price = mysqli_real_escape_string($conn, $price);
$description = mysqli_real_escape_string($conn, $description);
$image = mysqli_real_escape_string($conn, $image);

$sql = "UPDATE properties
        SET
        title = '$title',
        location = '$location',
        price = '$price',
        description = '$description',
        image = '$image'
        WHERE id = '$id'";

if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "Property updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update property: " . mysqli_error($conn)
    ]);
}

?>