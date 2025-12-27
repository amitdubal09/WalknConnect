<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/* ✅ CORS */
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

/* ✅ Preflight */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "connection.php";

/* ✅ Read JSON safely */
$data = json_decode(file_get_contents("php://input"), true);

/* ✅ VALIDATION (IMPORTANT) */
if (
    !$data ||
    !isset($data['full_name'], $data['email'], $data['number'], $data['password'])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request data"
    ]);
    exit();
}

$name = trim($data['full_name']);
$email = trim($data['email']);
$number = trim($data['number']);
$role = trim($data['role']);
$password = trim($data['password']);

/* ✅ Check email exists */
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already exists"
    ]);
    exit();
}

/* ✅ Insert user */
$stmt = $conn->prepare(
    "INSERT INTO users (full_name, email, phone, password, role)
     VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("sssss", $name, $email, $number, $password, $role);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $stmt->insert_id,
            "name" => $name,
            "email" => $email
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Registration failed"
    ]);
}

$stmt->close();
$conn->close();
