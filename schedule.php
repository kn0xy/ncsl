<?php
$pageTitle = "Schedule";

if(isset($_GET['data'])) {
    include('db.php');
    $scheduleData = array("games"=>array(), "teams"=>array(), "locations"=>array());
    $loadLocsQuery = mysqli_query($knoxyConn, "SELECT * FROM locations") or die(mysqli_error($knoxyConn));
    while($loc = mysqli_fetch_assoc($loadLocsQuery)) array_push($scheduleData['locations'], $loc);
    $scheduleTeams = array("A"=>array(), "B"=>array(), "C"=>array());
    $loadGamesQuery = mysqli_query($knoxyConn, "SELECT * FROM games ORDER BY gamedate") or die(mysqli_error($knoxyConn));
    while($dbGames = mysqli_fetch_assoc($loadGamesQuery)) {
        if(strtotime($dbGames['gamedate']) >= strtotime('-1 day')) {
            $dbDivision = $dbGames['division'];
            $dbTeam1 = $dbGames['team1'];
            $dbTeam2 = $dbGames['team2'];
            if(array_search($dbTeam1, $scheduleTeams[$dbDivision]) === false) array_push($scheduleTeams[$dbDivision], $dbTeam1);
            if(array_search($dbTeam2, $scheduleTeams[$dbDivision]) === false) array_push($scheduleTeams[$dbDivision], $dbTeam2);
            $dbGames['type'] = "game";
            array_push($scheduleData['games'], $dbGames);
        }
    }
    $scheduleData['teams'] = $scheduleTeams;
    echo json_encode($scheduleData);
    exit();
    
} else {
    
    include('header.php');
    if(!$ajaxNavRequest) {
    ?>
        <!-- Main -->
        <div id="mainContentWrapper">
    <?php }?>
          <div id="main" class="<?php echo $pageTitle;?>"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
              <div class="container" id="scheduleContent-main">
                <div class="row">
                    <div id="content" class="4u">
                        <section>
                            <header>
                                <h2>Schedule</h2>
                                <span class="byline" id="scheduleDisplay">All Divisions</span>
                            </header>


                            <div id="scheduleFilter" style="display:none">
                                <div class="scheduleFilterHeader">
                                    <span>Filter</span>
                                    <span id="btnScheduleFilterToggle"></span>
                                    
                                </div>

                                <p>Division: &nbsp; 
                                    <select id="scheduleFilter-division" class="scheduleFilterOption">
                                        <option value="all">All</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </p>
                                <p>Team: &nbsp; 
                                    <select id="scheduleFilter-team" class="scheduleFilterOption">
                                        <option value="all">All</option>
                                    </select>
                                </p>
                                <p>Day: &nbsp; 
                                    <select id="scheduleFilter-day" class="scheduleFilterOption">
                                        <option value="all">Any</option>
                                    </select>
                                </p>
                                <p>Location: &nbsp; 
                                    <select id="scheduleFilter-loc" class="scheduleFilterOption">
                                        <option value="all">Any</option>
                                    </select>
                                </p>
                                <?php if($loggedIn && $userRank != 'Admin') {
                                    // Get user team
                                    include('db.php');
                                    $getTeam = mysqli_query($knoxyConn, "SELECT team FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
                                    $teamResult = mysqli_fetch_assoc($getTeam);
                                    $userTeamId = $teamResult['team'];
                                    $getTeamName = mysqli_query($knoxyConn, "SELECT teamname FROM teams WHERE id=$userTeamId") or die(mysqli_error($knoxyConn));
                                    $gtnResult = mysqli_fetch_assoc($getTeamName);
                                    $userTeamName = $gtnResult['teamname'];
                                    echo '<input type="hidden" id="myTeamName" value="'.$userTeamName.'">';
                                }?>
                            </div>
                        </section>
                    </div>
                    <div class="8u">
                        <div id="scheduleStatus">
                            <span>Loading...</span>
                            <div class="loader"></div>
                        </div>
                        <div id="scheduleTable" style="display:none">
                            <div class="scheduleTableHeading">
                                <div class="scheduleTableHead" id="schedule-th-who">Game</div>
                                <div class="scheduleTableHead" id="schedule-th-when">When</div>
                                <div class="scheduleTableHead" id="schedule-th-where">Where</div>
                            </div>
                            <div id="scheduleTableBody"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" id="scheduleContent-info">
                <span class="scheduleBack"><i class="fa fa-arrow-left" aria-hidden="true"></i> Back to Schedule</span>
                <div class="row">
                    <div class="gameInfo 6u">
                        <h2>Game 1</h2>
                        <p id="scheduleInfo-game1-when"></p>
                        <p id="scheduleInfo-game1-teams"></p>
                        <hr>
                        <h2>Game 2</h2>
                        <p id="scheduleInfo-game2-when"></p>
                        <p id="scheduleInfo-game2-teams"></p>
                    </div>
                    <div class="gameInfo 6u">
                        <h2>Location</h2>
                        <div id="scheduleMapWrap">
                            <div id="scheduleMap"></div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
          </div>
    <?php if(!$ajaxNavRequest) echo "    </div>\n";
    include('footer.php');   
}
?>