<?php
include('../db.php');
include 'assets/Classes/PHPExcel/IOFactory.php';
error_reporting(E_ALL);
set_time_limit(0);
date_default_timezone_set('America/Indianapolis');

$error = false;
$data = array();

if(isset($_GET['resolve'])) {
    resolveConflicts();
} else {
    if(isset($_FILES[0])) {
        if(move_uploaded_file($_FILES[0]['tmp_name'], './data/schedule/'.$_FILES[0]['name'])) {
            $ssFile = './data/schedule/'.$_FILES[0]['name'];
            importSpreadsheet($ssFile);
        } else {
            $error = 'Failed to upload file to server!';
        }

    } else {
        $error = 'No file specified!';
    }
    if($error) {
        $result = array('error'=>$error);
        echo json_encode($result);
    }
}


function importSpreadsheet($ssFile) {
    global $knoxyConn;
    //$inputFileName = './data/schedule/2016-master.xlsx';
    $objPHPExcel = PHPExcel_IOFactory::load($ssFile);

    //$homeTeamCell = 'E3';
    //$homeTeamColor = $objPHPExcel->getActiveSheet()->getCell($homeTeamCell)->getStyle()->getFill()->getStartColor()->getRGB();

    /* Define the cell range to iterate */
    $startRow = 5;
    $endColumn = 'I';
    $endRow = $objPHPExcel->getActiveSheet()->getHighestRow();

    // Save headers
    $dataHeaders = array();
    foreach($objPHPExcel->getActiveSheet()->getRowIterator($startRow, $startRow)->current()->getCellIterator('A', $endColumn) as $headerCell) {
        $headerVal = $headerCell->getFormattedValue();
        if($headerVal != "") array_push($dataHeaders, $headerVal);
    }
    
    if(count($dataHeaders) < 1) {
        $result = array('error'=>"Invalid spreadsheet!");
        echo json_encode($result);
    } else {
        // Parse the data in each row
        $rowData = array();
        foreach($objPHPExcel->getActiveSheet()->getRowIterator($startRow+1, $endRow) as $row) {
            //$currentRow = $row->getRowIndex();                                                              
            $thisRow = array();
            $isEmpty = false;                                                   //  $rowData[0] = null (gameID)
            foreach($row->getCellIterator('A', $endColumn) as $cell) {          //  $rowData[1] = team1
                //$cellCoord = $cell->getCoordinate();                          //  $rowData[2] = day
                //$row->current()->getCellIterator()->current()->               //  $rowData[3] = date
                $cellValue = $cell->getFormattedValue();                        //  $rowData[4] = Game 1
                if(!$cellValue) $isEmpty = true;                                //  $rowData[5] = Game 2
                if(!$isEmpty) array_push($thisRow, $cellValue);                 //  $rowData[6] = Division
            }                                                                   //  $rowData[7] = Field
            if(count($thisRow) > 0) array_push($rowData, $thisRow);             //  $rowData[8] = team2
        }
        
        // Reset schedule and standings
        mysqli_query($knoxyConn, "TRUNCATE TABLE games") or die(mysqli_error($knoxyConn));
        mysqli_query($knoxyConn, "UPDATE teams SET points=0, crd=0") or die(mysqli_error($knoxyConn));
                                                                                                                
        // Process the schedule data
        $scheduleData = processGamesData($rowData);
        $gamesAdded = $scheduleData['games'];
        if($gamesAdded != 0) {
            // Check database for un-added teams and teams with no scheduled games
            $teamsCheck = checkTeams($scheduleData['teams']);
            
        }
        
        // Create new season if necessary
        $dnSeason = mysqli_query($knoxyConn, "SELECT end FROM seasons ORDER BY id DESC LIMIT 1") or die(mysqli_error($knoxyConn));
        $dnsResult = mysqli_fetch_assoc($dnSeason);
        $csEnd = $dnsResult['end'];
        if($csEnd != '0001-01-01') {
            $startDate = date("Y-m-d");
            mysqli_query($knoxyConn, "INSERT INTO seasons (start,end,games,teams) VALUES ('$startDate', '0001-01-01', '[]', '[]')") or die(mysqli_error($knoxyConn));
        }
        
        
        // Respond to client
        $tcNoExist = (count($teamsCheck['noExist']) > 0 ? $teamsCheck['noExist'] : false);
        $tcNoGames = (count($teamsCheck['noGames']) > 0 ? $teamsCheck['noGames'] : false);
        $result = array(
            'success' => true,
            'gamesAdded' => $gamesAdded,
            'teamsNoExist' => $tcNoExist,
            'teamsNoGames' => $tcNoGames
        );
        echo json_encode($result);
        
        // Delete file
        unlink($ssFile);
    } 
}

