<?php
/* Clean up temporary databases
(this script is called by a cron job once an hour)
*/

$cleaned = 0;
$dbsToClean = array();
$db = mysqli_connect('localhost', 'ncsldemo', 'ncsl052723') or die('cron_ncsl: db failed! '.mysqli_connect_errno());
mysqli_query($db, "USE ncsl");
$getDbs = mysqli_query($db, "SELECT id,name FROM dbs");
while($dbList = mysqli_fetch_assoc($getDbs)) {
    array_push($dbsToClean, $dbList);
}
for($i=0; $i<count($dbsToClean); $i++) {
    // delete the database
    $dbName = $dbsToClean[$i]['name'];
    mysqli_query($db, "DROP DATABASE `$dbName`");

    // remove from list
    $dbId = $dbsToClean[$i]['id'];
    mysqli_query($db, "DELETE FROM dbs WHERE id=$dbId");

    $cleaned++;
}
echo "cron_ncsl: cleaned up $cleaned temp databases\n";
exit();
?>