<?php
@session_name("NorthsideChristianSoftballLeague");
@session_start();
include('tempDb.php');
$sessId = session_id();
$dbName = "ncsl_$sessId";
if(!isset($_SESSION['dbCreated'])) {
    // Create temporary database for this session
    createTempDb($dbName);
    $_SESSION['dbCreated'] = true;
}
$knoxyConn = mysqli_connect('localhost', 'ncsldemo', 'ncsl052723', $dbName);
if(!$knoxyConn) {
    $error = mysqli_connect_errno();
    if($error == 1049) {
        // Session database was purged, so re-create it
        createTempDb($dbName);
        $knoxyConn = retryDb($dbName);
    } else {
        echo 'db: '.$error;
    }
}
?>