function processGamesData($ssGames) {
    global $knoxyConn;
    $addedGames = 0;
    $teams = array();
    foreach($ssGames as $dataRowKey=>$dataRow) {
        // Parse only the even rows (odd rows are simply repeats of the even rows' data)
        if($dataRowKey % 2 == 0) {
            $team1 = trim($dataRow[1]);
            $gameday = trim($dataRow[2]);
            $gamedate = date("Y-m-d", strtotime($dataRow[3]));
            $game1 = str_replace(' PM', ':00', $dataRow[4]);
            $game2 = str_replace(' PM', ':00', $dataRow[5]);
            $division = trim($dataRow[6]);
            $field = trim($dataRow[7]);
            $team2 = trim($dataRow[8]);

            // Register any new teams
            if(array_search(array($team1, $division), $teams)===false) array_push($teams, array($team1, $division));
            if(array_search(array($team2, $division), $teams)===false) array_push($teams, array($team2, $division));

            // Add game to the database
            $addGameQuery = "INSERT INTO games (team1, gameday, gamedate, game1, game2, division, field, team2, score1_t1, score1_t2, score2_t1, score2_t2) VALUES ";
            $addGameQuery .= "('$team1', '$gameday', '$gamedate', '$game1', '$game2', '$division', '$field', '$team2', 0, 0, 0, 0)";

            if(mysqli_query($knoxyConn, $addGameQuery)) {
                $addedGames++;
            } else {
                die(mysqli_error($knoxyConn));
            }
        }
    }
    $pgdResult = array('games'=>$addedGames, 'teams'=>$teams);
    return $pgdResult;
}

function checkTeams($listTeams) {
    global $knoxyConn;
    //$tadded = 0;
    $tAdded = array();
    $tNoExist = array();
    $tNoGames = array();
    
    // Cache list of existing teams
    $currentTeams = array();
    $ctq = mysqli_query($knoxyConn, "SELECT teamname FROM teams") or die(mysqli_error($knoxyConn));
    while($cTeam = mysqli_fetch_assoc($ctq)) {
        array_push($currentTeams, $cTeam['teamname']);
    }
    
    // Process the teams obtained from the newly imported schedule
    for($t=0;$t<count($listTeams);$t++) {
        // Check if team already exists
        $thisTeam = $listTeams[$t];
        $ttName = $thisTeam[0];
        $ttDiv = $thisTeam[1];
        $tObj = (object) [
            'teamname' => $ttName,
            'teamdiv' => $ttDiv
        ];
        $ctt = array_search($ttName, $currentTeams);
        if($ctt === false) {
            // Team is on the schedule but does not exist in the database
            array_push($tNoExist, $tObj);
        } else {
            // Team is on the schedule and exists in the database
            array_push($tAdded, $ttName);
            
            // Update the team division
            mysqli_query($knoxyConn, "UPDATE teams SET division='$ttDiv' WHERE teamname='$ttName'") or die(mysqli_error($knoxyConn));
        }
    }
    
    // Determine any teams in the database that do not have scheduled games
    for($c=0; $c<count($currentTeams); $c++) {
        $cTeamName = $currentTeams[$c];
        $ctnAdded = array_search($cTeamName, $tAdded);
        if($ctnAdded === false) {
            // Team is in the database but has no scheduled games
            array_push($tNoGames, $cTeamName);
        }
    }
    
    $fr = array('noExist'=>$tNoExist, 'noGames'=>$tNoGames);
    return $fr;
}

