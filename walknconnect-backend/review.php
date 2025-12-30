<?php
session_start();

// CORS headers
$allowedOrigin = "http://localhost:5173";
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    exit();
}

$conn = new mysqli("localhost", "root", "", "walknconnect_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB error"]);
    exit();
}

/* ======================
   GET REVIEWS
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (!isset($_GET['walker_id'])) {
        echo json_encode(["success" => false, "message" => "walker_id missing"]);
        exit();
    }

    $walker_id = (int) $_GET['walker_id'];

    $stmt = $conn->prepare("
        SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            u.full_name AS user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.walker_id = ?
        ORDER BY r.created_at DESC
    ");

    $stmt->bind_param("i", $walker_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode([
        "success" => true,
        "reviews" => $reviews
    ]);
    exit();
}

/* ======================
   ADD REVIEW
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data['walker_id']) ||
        empty($data['rating']) ||
        empty($data['user_id'])
    ) {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
        exit();
    }

    $walker_id = (int) $data['walker_id'];
    $rating = (int) $data['rating'];
    $comment = $data['comment'] ?? "";
    $user_id = (int) $data['user_id']; // get from POST

    $stmt = $conn->prepare("
        INSERT INTO reviews (walker_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("iiis", $walker_id, $user_id, $rating, $comment);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    exit();
}
