<?php
include('../db.php');


function loadSchedule($userData) {
    global $knoxyConn;
    $userIsAdmin = (($userData['me']['rank']=='Admin') ? true : false);
    
    // Load each game from database
    $loadGamesQuery = "SELECT * FROM games";
    if(!$userIsAdmin) {
        $userTeam = $userData['team']['teamname'];
        $loadGamesQuery .= " WHERE team1='$userTeam' OR team2='$userTeam'";
    }
    $loadGamesQuery .= " ORDER BY gamedate";
    $loadGames = mysqli_query($knoxyConn, $loadGamesQuery) or die(mysqli_error($knoxyConn));
    
    // Display 2 rows for each game entry (game 1 and game 2)
    $gamesLoaded = 0;
    while($game = mysqli_fetch_array($loadGames)) {
        $realGameId = $game['id'];
        $gameId = (($userIsAdmin) ? intval($game['id']) : $gamesLoaded);
        $gameDate1 = $game['gameday'].', '.date("m/d/y", strtotime($game['gamedate'])).' @ '.date("g:ia", strtotime($game['game1']));
        $gameDate2 = $game['gameday'].', '.date("m/d/y", strtotime($game['gamedate'])).' @ '.date("g:ia", strtotime($game['game2']));
        $rowClass = (($gameId % 2 == 0) ? 'even' : 'odd');
        if($userIsAdmin) $rowClass.= ' adminEditable';
        $gd1check = strtotime(date("m/d/y", strtotime($game['gamedate'])).' '.date("g:ia", strtotime($game['game1'])));
        $gd2check = strtotime(date("m/d/y", strtotime($game['gamedate'])).' '.date("g:ia", strtotime($game['game2'])));
        $gd1passed = ($gd1check <= strtotime("now") ? true : false);
        $gd2passed = ($gd2check <= strtotime("now") ? true : false);
        $g1score = ($gd1passed ? '<span class="postScore">Post</span>' : 'TBD');
        $g2score = ($gd2passed ? '<span class="postScore">Post</span>' : 'TBD');
        if(intval($game['score1_t1']) != 0 || intval($game['score1_t2'] != 0)) {
            $g1score = $game['score1_t1'].'-'.$game['score1_t2'];
        }
        if(intval($game['score2_t1']) != 0 || intval($game['score2_t2'] != 0)) {
            $g2score = $game['score2_t2'].'-'.$game['score2_t1'];
        }
        
        echo '<tr class="'.$rowClass.'" id="game-'.$realGameId.'-1">';
        if($userIsAdmin) echo '<td class="scheduleRow-division">'.$game['division'].'</td>';                  // Division    (Admin only)
        echo '<td class="scheduleRow-who">'.$game['team1'].' &nbsp; vs. &nbsp; '.$game['team2'].'</td>'; // Who         <Team 1> (home)  vs.  <Team 2> (away)
        echo '<td class="scheduleRow-when">'.$gameDate1.'</td>';                                         // When         
        echo '<td class="scheduleRow-where">'.$game['field'].'</td>';                                    // Where
        echo '<td class="scheduleRow-score">'.$g1score.'</td>';                                                   // Score
        echo '<input type="hidden" class="gametime" value="'.date("H:i",strtotime($game['game1'])).'">';
        echo '<input type="hidden" class="gamedate" value="'.date("Y-m-d", strtotime($game['gamedate'])).'">';
        echo '</tr>';

        echo '<tr class="'.$rowClass.'" id="game-'.$realGameId.'-2">';
        if($userIsAdmin) echo '<td class="scheduleRow-division">'.$game['division'].'</td>';                  // Division    (Admin only)
        echo '<td class="scheduleRow-who">'.$game['team2'].' &nbsp; vs. &nbsp; '.$game['team1'].'</td>'; // Who         <Team 2> (home)  vs.  <Team 1> (away)
        echo '<td class="scheduleRow-when">'.$gameDate2.'</td>';                                         // When         
        echo '<td class="scheduleRow-where">'.$game['field'].'</td>';                                    // Where
        echo '<td class="scheduleRow-score">'.$g2score.'</td>';                                                   // Score
        echo '<input type="hidden" class="gametime" value="'.date("H:i",strtotime($game['game2'])).'">';
        echo '<input type="hidden" class="gamedate" value="'.date("Y-m-d", strtotime($game['gamedate'])).'">';
        echo '</tr>';
        
        $gamesLoaded++;
    }
}


function getUserData($getUserId) {
    global $knoxyConn;
    $getUserDataQuery = mysqli_query($knoxyConn, "SELECT * FROM users WHERE id=$getUserId") or die(mysqli_error($knoxyConn));
    $rUserData = mysqli_fetch_assoc($getUserDataQuery);
    $rUserTeam = $rUserData['team'];
    $getUserTeamQuery = mysqli_query($knoxyConn, "SELECT * FROM teams WHERE id=$rUserTeam") or die(mysqli_error($knoxyConn));
    $rUserTeamData = mysqli_fetch_assoc($getUserTeamQuery);
    $allUserData = array("me"=>$rUserData, "team"=>$rUserTeamData);
    return $allUserData;
}


