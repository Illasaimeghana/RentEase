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

$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);
$password = mysqli_real_escape_string($conn, $password);

$sql = "SELECT id, email
        FROM admins
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

    $admin = mysqli_fetch_assoc($result);

    echo json_encode([
        "success" => true,
        "message" => "Admin login successful",
        "admin" => $admin
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Invalid admin credentials"
    ]);
}

?>