function resolveConflicts() {
    global $knoxyConn;
    $newTeams = json_decode($_POST['nt']);
    $idTeams = json_decode($_POST['idt']);
    $removeTeams = json_decode($_POST['rt']);
    
    $rStr = '';
    
    if($newTeams) {
        foreach($newTeams as $nt) {
            // Add new team to the database
            $ntName = $nt->name;
            $ntDiv = $nt->division;
            $addTeamSql = "INSERT INTO teams (teamname,coach,points,crd,division,orgname,orgphone,orgaddr,layname,layphone,layemail,tpcontent,tpimg,tpslogan) VALUES "
                    . "('$ntName', '[]', 0, 0, '$ntDiv', '', '', '', '', '', '', '', '', '')";
            mysqli_query($knoxyConn, $addTeamSql) or die(mysqli_error($knoxyConn));
            $rStr .= '<span style="font-weight:normal">* Added new team: <strong>'.$ntName.'</strong> (Division '.$ntDiv.')</span><br>';
        }
    }
    
    if($idTeams) {
        foreach($idTeams as $idt) {
            $ssName = $idt->ssName;
            $ssDiv = $idt->ssDiv;
            $dbName = $idt->dbName;
            $idtSql1 = "UPDATE games SET team1='$dbName' WHERE team1='$ssName'";
            $idtSql2 = "UPDATE games SET team2='$dbName' WHERE team2='$ssName'";
            mysqli_query($knoxyConn, $idtSql1) or die(mysqli_error($knoxyConn));
            mysqli_query($knoxyConn, $idtSql2) or die(mysqli_error($knoxyConn));
            mysqli_query($knoxyConn, "UPDATE teams SET division='$ssDiv' WHERE teamname='$dbName'") or die(mysqli_error($knoxyConn));
            $rStr .= '<span style="font-weight:normal">* Identified team <strong>'.$ssName.'</strong> as: <strong>'.$dbName.'</strong></span><br>';
        }
    }
    
    if($removeTeams) {
        // Determine team IDs to remove
        $rids = array();
        $grtidSql = "SELECT id FROM teams WHERE ";
        $rtCount = count($removeTeams);
        for($r=0; $r<$rtCount; $r++) {
            $rtName = $removeTeams[$r];
            $grtidSql .= "teamname='$rtName'";
            if($r < $rtCount - 1) {
                $grtidSql .= " OR ";
            }
        }
        $grtidQuery = mysqli_query($knoxyConn, $grtidSql) or die(mysqli_error($knoxyConn));
        while($grtidResult = mysqli_fetch_assoc($grtidQuery)) {
            $rid = $grtidResult['id'];
            array_push($rids, $rid);
        }
        $ridsCount = count($rids);
        
        // Remove the teams
        $rtSql = "DELETE FROM teams WHERE ";
        for($t=0; $t<$ridsCount; $t++) {
            $rtId = $rids[$t];
            $rtSql .= "id=$rtId";
            if($t < $ridsCount-1) {
                $rtSql .= " OR ";
            }
        }
        mysqli_query($knoxyConn, $rtSql) or die(mysqli_error($knoxyConn));
        
        // Remove the associated users
        $ruSql = "DELETE FROM users WHERE ";
        for($u=0; $u<$ridsCount; $u++) {
            $ruId = $rids[$u];
            $ruSql .= "team=$ruId";
            if($u < $ridsCount-1) {
                $ruSql .= " OR ";
            }
        }
        mysqli_query($knoxyConn, $ruSql) or die(mysqli_error($knoxyConn));
        
        $rStr .= '<span style="font-weight:normal">* Removed '.$ridsCount.' teams and all associated users</span><br>';
    }
    
    
    $response = array('success'=>true, 'log'=>$rStr);
    echo json_encode($response);
}
?>        