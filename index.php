<?php
$pageTitle = false;
include('header.php');

if(!$loggedIn) {
    // Get next 3 upcoming games
    include('db.php');
    $upcomingGames = array();
    $today = date("Y-m-d");
    $gugQuery = mysqli_query($knoxyConn, "SELECT * FROM games WHERE gamedate >= '$today' ORDER BY gamedate LIMIT 3") or die(mysqli_error($knoxyConn));
    $gugCount = mysqli_num_rows($gugQuery);
    if($gugCount > 0) {
        while($ug = mysqli_fetch_assoc($gugQuery)) {
            array_push($upcomingGames, $ug);
        }
        // Fix times and field names
        for($g=0;$g<count($upcomingGames);$g++) {
            $am1pm = 'am';
            $am2pm = 'am';
            $g1time = explode(':', $upcomingGames[$g]['game1']);
            $g2time = explode(':', $upcomingGames[$g]['game2']);
            $g1hour = intval($g1time[0]);
            $g2hour = intval($g2time[0]);
            if($g1hour >= 12) $am1pm = 'pm';
            if($g1hour > 12) $g1hour -= 12;
            if($g2hour >= 12) $am2pm = 'pm';
            if($g2hour > 12) $g2hour -= 12;
            $game1 = $g1hour.':'.$g1time[1].$am1pm;
            $game2 = $g2hour.':'.$g2time[1].$am2pm;
            $upcomingGames[$g]['game1'] = $game1;
            $upcomingGames[$g]['game2'] = $game2;
            $gameField = $upcomingGames[$g]['field'];
            $getFieldName = mysqli_query($knoxyConn, "SELECT notes FROM locations WHERE name='$gameField'") or die(mysqli_error($knoxyConn));
            $gfnResult = mysqli_fetch_assoc($getFieldName);
            $fieldName = $gfnResult['notes'];
            $upcomingGames[$g]['field'] = $fieldName;
        }
    }
    
    // Get home page blurb
    $hbq = mysqli_query($knoxyConn, "SELECT content FROM pages WHERE parent='home'") or die(mysqli_error($knoxyConn));
    $hbr = mysqli_fetch_assoc($hbq);
    $homeBlurb = $hbr['content'];
    
    if(!$ajaxNavRequest) {
?>
    <!-- Main -->
    <div id="mainContentWrapper">
<?php }?>
      <div id="main"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
        <div class="container">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="8u skel-cell-important">
                    <div id="contentWrapper">
                    <section>
                        <header>
                            <h2>Welcome</h2>
                        </header>
                        <?php echo $homeBlurb;?>
                        <br>
                        <p><strong>If you are a player or coach, log in below:</strong></p>
                        <form id="loginForm" onsubmit="loginSubmit(event)">
                        <p>
                            <label for="username">Username: </label>
                            <input type="text" id="username" name="username">
                        </p>
                        <p>
                            <label for="password">Password: </label>
                            <input type="password" id="password" name="password">
                        </p>
                        <p><button type="submit" id="btnloginSubmit"><i class="fa fa-sign-in"></i>&nbsp; Login</button></p>
                        </form>
                    </section>
                  </div>
                </div>

                <!-- Sidebar -->
                <div id="sidebar" class="4u">
                    <section>
                        <header>
                            <h2>Upcoming Games</h2>
                        </header>
                        <?php if(count($upcomingGames) > 0) {?>
                        <ul class="style">
                            <li>
                                <div class="calendar">
                                    <p class="month"><?php echo date("F", strtotime($upcomingGames[0]['gamedate']));?></p>
                                    <p class="date"><?php echo date("j", strtotime($upcomingGames[0]['gamedate']));?></p>
                                </div>
                                <p class="title"><?php echo $upcomingGames[0]['team1'].' vs. '.$upcomingGames[0]['team2'];?></p>
                                <p class="location"><?php echo $upcomingGames[0]['field'];?></p>
                                <p class="text"><?php echo $upcomingGames[0]['game1'].' &nbsp; &amp; &nbsp; '.$upcomingGames[0]['game2'];?></p>
                            </li>
                            <?php if(count($upcomingGames) > 1) {?>
                            <li>
                                <div class="calendar">
                                    <p class="month"><?php echo date("F", strtotime($upcomingGames[1]['gamedate']));?></p>
                                    <p class="date"><?php echo date("j", strtotime($upcomingGames[1]['gamedate']));?></p>
                                </div>
                                <p class="title"><?php echo $upcomingGames[1]['team1'].' vs. '.$upcomingGames[1]['team2'];?></p>
                                <p class="location"><?php echo $upcomingGames[1]['field'];?></p>
                                <p class="text"><?php echo $upcomingGames[1]['game1'].' &nbsp; &amp; &nbsp; '.$upcomingGames[1]['game2'];?></p>
                            </li>
                            <?php }
                            if(count($upcomingGames) > 2) {?>
                            <li>
                                <div class="calendar">
                                    <p class="month"><?php echo date("F", strtotime($upcomingGames[2]['gamedate']));?></p>
                                    <p class="date"><?php echo date("j", strtotime($upcomingGames[2]['gamedate']));?></p>
                                </div>
                                <p class="title"><?php echo $upcomingGames[2]['team1'].' vs. '.$upcomingGames[2]['team2'];?></p>
                                <p class="location"><?php echo $upcomingGames[2]['field'];?></p>
                                <p class="text"><?php echo $upcomingGames[2]['game1'].' &nbsp; &amp; &nbsp; '.$upcomingGames[2]['game2'];?></p>
                            </li>
                            <?php }?>
                        </ul>
                        <?php } else {
                            echo '<p>No upcoming games in the foreseeable future.</p>';
                        }
                        ?>
                    </section>
                </div>
            </div>
        </div>
      </div>
<?php if(!$ajaxNavRequest) echo '    </div>'."\n";
} else {
    include('news.php');
    exit();
}
include('footer.php');
?>


