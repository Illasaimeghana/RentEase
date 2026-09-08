<?php

header("Access-Control-Allow-Origin: https://rent-ease-eight-phi.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? "";

if ($id === "") {
    echo json_encode([
        "success" => false,
        "message" => "Property ID is required"
    ]);
    exit;
}

$sql = "DELETE FROM properties WHERE id = '$id'";

if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "Property deleted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete property: " . mysqli_error($conn)
    ]);
}

?>
