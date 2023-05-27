<?php

// Create temporary database for this session
function createTempDb($dbName) {

    // Connect as root so we can grant all privleges to the ncsldemo user
    $cdbc = mysqli_connect('localhost', 'root', 'your_root_pw');
    $templine = '';

    // Read SQL file into a new array
    $lines = file('db.sql');
    
    // Loop through each line
    foreach ($lines as $line) {
        // Skip it if it's a comment
        if (substr($line, 0, 2) == '--' || $line == '') {
            continue;
        }

        // Replace $dbName with variable name    
        if(strpos($line, '$dbName')) {
            $line = str_replace('$dbName', $dbName, $line);
        }

        // Add this line to the current segment
        $templine .= $line;

        // Semicolon at the end of a line indicates end of query
        if (substr(trim($line), -1, 1) == ';') {
            $exeq = mysqli_query($cdbc, $templine);
            if(!$exeq) return false;
            $templine = '';
        }
    }    
    mysqli_close($cdbc);
    return true;
}

function retryDb($dbName) {
    $dbConnection = mysqli_connect('localhost', 'ncsldemo', 'ncsl052723', $dbName) or die('db failed: '.mysqli_connect_errno());
    return $dbConnection;
}
?>