<?php
// Database configuration
$host = "localhost";
$user = "root";          // change if different
$password = "";          // add password if set
$database = "walknconnect_db";


// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}

// Set charset (important for security & emojis)
$conn->set_charset("utf8mb4");
?>