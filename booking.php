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

$user_id = $data["user_id"] ?? "";
$property_id = $data["property_id"] ?? "";
$booking_date = $data["booking_date"] ?? "";

if ($user_id === "" || $property_id === "" || $booking_date === "") {
    echo json_encode([
        "success" => false,
        "message" => "All booking details are required"
    ]);
    exit;
}

$status = "Pending";

$sql = "INSERT INTO bookings
        (user_id, property_id, booking_date, status)
        VALUES
        ('$user_id', '$property_id', '$booking_date', '$status')";

if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "Booking created successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Booking failed: " . mysqli_error($conn)
    ]);
}

?>