function getLocations() {
    global $knoxyConn;
    $locQuery = mysqli_query($knoxyConn, "SELECT * FROM locations") or die(mysqli_error($knoxyConn));
    while($location = mysqli_fetch_assoc($locQuery)) {
        echo '<div class="locationsTableRow" id="location-'.$location['id'].'">';
        echo '<div class="locationsTableCell">'.$location['name'].'</div>';
        echo '<div class="locationsTableCell">'.$location['address'].'</div>';
        echo '<div class="locationsTableCell">'.$location['notes'].'</div>';
        echo '<input type="hidden" class="locRowLatLng" value="'.$location['lat'].','.$location['lng'].'">';
        echo '</div>';
    }
}


function saveLocation($jsonLocData, $update) {
    global $knoxyConn;
    $locData = json_decode($jsonLocData);
    $locName = $locData->name;
    $locNotes = $locData->notes;
    $locAddr = $locData->address;
    $locLat = $locData->lat;
    $locLng = $locData->lng;
    $locSaveQuery = "INSERT INTO locations (name,notes,address,lat,lng) VALUES ('$locName', '$locNotes', '$locAddr', $locLat, $locLng)";
    if($update && $update != 'false') {
        $locSaveQuery = "UPDATE locations SET name='$locName', notes='$locNotes', address='$locAddr', lat=$locLat, lng=$locLng WHERE id=$update";
    }
    
    mysqli_query($knoxyConn, $locSaveQuery) or die(mysqli_error($knoxyConn));
    echo 'success';
}


function removeLocation($location) {
    global $knoxyConn;
    mysqli_query($knoxyConn, "DELETE FROM locations WHERE id=$location") or die(mysqli_error($knoxyConn));
    echo 'success';
}


function getSeasonStats() {
    global $knoxyConn;
    $getSeasonStart = mysqli_query($knoxyConn, "SELECT start,end,games FROM seasons ORDER BY id DESC LIMIT 1");
    $gssResult = mysqli_fetch_assoc($getSeasonStart);
    $seasonStart = date("m/d/Y", strtotime($gssResult['start']));
    $seasonEnd = ($gssResult['end']=='0001-01-01' ? 'Present' : date("m/d/Y", strtotime($gssResult['end'])));
    $numGames = 0;
    $gamesPlayed = 0;
    echo "<p style=\"font-size:1.25em\"><strong>Current Season:</strong></p>";
    if($seasonEnd=='Present') {
        $getNumGames = mysqli_query($knoxyConn, "SELECT gamedate FROM games") or die(mysqli_error($knoxyConn));
        $numGames = mysqli_num_rows($getNumGames) * 2;
        $gamesPlayed = 0;
        while($game = mysqli_fetch_assoc($getNumGames)) {
            if(strtotime($game['gamedate']) <= strtotime('now')) $gamesPlayed+=2;
        }
        echo "<p>$seasonStart to $seasonEnd</p>";
        echo '<p style="margin-top:10px"><strong>Total Games:</strong> &nbsp; <span id="season-numGames">'.$numGames.'</span></p>';
        echo '<p><strong>Games Played:</strong> &nbsp; <span id="season-gamesPlayed">'.$gamesPlayed.'</span></p>';
        echo '<p style="margin-top: 20px;">';
        echo '<button type="button" class="button" id="scheduleBtn-endSeason"'.($gamesPlayed < $numGames ? ' disabled' : '').'>';
        echo '<i class="icon fa-trophy"></i><br>End Season</button></p>';                                        
    } else {
        echo '<p>No active season!</p><br><br>';
        echo '<button type="button" class="button scheduleNav" id="seasonBtn-import"><i class="icon fa-download"></i><br>Import Schedule</button>';
    }
    
}


function getPastSeasons() {
    global $knoxyConn;
    $getSeasons = mysqli_query($knoxyConn, "SELECT id,start,end FROM seasons ORDER BY id DESC") or die(mysqli_error($knoxyConn));
    if(mysqli_num_rows($getSeasons) > 0) {
        while($season = mysqli_fetch_assoc($getSeasons)) {
            if($season['end'] != '0001-01-01') {
                echo '<p class="pastSeason">';
                echo date("m/d/y", strtotime($season['start'])).' - '.date("m/d/y", strtotime($season['end'])).' &nbsp; &nbsp; ';
                echo '<button type="button" id="season-'.$season['id'].'" class="exportBtn"><i class="icon fa-cloud-download"></i></button></p>';
            }
        }
    } else {
        echo '<p style="font-style:italic">No past seasons to display</p>';
    }
}


