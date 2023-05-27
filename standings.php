<?php

if(isset($_GET['data'])) {
    include('db.php');
    $teamData = array();
    $getTeamData = mysqli_query($knoxyConn, "SELECT * FROM teams ORDER BY points DESC, crd DESC") or die(mysqli_error($knoxyConn));
    while($team = mysqli_fetch_assoc($getTeamData)) {
        array_push($teamData, $team);
    }
    echo json_encode($teamData);
    exit();
}

if(isset($_GET['gameHistory'])) {
    include('db.php');
    $teamName = trim($_POST['team']);
    $gameHistory = array();
    $gghQuery = "SELECT team1,gamedate,team2,score1_t1,score1_t2,score2_t1,score2_t2 FROM games WHERE team1='$teamName' OR team2='$teamName' AND ";
    $gghQuery .= "(score1_t1 > 0 OR score1_t2 > 0 OR score2_t1 > 0 OR score2_t2 > 0) ORDER BY gamedate DESC";
    $getGameHistory = mysqli_query($knoxyConn, $gghQuery) or die(mysqli_error($knoxyConn));
    while($gh = mysqli_fetch_assoc($getGameHistory)) {
        $s1t1 = intval($gh['score1_t1']);
        $s1t2 = intval($gh['score1_t2']);
        $s2t1 = intval($gh['score2_t1']);
        $s2t2 = intval($gh['score2_t2']);
        $myTeam = ($teamName==$gh['team1'] ? 1 : 2);
        $opponent = ($myTeam===1 ? 'team2' : 'team1');
        $oTeam = $gh[$opponent];
        $gamedate = date("m/d/y", strtotime($gh['gamedate']));
        $winLossTie = "null";
        if($s1t1 > 0 || $s1t2 > 0) {
            if($s1t1 > $s1t2) {
                // team 1 winner for match 1
                if($myTeam===1) {
                    $winLossTie = "W";
                } else {
                    $winLossTie = "L";
                }
            } elseif($s1t1 < $s1t2) {
                // team 2 winner for match 1
                if($myTeam===1) {
                    $winLossTie = "L";
                } else {
                    $winLossTie = "W";
                }
            } else {
                // match 1 tie
                $winLossTie = "Tie";
            }
            $hGame = array('date'=>$gamedate, 'opponent'=>$oTeam, 'result'=>$winLossTie);
            array_push($gameHistory, $hGame);
        }
        if($s2t1 > 0 || $s2t2 > 0) {
            if($s2t1 > $s2t2) {
                // team 1 winner for match 2
                if($myTeam===1) {
                    $winLossTie = "W";
                } else {
                    $winLossTie = "L";
                }
            } elseif($s2t1 < $s2t2) {
                // team 2 winner for match 2
                if($myTeam===1) {
                    $winLossTie = "L";
                } else {
                    $winLossTie = "W";
                }
            } else {
                // match 1 tie
                $winLossTie = "Tie";
            }
            $hGame = array('date'=>$gamedate, 'opponent'=>$oTeam, 'result'=>$winLossTie);
            array_push($gameHistory, $hGame);
        }
    }
    echo json_encode($gameHistory);
    exit();
}

$pageTitle = "Standings";
include('header.php');

if(!$ajaxNavRequest) {
?>
    <!-- Main -->
    <div id="mainContentWrapper">
<?php }?>
      <div id="main" class="<?php echo $pageTitle;?>"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
        <div class="container" id="standingsContent">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="12u skel-cell-important">
                    <section>
                        <header>
                            <span class="standingsBack"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back to Standings</span>
                            <h2>Standings</h2>
                            <span class="byline" id="standingsByline"></span>
                        </header>
                        <div class="loader" id="standingsLoading"></div>
                    </section>
                </div>
            </div>
            <div id="standingsRow" class="row">
                <div class="4u">
                    <h2>Division A</h2>
                    <ul id="teamList-A" class="standingsTeamList"></ul>
                </div>
                <div class="4u">
                    <h2>Division B</h2>
                    <ul id="teamList-B" class="standingsTeamList"></ul>
                </div>
                <div class="4u">
                    <h2>Division C</h2>
                    <ul id="teamList-C" class="standingsTeamList"></ul>
                </div>
            </div>
            <div id="teamPageWrapper" class="row">
                <div id="teamPageContent" class="8u">                  
                    <p>Coach-manageable team page content will go here...</p>
                    <br>                  
                </div>
                <div id="teamPageInfo" class="4u">
                    <div id="teamPageImageWrap">Team logo/image here</div>
                    <span id="teamPageSlogan">Team slogan or photo caption here</span>
                    <div id="teamHistoryWrap">
                        <h3>Game History</h3>
                        <div id="gameHistoryInner">
                            <div class="loader"></div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <span class="standingsBack"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back to Standings</span>
        </div>
      </div>
<?php if(!$ajaxNavRequest) echo "    </div>\n";
include('footer.php');
?>
