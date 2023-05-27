<?php
$pageTitle = "News";
include('header.php');
if($loggedIn) {
    $isAdmin = ($userRank=='Admin' ? true : false);
    if(!$isAdmin) {
        // Get the user's team ID
        include('db.php');
        $userId = $_SESSION['userId'];
        $getTeamId = mysqli_query($knoxyConn, "SELECT team FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
        $teamIdResult = mysqli_fetch_assoc($getTeamId);
        $teamId = $teamIdResult['team'];
        
        // Get team information
        $userTeamQuery = mysqli_query($knoxyConn, "SELECT teamname,division,tpimg,tpslogan FROM teams WHERE id=$teamId") or die(mysqli_error($knoxyConn));
        $userTeamResult = mysqli_fetch_assoc($userTeamQuery);
        $userTeam = $userTeamResult['teamname'];
        $userTeamImg = $userTeamResult['tpimg'];
        $userTeamSlogan = $userTeamResult['tpslogan'];
        $userTeamDiv = $userTeamResult['division'];
        if($userTeamImg=='') {
            $userTeamImg = '<div class="noImg">No image</div>';
        } else {
            $userTeamImg = '<p><img src="'.$userTeamResult['tpimg'].'" /><br><span style="font-style:italic">'.$userTeamSlogan.'</span></p>';
        }
        
        // Determine team rank
        $dtr = 0;
        $teamRank = 0;
        $teamPts = 0;
        $teamCrd = 0;
        $utrq = "SELECT teamname,points,crd FROM teams WHERE division='$userTeamDiv' ORDER BY points DESC, crd DESC";
        $userTeamRankQuery = mysqli_query($knoxyConn, $utrq) or die(mysqli_error($knoxyConn));
        while($utrRow = mysqli_fetch_assoc($userTeamRankQuery)) {
            $dtr++;
            if($utrRow['teamname'] == $userTeam) {
                $teamRank = $dtr;
                $teamPts = intval($utrRow['points']);
                $teamCrd = intval($utrRow['crd']);
            }
        }
        if($teamCrd > 0) $teamCrd = "+".$teamCrd;
        
        // Determine next game
        $userTeamNextGame = false;
        $dngCheck = date("Y-m-d");
        $dngq = mysqli_query($knoxyConn, "SELECT gamedate,team1,team2 FROM games WHERE team1='$userTeam' OR team2='$userTeam' AND gamedate >= '$dngCheck' LIMIT 1") or die(mysqli_error($knoxyConn));
        if(mysqli_num_rows($dngq) > 0) {
            $dngResult = mysqli_fetch_assoc($dngq);
            $checkDate = strtotime($dngResult['gamedate']);
            $todaysDate = strtotime(date("Y-m-d"));
            $dngDate = date("l m/d/y", $checkDate);
            if($checkDate == $todaysDate) $dngDate = '<strong>Today</strong>';
            if($dngResult['team1'] == $userTeam) {
                $dngOpponent = $dngResult['team2'];
            } else {
                $dngOpponent = $dngResult['team1'];
            }
            $userTeamNextGame = '<p>'.$dngDate.' &nbsp; vs. &nbsp; <strong>'.$dngOpponent.'</strong></p>';
        }
    }
    if(!$ajaxNavRequest) {
?>
    <!-- Main -->
    <div id="mainContentWrapper">
<?php }?>
      <div id="main" class="<?php echo $pageTitle;?>"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
        <div class="container">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="8u skel-cell-important">
                    <div id="contentWrapper">
                    <section>
                        <header>
                            <h2>News</h2>
                        </header>
                        <p>Future: Put league news and announcements here.</p>
                    </section>
                  </div>
                </div>

                <!-- Sidebar -->
                <div id="sidebar" class="4u">
                    <section>
                        <header>
                            <h2><?php echo (!$isAdmin ? 'My Team' : 'Manage');?></h2>
                            <span id="sidebarTeamName"><?php echo $userTeam;?></span>
                        </header>
                        <ul>
                            <li>
                                <?php if($isAdmin) {
                                    echo '<a href="#" onclick="event.preventDefault();">New Post</p>';
                                } else {
                                    if($userRank=='Coach') echo '<p><a href="admin">Manage Team</a></p>';
                                    echo $userTeamImg;
                                }?>
                            </li>
                            <li>
                                <?php if($isAdmin) {
                                    echo '<a href="admin">Admin Dashboard</a>';
                                } else {
                                    echo "<p><strong>Ranked #$teamRank in Division $userTeamDiv</strong><br>";
                                    echo "&nbsp; &nbsp; $teamPts points<br>&nbsp; &nbsp; $teamCrd Run Differential<br></p>";
                                }?>
                                
                            </li>
                            <li>
                                <?php if(!$isAdmin) {
                                    if($userTeamNextGame) {
                                        echo '<h3 style="margin-top:25px">Next Game</h3>';
                                        echo $userTeamNextGame;
                                    }  
                                }?>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
      </div>
    <?php if(!$ajaxNavRequest) echo '</div>'."\n";
} else {?>
    <!-- Main -->
  <div id="mainContentWrapper">
    <div id="main">
        <div class="container">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="8u skel-cell-important">
                    <div id="contentWrapper">
                    <section>
                        <header>
                            <h2>News</h2>
                        </header>
                        <p>Display all league and team news posts here.</p>
                    </section>
                  </div>
                </div>
            </div>
        </div>
    </div>
  </div>
<?php } 
include('footer.php');
?>