function endSeason() {
    global $knoxyConn;
    
    // Get season ID
    $getSeasonId = mysqli_query($knoxyConn, "SELECT id FROM seasons ORDER BY id DESC LIMIT 1");
    $gsidResult = mysqli_fetch_assoc($getSeasonId);
    $seasonId = $gsidResult['id'];
    $endDate = date("Y-m-d");
    
    // Archive games
    $exportGames = array();
    $games = mysqli_query($knoxyConn, "SELECT * FROM games") or die(mysqli_error($knoxyConn));
    while($game = mysqli_fetch_assoc($games)) {
        array_push($exportGames, $game);
    }
    $dbGames = addslashes(json_encode($exportGames));
    
    // Archive teams
    $exportTeams = array();
    $teams = mysqli_query($knoxyConn, "SELECT * FROM teams") or die(mysqli_error($knoxyConn));
    while($team = mysqli_fetch_assoc($teams)) {
        array_push($exportTeams, $team);
    }
    $dbTeams = addslashes(json_encode($exportTeams));
    mysqli_query($knoxyConn, "UPDATE seasons SET end='$endDate', games='$dbGames', teams='$dbTeams' WHERE id=$seasonId") or die(mysqli_error($knoxyConn));
    
    // Reset schedule, standings, and waivers
    mysqli_query($knoxyConn, "TRUNCATE TABLE games") or die(mysqli_error($knoxyConn));
    mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0") or die(mysqli_error($knoxyConn));
    mysqli_query($knoxyConn, "UPDATE users SET haswaiver=0") or die(mysqli_error($knoxyConn));
    
    echo 'success';
}


function usernameExists($userName) {
    global $knoxyConn;
    $checkExists = mysqli_query($knoxyConn, "SELECT id FROM users WHERE username='$userName'");
    if(mysqli_num_rows($checkExists) > 0) {
        return true;
    } else {
        return false;
    }
}


function addUser($jsonUserData, $userId) {
    global $knoxyConn;
    $adminInfo = getUserData($userId);
    $isCoach = ($adminInfo['me']['rank']=='Coach' ? true : false);
    $addUserData = json_decode($jsonUserData);
    $addUserType = $addUserData->Type;
    $addUserUpdate = addslashes(trim($addUserData->update));
    $addUserFname = addslashes(trim($addUserData->Fname));
    $addUserLname = addslashes(trim($addUserData->Lname));
    $addUserNname = addslashes(trim($addUserData->Nname));
    $addUserPrefer = ($addUserData->NamePrefer==false ? 0 : 1);
    $addUserEmail = addslashes(trim($addUserData->email));
    $addUserPhone = trim($addUserData->phone);
    $addUsername = addslashes(trim($addUserData->username));
    $addPassword = md5($addUserData->password);
    $addUserWaiver = 0;
    $addUserTeam = 0;
    $addUserPos = '[]';
    if($addUserType == 'Player') {
        $addUserWaiver = $addUserData->playerWaiver;
        if(!$addUserWaiver) $addUserWaiver = 0;
        $addUserTeam = ($isCoach ? $adminInfo['me']['team'] : $addUserData->playerTeam);
        $addUserPos = json_encode($addUserData->positions);
    } elseif($addUserType == 'Coach') {
        $coachWaiver = ($addUserData->coachWaiver==false ? 0 : 1);
        $cpWaiver = ($addUserData->cpWaiver==false ? 0 : 2);
        $addUserWaiver = $coachWaiver + $cpWaiver;
        $addUserTeam = $addUserData->coachTeam;
    }
    if($addUserUpdate == 'true') {

        $updateId = intval($addUserData->userId);
        $updateUserQuery = "UPDATE users SET username='$addUsername', ".($addUserData->password=='' ? '' : "password='$addPassword', ");
        $updateUserQuery .= "email='$addUserEmail', phone='$addUserPhone', rank='$addUserType', team=$addUserTeam, nickname='$addUserNname', ";
        $updateUserQuery .= "fname='$addUserFname', lname='$addUserLname', prefernick=$addUserPrefer, haswaiver=$addUserWaiver, teamposition='$addUserPos'";
        $updateUserQuery .= " WHERE id=$updateId";
        mysqli_query($knoxyConn, $updateUserQuery) or die(mysqli_error($knoxyConn));
        echo 'success';

        exit();
    }
    if(!usernameExists($addUsername)) { 
        $addUserQuery = "INSERT INTO users (username,password,email,phone,rank,team,nickname,fname,lname,prefernick,haswaiver,teamposition) VALUES ";
        $addUserQuery .= "('$addUsername', '$addPassword', '$addUserEmail', '$addUserPhone', '$addUserType', $addUserTeam, '$addUserNname', '$addUserFname', ";
        $addUserQuery .= "'$addUserLname', $addUserPrefer, $addUserWaiver, '$addUserPos')";
        mysqli_query($knoxyConn, $addUserQuery) or die(mysqli_error($knoxyConn)); 
        if($addUserType == 'Coach') {
            $updateTeamCoachId = mysqli_insert_id($knoxyConn);
            $getCurrentCoaches = mysqli_query($knoxyConn, "SELECT coach FROM teams WHERE id=$addUserTeam") or die(mysqli_error($knoxyConn));
            $gccResult = mysqli_fetch_array($getCurrentCoaches);
            $currentCoaches = json_decode($gccResult['coach']);
            array_push($currentCoaches, $updateTeamCoachId);
            $teamCoach = json_encode($currentCoaches);
            mysqli_query($knoxyConn, "UPDATE teams SET coach='$teamCoach' WHERE id=$addUserTeam") or die(mysqli_error($knoxyConn));
        }
        echo 'success';
    } else {
        echo '!username';
    }
}



