<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

include "db.php";

$user_id = $_GET["user_id"] ?? "";

if ($user_id === "") {
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit;
}

$sql = "SELECT
            bookings.id AS BookingId,
            bookings.booking_date AS BookingDate,
            bookings.status AS Status,
            properties.id AS PropertyId,
            properties.title AS Title,
            properties.location AS Location,
            properties.price AS Price,
            properties.description AS Description,
            properties.image AS Image
        FROM bookings
        INNER JOIN properties
        ON bookings.property_id = properties.id
        WHERE bookings.user_id = '$user_id'
        ORDER BY bookings.id DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . mysqli_error($conn)
    ]);
    exit;
}

$bookings = [];

while ($row = mysqli_fetch_assoc($result)) {
    $bookings[] = $row;
}

echo json_encode([
    "success" => true,
    "bookings" => $bookings
]);

?>