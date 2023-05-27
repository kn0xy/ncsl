<?php
session_name("NorthsideChristianSoftballLeague");
session_start();

include('db.php');


if(isset($_GET['login'])) {
    $loginUser = $_POST['username'];
    $loginPass = md5($_POST['password']);
    $checkCreds = mysqli_query($knoxyConn, "SELECT id,rank,haswaiver FROM users WHERE username='$loginUser' AND password='$loginPass'");
    if(mysqli_num_rows($checkCreds) > 0) {
        $_SESSION['loggedIn'] = true;
        $loginRank;
        while($loginUser = mysqli_fetch_assoc($checkCreds)) {
            $_SESSION['userId'] = $loginUser['id'];
            $_SESSION['userRank'] = $loginUser['rank'];
            $_SESSION['userWaiver'] = $loginUser['haswaiver'];
            $loginRank = $loginUser['rank'];
        }
        
        if($_SESSION['userRank']=='Player' && $_SESSION['userWaiver']==0) {
            echo 'waiver';
        } elseif($_SESSION['userRank']=='Coach' && $_SESSION['userWaiver']!=3) {
            echo 'waiver';
        } else {
            echo 'success::'.$loginRank;
        }
    } else {
        echo 'error';
    }
}


if(isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    echo 'success';
}