function removeUser($rid, $userId) {
    global $knoxyConn;
    
// ***
    // TO DO:
    //  - Add security by validating the user making the call to this function has permissions to remove the specified user
    // ***
    
    
    $griq = mysqli_query($knoxyConn, "SELECT rank,team FROM users WHERE id=$rid") or die(mysqli_error($knoxyConn));
    $rInfo = mysqli_fetch_assoc($griq);
    if($rInfo['rank']=='Coach') {
        // remove this userid from the team's coach array
        $coachTeam = $rInfo['team'];
        $getTeamCoaches = mysqli_query($knoxyConn, "SELECT coach FROM teams WHERE id=$coachTeam") or die(mysqli_error($knoxyConn));
        $gtcResult = mysqli_fetch_array($getTeamCoaches);
        $teamCoaches = json_decode($gtcResult['coach']);
        $rcId = array_search($rid, $teamCoaches);
        if($rcId !== false) {
            array_splice($teamCoaches, $rcId, 1);
            $newCoaches = json_encode($teamCoaches);
            mysqli_query($knoxyConn, "UPDATE teams SET coach='$newCoaches' WHERE id=$coachTeam") or die(mysqli_error($knoxyConn));
        } else {
            echo 'failed to remove coach from team array';
            exit();
        }
    }
    mysqli_query($knoxyConn, "DELETE FROM users WHERE id=$rid") or die(mysqli_error($knoxyConn));
    echo 'success';
}



function loadRoster($userData) {
    global $knoxyConn;
    $userIsAdmin = (($userData['me']['rank']=='Admin') ? true : false);
    
    // Load each user from database
    $loadUsersQuery = "SELECT * FROM users";
    if(!$userIsAdmin) {
        $userTeam = $userData['team']['id'];
        $loadUsersQuery .= " WHERE team=$userTeam ORDER BY fname, lname";
    } else {
        $loadUsersQuery .= " ORDER BY rank, team, fname, lname";
        
        // Load each team from database
        $rosterTeams = array();
        $loadTeams = mysqli_query($knoxyConn, "SELECT * FROM teams") or die(mysqli_error($knoxyConn));
        while($dbTeam = mysqli_fetch_assoc($loadTeams)) {
            array_push($rosterTeams, $dbTeam);
        }
    }
    $loadUsers = mysqli_query($knoxyConn, $loadUsersQuery) or die(mysqli_error($knoxyConn));
    
        
    
    // Display each user as a row
    while($userRow = mysqli_fetch_array($loadUsers)) {
      if($userData['me']['rank'] == 'Coach' && $userRow['rank'] == 'Coach') continue;  
      if($userData['me']['id'] != $userRow['id']) {
        $userDisplay = $userRow['fname'].' '.$userRow['lname'];
        if($userRow['prefernick']==1) $userDisplay .= ' <strong>('.$userRow['nickname'].')</strong>';
        echo '<tr id="rosterRow-'.$userRow['id'].'" class="rosterRow"><td class="rosterVal-display">'.$userDisplay.'</td>';
        if($userIsAdmin) {
            // Show user information and corresponding team information
            $userTeam = getTeamInfo($rosterTeams, $userRow['team']);
            echo '<td class="rosterVal-type">'.$userRow['rank'].'</td>';
            echo '<td class="rosterVal-team">'.($userRow['rank']!=='Admin'?'<a href="#roster" class="rosterTeam-'.$userTeam['id'].'">'.$userTeam['teamname'].'</a>':'N/A').'</td>';
            if($userRow['rank']=='Admin') {
                echo '<td><span>N/A</span></td>';
            } elseif($userRow['rank']=='Coach') {
                echo '<td class="rosterVal-waiver">';
                if($userRow['haswaiver']==3) {
                    echo '<span style="color:green">Yes</span>';
                } elseif($userRow['haswaiver']==2) {
                    echo '<span style="color:red">Needs Coach</span>';
                } elseif($userRow['haswaiver']==1) {
                    echo '<span style="color:red">Needs Player</span>';
                } else {
                    echo '<span style="color:red">Needs Both</span>';
                }
                echo '</td>';
            } else {
                echo '<td class="rosterVal-waiver">'.($userRow['haswaiver']==1 ? '<span style="color:green">Yes</span>' : '<span style="color:red">NO</span>').'</td>';
            }
            echo '<input type="hidden" class="rosterVal-position" value="'.str_replace('"', "'", $userRow['teamposition']).'">';
        } else {
            // Only show user information
            $userPositions = json_decode($userRow['teamposition']);
            echo '<td class="rosterVal-position">';
            if(count($userPositions) == 0) {
                echo '<span style="color:red">None</span>';
            } else {
                for($i=0;$i<count($userPositions);$i++) {
                    if(substr($userPositions[$i], 3) == 'Base') {
                        echo substr($userPositions[$i], 0, 3) . ' ' . substr($userPositions[$i], 3);
                    } else {
                        echo $userPositions[$i];
                    }
                    if($i < count($userPositions)-1) echo ', ';
                }
            }
            echo '</td>';
            
            echo '<td class="rosterVal-waiver"><span style="color:'.($userRow['haswaiver']==1 ? 'green">YES' : 'red">NO').'</span></td>';
           
        }
        echo '<input type="hidden" class="rosterVal-email" value="'.$userRow['email'].'">';
        echo '<input type="hidden" class="rosterVal-phone" value="'.$userRow['phone'].'">';
        echo '<input type="hidden" class="rosterVal-nick" value="'.$userRow['nickname'].'">';
        echo '<input type="hidden" class="rosterVal-prefernick" value="'.($userRow['prefernick']==1 ? 'true' : 'false').'">';
        echo '<input type="hidden" class="rosterVal-fname" value="'.$userRow['fname'].'">';
        echo '<input type="hidden" class="rosterVal-lname" value="'.$userRow['lname'].'">';
        echo '<input type="hidden" class="rosterVal-uname" value="'.$userRow['username'].'">';
        echo '</tr>';
      }
    }
}


