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

require 'connection.php';

/* ✅ Read JSON */
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['login'], $data['password'])) {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit();
}

$login = trim($data['login']);
$password = trim($data['password']);

/* ✅ Find user by email, full_name, or phone */
$stmt = $conn->prepare("SELECT id, full_name, email, phone, password, role, profile_pic FROM users WHERE email = ? OR full_name = ? OR phone = ?");
$stmt->bind_param("sss", $login, $login, $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit();
}

$user = $result->fetch_assoc();

/* ✅ Plain text password check */
if ($password !== $user['password']) {
    echo json_encode(["status" => "error", "message" => "Wrong password"]);
    exit();
}


/* ✅ Success */
echo json_encode([
    "status" => "success",
    "user" => [
        "id" => $user['id'],
        "name" => $user['full_name'],
        "email" => $user['email'],
        "phone" => $user['phone'],
        "role" => $user['role'],
        "profile_pic" => $user['profile_pic']
    ]
]);
?>