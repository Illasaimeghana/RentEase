<?php

header("Access-Control-Allow-Origin: https://rent-ease-eight-phi.vercel.app");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle browser preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received"
    ]);
    exit;
}

$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required"
    ]);
    exit;
}

$sql = "INSERT INTO users (name, email, password)
        VALUES ('$name', '$email', '$password')";

if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "User registered successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
}

?>