function rosterTeams($adminRefresh = false, $local = false) {
    $teams = getTeams(true);
    $gamesTeams = getGamesTeams();
    
    if(!$adminRefresh) {
        for($t=0;$t<count($teams);$t++) {
            $teamPlayers = teamPlayers($teams[$t]['id']);
            echo '<tr id="teamsRow-'.$teams[$t]['id'].'" class="teamsRow">';
            echo '<td class="teamsVal-teamname">'.$teams[$t]['teamname'].'</td>';
            echo '<td class="teamsVal-division">'.$teams[$t]['division'].'</td>';
            echo '<td class="teamsVal-coachname">'.($teams[$t]['coach']=='[]' ? '<span style="color:red">None</span>' : coachName($teams[$t]['coach'])).'</td>';
            echo '<td class="teamsVal-players">'.($teams[$t]['coach']=='[]' ? 'N/A' : $teamPlayers['count']).'</td>';
            echo '<td class="teamsVal-ready">'.($teamPlayers['ready'] ? '<span style="color:green">YES</span>' : '<span style="color:red">NO</span>').'</td>';
            echo '<input type="hidden" class="teamsVal-coachid" value="'.$teams[$t]['coach'].'">';
            if(!teamHasGames($teams[$t]['teamname'], $gamesTeams)) echo '<input type="hidden" class="teamsVal-removeable" value="true">';
            echo '</tr>';
        }
    } else {
        $strVal = '';
        for($t=0;$t<count($teams);$t++) {
            $teamPlayers = teamPlayers($teams[$t]['id']);
            $strVal .= '<tr id="teamsRow-'.$teams[$t]['id'].'" class="teamsRow">';
            $strVal .= '<td class="teamsVal-teamname">'.$teams[$t]['teamname'].'</td>';
            $strVal .= '<td class="teamsVal-division">'.$teams[$t]['division'].'</td>';
            $strVal .= '<td class="teamsVal-coachname">'.($teams[$t]['coach']=='[]' ? '<span style="color:red">None</span>' : coachName($teams[$t]['coach'])).'</td>';
            $strVal .= '<td class="teamsVal-players">'.($teams[$t]['coach']=='[]' ? 'N/A' : $teamPlayers['count']).'</td>';
            $strVal .= '<td class="teamsVal-ready">'.($teamPlayers['ready'] ? '<span style="color:green">YES</span>' : '<span style="color:red">NO</span>').'</td>';
            $strVal .= '<input type="hidden" class="teamsVal-coachid" value="'.$teams[$t]['coach'].'">';
            if(!teamHasGames($teams[$t]['teamname'], $gamesTeams)) $strVal .= '<input type="hidden" class="teamsVal-removeable" value="true">';
            $strVal .= '</tr>';
        }
        
        $response = array("html"=>$strVal, "js"=>$teams);
        if($local) {
            return $response;
        } else {
            echo json_encode($response);
        } 
    }  
}


function coachName($coaches) {
    global $knoxyConn;  
    $coachIds = json_decode($coaches);
    $rVal = '';
    for($c=0;$c<count($coachIds);$c++) {
        $coachId = $coachIds[$c];
        $cnq = mysqli_query($knoxyConn, "SELECT fname,lname,nickname,prefernick FROM users WHERE id=$coachId") or die(mysqli_error($knoxyConn));
        $cnr = mysqli_fetch_assoc($cnq);
        if(intval($cnr['prefernick'])==1) {
            $rVal .= $cnr['nickname'];
        } else {
            $name = $cnr['fname'].' '.$cnr['lname'];
            $rVal .= $name;
        }
        if($c < count($coachIds)-1) $rVal .= ', ';
    }
    return $rVal;
}

