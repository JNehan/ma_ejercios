<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ma_prueba_db";

$response = array("success" => false);

function sanitize_data($data)
{
    return htmlspecialchars(strip_tags(trim($data)));
}

try {

    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    $nombre = sanitize_data(filter_var($data['nombreVal'], FILTER_UNSAFE_RAW));
    $apellido = sanitize_data(filter_var($data['apellidoVal'], FILTER_UNSAFE_RAW));
    $correo = sanitize_data(filter_var($data['correoVal'], FILTER_SANITIZE_EMAIL));

    if (empty($nombre) || empty($apellido) || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO ma_contact (ma_contact_name, ma_contact_lastname, ma_contact_email) VALUES (:nombre, :apellido, :correo)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':correo', $correo);

    if ($stmt->execute()) {
        $response["success"] = true;
    }

    echo json_encode($response);
} catch (PDOException $e) {
    $response["error"] = $e->getMessage();
    echo json_encode($response);
}

$conn = null;
exit;
