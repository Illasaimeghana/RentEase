<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if (!isset($_FILES["image"])) {
    echo json_encode([
        "success" => false,
        "message" => "No image received"
    ]);
    exit;
}

$image = $_FILES["image"];

$allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
];

if (!in_array($image["type"], $allowedTypes)) {
    echo json_encode([
        "success" => false,
        "message" => "Only JPG, PNG and WEBP images are allowed"
    ]);
    exit;
}

$extension = pathinfo($image["name"], PATHINFO_EXTENSION);

$fileName = time() . "_" . uniqid() . "." . $extension;

$uploadPath = "../images/" . $fileName;

if (move_uploaded_file($image["tmp_name"], $uploadPath)) {

    echo json_encode([
        "success" => true,
        "message" => "Image uploaded successfully",
        "fileName" => $fileName
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Image upload failed"
    ]);
}

?>