function teamPlayers($teamId) {
    global $knoxyConn;
    $tpq = mysqli_query($knoxyConn, "SELECT id,rank,haswaiver FROM users WHERE team=$teamId") or die(mysqli_error($knoxyConn));
    $tpc = mysqli_num_rows($tpq) - 1;
    $ready = 0;
    $rr = false;
    if($tpc > 0) {
        while($player = mysqli_fetch_assoc($tpq)) {
            if($player['rank']=='Player' && intval($player['haswaiver'])==1) {
                $ready++;
            } elseif($player['rank']=='Coach' && intval($player['haswaiver']==3)) {
                $ready++;
            }
        }
        if($ready >= $tpc) $rr = true;
    }
    $tpr = array('count'=>$tpc, 'ready'=>$rr);
    return $tpr; 
}


function getTeams($local) {
    global $knoxyConn;
    $teams = array();
    $getTeamsQuery = mysqli_query($knoxyConn, "SELECT * FROM teams ORDER BY teamname") or die(mysqli_error($knoxyConn));
    while($team = mysqli_fetch_assoc($getTeamsQuery)) {
        array_push($teams, $team);
    }
    if($local) {
        return $teams;
    } else {
        echo json_encode($teams);
    }
    
}


function getTeamInfo($teams, $teamId) {
    $teamInfo = false;
    for($t=0; $t<count($teams); $t++) {
        if($teamId == $teams[$t]['id']) {
            $teamInfo = $teams[$t];
            break;
        }
    }
    return $teamInfo;
}


function getGamesTeams() {
    global $knoxyConn;
    $gamesTeams = array();
    $getGtQuery = mysqli_query($knoxyConn, "SELECT team1,team2 FROM games") or die(mysqli_error($knoxyConn));
    while($gt = mysqli_fetch_assoc($getGtQuery)) {
        array_push($gamesTeams, $gt);
    }
    
    return $gamesTeams;
}


function teamHasGames($teamname, $gamesTeams) {
    $thg = false;
    foreach($gamesTeams as $gt) {
        if($gt['team1']==$teamname || $gt['team2']==$teamname) {
            $thg = true;
            break;
        } 
    }
    
    return $thg;
}


function jsonError($errMsg) {
    $response = array("error"=>"true", "message"=>$errMsg);
    echo json_encode($response);
}


function saveTeam($jsonTeamData) {
    global $knoxyConn;
    $teamData = json_decode($jsonTeamData);
    $teamName = addslashes(trim($teamData->teamName));
    $teamDiv = addslashes(trim($teamData->teamDivision));
    $orgName = addslashes(trim($teamData->orgName));
    $orgPhone = addslashes(trim($teamData->orgPhone));
    $orgAddr = addslashes(trim($teamData->orgAddress));
    $layName = addslashes(trim($teamData->layName));
    $layPhone = addslashes(trim($teamData->layPhone));
    $layEmail = addslashes(trim($teamData->layEmail));
    $isUpdate = addslashes(trim($teamData->update));
    if($isUpdate == 'true') {
        $updateId = addslashes(trim($teamData->teamId));
        $saveTeamSql = "UPDATE teams SET teamname='$teamName', division='$teamDiv', orgname='$orgName', orgphone='$orgPhone', orgaddr='$orgAddr', ";
        $saveTeamSql .= "layname='$layName', layphone='$layPhone', layemail='$layEmail' WHERE id=$updateId";      
    } else {
        $saveTeamSql = "INSERT INTO teams (teamname,coach,points,crd,division,orgname,orgphone,orgaddr,layname,layphone,layemail,tpcontent,tpimg,tpslogan)";
        $saveTeamSql .= " VALUES ('$teamName', '[]', 0, 0, '$teamDiv', '$orgName', '$orgPhone', '$orgAddr', '$layName', '$layPhone', '$layEmail','','','')";
    }
    mysqli_query($knoxyConn, $saveTeamSql) or die(jsonError(mysqli_error($knoxyConn)));

    // Respond to client
    $response = rosterTeams(true, true);
    $response['success'] = 'true';
    echo json_encode($response);
}


function uploadTeamImage($isUserId, $cualId, $imgFile) {
    $teamId = $cualId;
    if($isUserId) {
        $userData = getUserData($cualId);
        $teamId = $userData['team']['id'];
    }
    
    $uploadDir = "./data/teams/$teamId";
    if(!is_dir($uploadDir)) mkdir($uploadDir);
    $uploadPath = $uploadDir.'/'.basename($imgFile['name']);
    if(move_uploaded_file($imgFile['tmp_name'], $uploadPath)) {
        echo $uploadPath;
    } else {
        if($imgFile['error']==1) {
            echo 'error: filesize';
        } else {
            echo 'error: '.$imgFile['error'];
        }
        
    }
}


