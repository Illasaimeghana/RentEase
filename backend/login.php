<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

include "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "POST request required"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = isset($data["email"]) ? $data["email"] : "";
$password = isset($data["password"]) ? $data["password"] : "";

if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);
$password = mysqli_real_escape_string($conn, $password);

$sql = "SELECT id, name, email
        FROM users
        WHERE email = '$email'
        AND password = '$password'";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
    exit;
}

if (mysqli_num_rows($result) > 0) {

    $user = mysqli_fetch_assoc($result);

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => $user
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
}

exit;
?>