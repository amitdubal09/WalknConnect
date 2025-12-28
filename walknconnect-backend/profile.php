<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require __DIR__ . "/connection.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit;

/* ====================== GET PROFILE ====================== */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(["success" => false, "message" => "ID required"]);
        exit;
    }

    // users
    $stmt = $conn->prepare("SELECT * FROM users WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Profile not found"]);
        exit;
    }

    // partners (optional)
    $stmt2 = $conn->prepare("SELECT * FROM partners WHERE id=?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $partner = $stmt2->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "profile" => array_merge($user, $partner ?: [])
    ]);
    exit;
}

/* ====================== CREATE / UPDATE PROFILE ====================== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = $_POST['id'] ?? null;
    if (!$id) {
        echo json_encode(["success" => false, "message" => "ID missing"]);
        exit;
    }

    $full_name = $_POST['full_name'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $city = $_POST['city'] ?? '';
    $bio = $_POST['bio'] ?? '';

    if (!$full_name || !$dob || !$phone || !$address || !$gender || !$city || !$bio) {
        echo json_encode(["success" => false, "message" => "Missing fields"]);
        exit;
    }

    /* ===== Uploads ===== */
    $uploadDir = __DIR__ . "/uploads/";
    if (!is_dir($uploadDir))
        mkdir($uploadDir, 0777, true);

    $profile_pic = null;
    if (!empty($_FILES['profile_pic']['name'])) {
        $profile_pic = time() . "_profile." . pathinfo($_FILES['profile_pic']['name'], PATHINFO_EXTENSION);
        move_uploaded_file($_FILES['profile_pic']['tmp_name'], $uploadDir . $profile_pic);
    }

    $aadhar_pic = null;
    if (!empty($_FILES['aadhar_pic']['name'])) {
        $aadhar_pic = time() . "_aadhar." . pathinfo($_FILES['aadhar_pic']['name'], PATHINFO_EXTENSION);
        move_uploaded_file($_FILES['aadhar_pic']['tmp_name'], $uploadDir . $aadhar_pic);
    }

    /* ===== Update users ===== */
    $stmt = $conn->prepare("
        UPDATE users SET
            full_name=?, dob=?, phone=?, address=?, gender=?, city=?, bio=?,
            profile_pic=IFNULL(?, profile_pic),
            aadhar_pic=IFNULL(?, aadhar_pic)
        WHERE id=?
    ");

    $stmt->bind_param(
        "sssssssssi",
        $full_name,
        $dob,
        $phone,
        $address,
        $gender,
        $city,
        $bio,
        $profile_pic,
        $aadhar_pic,
        $id
    );
    $stmt->execute();

    /* ===== Walker (partners) ===== */
    if (isset($_POST['experience'])) {

        $experience = $_POST['experience'];
        $walking_speed = $_POST['walking_speed'];
        $preferred_time = $_POST['preferred_time'];
        $price_per_hour = $_POST['price_per_hour'];

        // check exists
        $check = $conn->prepare("SELECT id FROM partners WHERE id=?");
        $check->bind_param("i", $id);
        $check->execute();

        if ($check->get_result()->num_rows > 0) {
            // update
            $stmtP = $conn->prepare("
                UPDATE partners
                SET experience=?, walking_speed=?, preferred_time=?, price_per_hour=?
                WHERE id=?
            ");
            $stmtP->bind_param("dssdi", $experience, $walking_speed, $preferred_time, $price_per_hour, $id);
        } else {
            // insert
            $stmtP = $conn->prepare("
                INSERT INTO partners (id, experience, walking_speed, preferred_time, price_per_hour)
                VALUES (?,?,?,?,?)
            ");
            $stmtP->bind_param("idssd", $id, $experience, $walking_speed, $preferred_time, $price_per_hour);
        }
        $stmtP->execute();
    }

    /* ===== Return profile ===== */
    $stmt = $conn->prepare("SELECT * FROM users WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT * FROM partners WHERE id=?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $partner = $stmt2->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "message" => "Profile updated",
        "profile" => array_merge($user, $partner ?: [])
    ]);
    exit;
}