function updateTeamPage($isUserId, $cualId, $tpContent, $tpImg, $tpSlogan) {
    global $knoxyConn;
    $teamId = $cualId;
    if($isUserId) {
        $userData = getUserData($cualId);
        $teamId = $userData['team']['id'];
    }
    // Move uploaded image file if needed
    if(strpos($tpImg, "/admin/data/teams/") !== FALSE) {
        $getFilename = substr($tpImg, strrpos($tpImg,'/')+1);
        $filename = str_replace('%20', ' ', $getFilename);
        $imgFile = "./data/teams/$teamId/$filename";
        $newDir = "../images/teams/$teamId";
        if(!is_dir($newDir)) mkdir($newDir);
        
        if(rename($imgFile, $newDir."/$filename")) {
            // Update tpimg value
            $newImg = str_replace("/admin/data/teams/", "/images/teams/", $tpImg);
            $tpImg = $newImg;
            
            // Delete the original upload directory
            $teamDir = "./data/teams/$teamId";
            $files = glob("$teamDir/*");
            foreach($files as $file) {
                unlink($file);
            }
            rmdir($teamDir);
            
            // Remove all other image files in images/team/teamId directory
            $niFiles = glob("$newDir/*");
            foreach($niFiles as $file) {
                $niFilename = substr($file, strrpos($file,'/')+1);
                if($niFilename != $filename) {
                    unlink($file);
                }
            }
        }
    }
    
    $content = addslashes($tpContent);
    $img = addslashes($tpImg);
    $slogan = addslashes($tpSlogan);
    $sql = "UPDATE teams SET tpcontent='$content', tpimg='$img', tpslogan='$slogan' WHERE id=$teamId";
    mysqli_query($knoxyConn, $sql) or die(jsonError(mysqli_error($knoxyConn)));
    
    $response = array("success"=>"true");
    if(!$isUserId) {
        $utl = getTeams(true);
        $response['teams'] = $utl;
    }
    echo json_encode($response);
}


function adminTpOptions() {
    global $knoxyConn;
    $teamsQuery = mysqli_query($knoxyConn, "SELECT id,teamname FROM teams ORDER BY teamname") or die(mysqli_error($knoxyConn));
    echo '<option value="null" selected disabled>Select a Team</option>';
    while($team = mysqli_fetch_assoc($teamsQuery)) {
        echo '<option value="'.$team['id'].'">'.$team['teamname'].'</option>';
    }
}


function saveScore($gameId, $matchId, $team1, $team2, $userId) {
    global $knoxyConn;
    // to do: validation for user id (ensure user is authorized to update this game)
    
    
    // Update game in database
    $sp = "score$matchId";
    $t1 = $sp."_t1";
    $t2 = $sp."_t2";
    mysqli_query($knoxyConn, "UPDATE games SET $t1=$team1, $t2=$team2 WHERE id=$gameId") or die(mysqli_error($knoxyConn));
    
    // Assign points
    if($team1==0 && $team2==0) {
        // Reset team points and run differential before recalculating
        $getTeams = mysqli_query($knoxyConn, "SELECT team1, team2 FROM games WHERE id=$gameId") or die(mysqli_error($knoxyConn));
        $teams = mysqli_fetch_assoc($getTeams);
        $rt1 = $teams['team1'];
        $rt2 = $teams['team2'];
        mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0 WHERE teamname='$rt1'") or die(mysqli_error($knoxyConn));
        mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0 WHERE teamname='$rt2'") or die(mysqli_error($knoxyConn));
    }
    calculateTeamPoints();
    echo 'success';
}


function updateGame() {
    global $knoxyConn;
    // to do: validation for user id (ensure user is authorized to update this game)
    
    
    $gDate = strval($_POST['date']);
    $gId = strval($_POST['game']);
    $match = strval($_POST['match']);
    $time = strval($_POST['time']);
    $loc = strval($_POST['loc']);
    $team1 = intval($_POST['t1']);
    $team2 = intval($_POST['t2']);
    $gameDay = date("l", strtotime($gDate));
    $gameIsInFuture = false;
    
    // Check if game is in future
    $dtNow = new DateTime("now");
    $dtGame = new DateTime("$gDate $time:00");
    if($dtGame > $dtNow) {
        $gameIsInFuture = true;
        // Clear scores
        $team1 = 0;
        $team2 = 0;
    }
    
    // Update game in database
    $gp = "game$match";
    $sp = "score$match";
    $t1 = $sp."_t1";
    $t2 = $sp."_t2";
    $updateGameQuery = "UPDATE games SET gameday='$gameDay', gamedate='$gDate', $gp='$time', field='$loc', $t1=$team1, $t2=$team2 WHERE id=$gId";
    mysqli_query($knoxyConn, $updateGameQuery) or die(mysqli_error($knoxyConn));
    
    // Assign points
    if($team1==0 && $team2==0) {
        // Reset team points and run differential before recalculating
        $getTeams = mysqli_query($knoxyConn, "SELECT team1, team2 FROM games WHERE id=$gId") or die(mysqli_error($knoxyConn));
        $teams = mysqli_fetch_assoc($getTeams);
        $rt1 = $teams['team1'];
        $rt2 = $teams['team2'];
        mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0 WHERE teamname='$rt1'") or die(mysqli_error($knoxyConn));
        mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0 WHERE teamname='$rt2'") or die(mysqli_error($knoxyConn));
    }
    calculateTeamPoints();
    
    // Respond to client
    $response = array("success"=>"true", "day"=>$gameDay, "date"=>date('m/d/y', strtotime($gDate)));
    if($gameIsInFuture) $response['future'] = 'true';
    echo json_encode($response);
}


