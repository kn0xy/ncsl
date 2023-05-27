<?php
session_name("NorthsideChristianSoftballLeague");
@session_start();

$ncslBaseUrl = "https://www.knoxy.tk/portfolio/ncsl/";

// Check if logged in
$loggedIn = false;
if(isset($_SESSION['loggedIn'])) {
    $loggedIn = true;
    $userId = $_SESSION['userId'];
    $userRank = $_SESSION['userRank'];
    $userWaiver = $_SESSION['userWaiver'];
    if(isset($_GET['waiver'])) $pageTitle = 'Waiver';
    if($userRank=='Player') {
        if($userWaiver==0 && !isset($_GET['waiver']) && !isset($_GET['signWaiver'])) {
            header('Location: ?waiver');
        }
    } elseif($userRank=='Coach') {
        if($userWaiver != 3 && !isset($_GET['waiver']) && !isset($_GET['signWaiver'])) {
            header('Location: ?waiver');
        }
    }
}
$homeWord = (($loggedIn) ? "News" : "Home");
$ajaxNavRequest = ((isset($_GET['ajax'])) ? true : false);
if(!$pageTitle && $loggedIn || $ajaxNavRequest) {
    // don't show two headers
} else {
?>
<!DOCTYPE HTML>
<html>
<head>
    <title>Northside Christian Softball League<?php if($pageTitle) echo ' - '.$pageTitle;?></title>
    <meta https-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="" />
    <meta name="keywords" content="northside christian softball league" />
    <link href='https://fonts.googleapis.com/css?family=Arimo:400,700' rel='stylesheet' type='text/css'>
    <link rel="icon" type="image/x-icon" href="images/softball.png">
    <!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
    <script>var ncslLuv = '051019';</script>
    <script src="<?php echo $ncslBaseUrl;?>js/jquery-1.11.0.min.js"></script>
    <script src="<?php echo $ncslBaseUrl;?>js/skel.min.js"></script>
    <script src="<?php echo $ncslBaseUrl;?>js/skel-panels.min.js"></script>
    <script src="<?php echo $ncslBaseUrl;?>js/init.js"></script>
    <script src="<?php echo $ncslBaseUrl;?>js/ncsl.js?v=051019"></script>
    <noscript>
    <link rel="stylesheet" href="<?php echo $ncslBaseUrl;?>css/skel-noscript.css" />
    <link rel="stylesheet" href="<?php echo $ncslBaseUrl;?>css/style.css" />
    <link rel="stylesheet" href="<?php echo $ncslBaseUrl;?>css/style-desktop.css" />
    </noscript>
    <!--[if lte IE 8]><link rel="stylesheet" href="<?php echo $ncslBaseUrl;?>css/ie/v8.css" /><![endif]-->
    <!--[if lte IE 9]><link rel="stylesheet" href="<?php echo $ncslBaseUrl;?>css/ie/v9.css" /><![endif]-->
</head>
<body class="homepage">

    <!-- Header -->
    <div id="header">
        <div class="container"> 

            <!-- Logo -->
            <div id="logo">
                <h1><a href="#">Northside Christian</a></h1>
                <span>Softball League</span>
            </div>

            <!-- Nav -->
            <nav id="nav">
                <ul>
                    <li <?php if(!$pageTitle || $pageTitle=='News') echo 'class="active"';?>><a href="<?php echo $ncslBaseUrl;?>"><?php echo $homeWord;?></a></li>
                    <li <?php if($pageTitle=='Schedule') echo 'class="active"';?>><a href="<?php echo $ncslBaseUrl;?>schedule">Schedule</a></li>
                    <li <?php if($pageTitle=='Standings') echo 'class="active"';?>><a href="<?php echo $ncslBaseUrl;?>standings">Standings</a></li>
                    <li <?php if($pageTitle=='Info') echo 'class="active"';?>><a href="<?php echo $ncslBaseUrl;?>info">Info</a></li>
                    <?php 
                    if($loggedIn) {
                        if($pageTitle=='Account' || $pageTitle=='Waiver') {
                            echo '<li class="active"><a title="My Account" href="account"><i id="userButton" class="fa fa-user" aria-hidden="true"></i></a></li>';
                        } else {
                            echo '<li><a title="My Account" href="account"><i id="userButton" class="fa fa-user" aria-hidden="true"></i></a></li>';
                        }
                    }?>
                </ul>
                <script>if(isMobile) $('#userButton').parent().html('My Account');</script>
            </nav>
        </div>
    </div>
<?php }

if((isset($_GET['waiver']) && $loggedIn) || isset($_GET['signWaiver'])) include('waiver.php');
?>
