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

$booking_id = $data["booking_id"] ?? "";

if ($booking_id === "") {

    echo json_encode([
        "success" => false,
        "message" => "Booking ID is required"
    ]);

    exit;
}

$booking_id = mysqli_real_escape_string($conn, $booking_id);

$sql = "DELETE FROM bookings
        WHERE id = '$booking_id'";

if (mysqli_query($conn, $sql)) {

    echo json_encode([
        "success" => true,
        "message" => "Booking cancelled successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to cancel booking: " . mysqli_error($conn)
    ]);

}

?>