function calculateTeamPoints() {
    global $knoxyConn;
    
    // Fetch games with posted scores
    $games = array();
    $ggq = "SELECT * FROM games WHERE score1_t1 > 0 OR score1_t2 > 0 OR score2_t1 > 0 OR score2_t2 > 0";
    $getGames = mysqli_query($knoxyConn, $ggq) or die(mysqli_error($knoxyConn));
    while($game = mysqli_fetch_assoc($getGames)) {
        array_push($games, $game);
    }
      
    // Parse scores and determine points and run differential for each team
    $teams = array();
    $diffs = array();
    for($g=0;$g<count($games);$g++) {
        $team1 = $games[$g]['team1'];
        $team2 = $games[$g]['team2'];
        if(!array_key_exists($team1, $teams)) $teams[$team1] = 0;
        if(!array_key_exists($team2, $teams)) $teams[$team2] = 0;
        if(!array_key_exists($team1, $diffs)) $diffs[$team1] = 0;
        if(!array_key_exists($team2, $diffs)) $diffs[$team2] = 0;
        
        $score1_t1 = intval($games[$g]['score1_t1']);
        $score1_t2 = intval($games[$g]['score1_t2']);
        $score2_t1 = intval($games[$g]['score2_t1']);
        $score2_t2 = intval($games[$g]['score2_t2']);
        
        if($score1_t1 != 0 || $score1_t2 != 0) {
            if($score1_t1 > $score1_t2) {
                // team 1 winner of match 1
                $teams[$team1] += 2;
            } elseif($score1_t1 < $score1_t2) {
                // team 2 winner of match 1
                $teams[$team2] += 2;
            } else {
                // match 1 tie
                $teams[$team1] += 1;
                $teams[$team2] += 1;
            }
        }
            
        if($score2_t1 != 0 || $score2_t2 != 0) {
            if($score2_t1 > $score2_t2) {
                // team 1 winner of match 2
                $teams[$team1] += 2;
            } elseif($score2_t1 < $score2_t2) {
                // team 2 winner of match 2
                $teams[$team2] += 2;
            } else {
                // match 2 tie
                $teams[$team1] += 1;
                $teams[$team2] += 1;
            }
        }
        
        // Calculate match 1 run differential for each team
        $m1_t1rd = $score1_t1 - $score1_t2 + intval($diffs[$team1]);
        $diffs[$team1] = $m1_t1rd;
        $m1_t2rd = $score1_t2 - $score1_t1 + intval($diffs[$team2]);
        $diffs[$team2] = $m1_t2rd;
        
        // Calculate match 2 run differential for each team
        $m2_t1rd = $score2_t1 - $score2_t2 + intval($diffs[$team1]);
        $diffs[$team1] = $m2_t1rd;
        $m2_t2rd = $score2_t2 - $score2_t1 + intval($diffs[$team2]);
        $diffs[$team2] = $m2_t2rd;
            
    }
    
    // Update points in the teams table
    foreach($teams as $team=>$points) {
        mysqli_query($knoxyConn, "UPDATE teams SET points=$points WHERE teamname='$team'") or die(mysqli_error($knoxyConn));
    }
    
    // Update run differential in the teams table
    foreach($diffs as $team=>$rd) {
        mysqli_query($knoxyConn, "UPDATE teams SET crd=$rd WHERE teamname='$team'") or die(mysqli_error($knoxyConn));
    }
}


function getSiteContent() {
    global $knoxyConn;
    $siteContent = array();
    $gscq = mysqli_query($knoxyConn, "SELECT * FROM pages");
    while($pc = mysqli_fetch_assoc($gscq)) {
        $pcp = $pc['parent'];
        $pce = $pc['element'];
        $siteContent[$pcp][$pce] = $pc['content'];
    }
    return $siteContent;
}


function editSiteContent() {
    global $knoxyConn;
    $homeContent = $_POST['home'];
    $infoContent = $_POST['info'];
    
    $homeBlurb = addslashes($homeContent['homeBlurb']);
    $infoAbout = addslashes($infoContent['aboutus']);
    $infoLocs = addslashes($infoContent['locations']);
    $infoRules = addslashes($infoContent['rules']);
    
    mysqli_query($knoxyConn, "UPDATE pages SET content='$homeBlurb' WHERE element='homeBlurb'") or die(mysqli_error($knoxyConn));
    mysqli_query($knoxyConn, "UPDATE pages SET content='$infoAbout' WHERE element='aboutus'") or die(mysqli_error($knoxyConn));
    mysqli_query($knoxyConn, "UPDATE pages SET content='$infoLocs' WHERE element='locations'") or die(mysqli_error($knoxyConn));
    mysqli_query($knoxyConn, "UPDATE pages SET content='$infoRules' WHERE element='rules'") or die(mysqli_error($knoxyConn));
    
    echo 'success';
}
