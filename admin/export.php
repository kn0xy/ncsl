<?php

include('../db.php');


$exportGames = array();
$games = mysqli_query($knoxyConn, "SELECT * FROM games") or die(mysqli_error($knoxyConn));
while($game = mysqli_fetch_assoc($games)) {
    array_push($exportGames, $game);
}
$dbGames = json_encode($exportGames);
mysqli_query($knoxyConn, "UPDATE seasons SET games='$dbGames' WHERE id=1") or die(mysqli_error($knoxyConn));

echo 'success';


?>