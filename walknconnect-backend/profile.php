<?php
ini_set('display_errors', 1); // Enable errors for debugging
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require __DIR__ . "/connection.php";

/* ======================
   Handle preflight OPTIONS
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ======================
   GET: Fetch profile
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, full_name, email, phone, dob, address, gender, city, bio, profile_pic, aadhar_pic FROM users WHERE id = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare failed", "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $profile = $result->fetch_assoc();

    if ($profile) {
        echo json_encode(["success" => true, "profile" => $profile]);
    } else {
        echo json_encode(["success" => false, "message" => "Profile not found"]);
    }
    exit;
}

/* ======================
   POST: Create/Update profile
====================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Required fields
    $user_id = $_POST['user_id'] ?? null;
    $full_name = $_POST['full_name'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $city = $_POST['city'] ?? '';
    $bio = $_POST['bio'] ?? '';

    if (!$user_id || !$full_name || !$dob || !$phone || !$address || !$gender || !$city || !$bio) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    // Upload directory
    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir))
        mkdir($uploadDir, 0777, true);

    // Profile pic
    if (!empty($_FILES['profile_pic']['name'])) {
        $profile_pic = time() . "_profile_" . basename($_FILES['profile_pic']['name']);
        move_uploaded_file($_FILES['profile_pic']['tmp_name'], $uploadDir . $profile_pic);
    } else {
        $profile_pic = $_POST['existingProfilePic'] ?? null;
    }

    // Aadhaar pic
    if (!empty($_FILES['aadhar_pic']['name'])) {
        $aadhar_pic = time() . "_aadhar_" . basename($_FILES['aadhar_pic']['name']);
        move_uploaded_file($_FILES['aadhar_pic']['tmp_name'], $uploadDir . $aadhar_pic);
    } else {
        $aadhar_pic = $_POST['existingAadharPic'] ?? null;
    }

    // Update query
    $stmt = $conn->prepare("UPDATE users SET full_name=?, dob=?, phone=?, address=?, gender=?, city=?, bio=?, profile_pic=?, aadhar_pic=? WHERE id=?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare failed", "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("sssssssssi", $full_name, $dob, $phone, $address, $gender, $city, $bio, $profile_pic, $aadhar_pic, $user_id);

    if ($stmt->execute()) {
        $stmt2 = $conn->prepare("SELECT * FROM users WHERE id=?");
        $stmt2->bind_param("i", $user_id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $updatedProfile = $result2->fetch_assoc();

        echo json_encode(["success" => true, "message" => "Profile saved successfully", "profile" => $updatedProfile]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error", "error" => $stmt->error]);
    }

    exit;
}

// Invalid request method
echo json_encode(["success" => false, "message" => "Invalid request"]);
exit;
?>