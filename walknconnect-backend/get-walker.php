<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$conn = new mysqli("localhost", "root", "", "walknconnect_db");

if ($conn->connect_error) {
    die(json_encode(["error" => $conn->connect_error]));
}

// Only fetch walkers who have all required fields filled
$sql = "SELECT u.id, u.full_name, u.email, u.phone, u.city, u.profile_pic
        FROM users u
        LEFT JOIN partners p ON u.id = p.id
        WHERE u.role = 'walker'
        AND u.full_name IS NOT NULL AND u.full_name != ''
        AND u.phone IS NOT NULL AND u.phone != ''
        AND u.city IS NOT NULL AND u.city != ''
        AND u.profile_pic IS NOT NULL AND u.profile_pic != '';
        -- AND p.experience IS NOT NULL AND p.experience != ''
        -- AND p.walking_speed IS NOT NULL AND p.walking_speed != ''
        -- AND p.preferred_time IS NOT NULL AND p.preferred_time != ''
        -- AND p.price_per_hour IS NOT NULL AND p.price_per_hour != ''";

$result = $conn->query($sql);

if (!$result) {
    die(json_encode([
        "success" => false,
        "sql_error" => $conn->error
    ]));
}

$walkers = [];

while ($row = $result->fetch_assoc()) {
    $walkers[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $walkers
]);
