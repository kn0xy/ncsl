<?php
session_name("NorthsideChristianSoftballLeague");
session_start();

include('functions.php');

// Check if user has permission to view this page
$validUser = false;
$userId;
if(isset($_SESSION['userId'])) {
    $userId = $_SESSION['userId'];
    $getUserRank = mysqli_query($knoxyConn, "SELECT rank,haswaiver FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
    $userCred = mysqli_fetch_assoc($getUserRank);
    if($userCred['rank'] == 'Admin') {
        $validUser = true;
    } elseif($userCred['rank'] == 'Coach') {
        if($userCred['haswaiver'] == 3) {
            $validUser = true;
        } else {
            header('Location: ../?waiver');
        }
    }
}

if($validUser) {
    if(isset($_GET['saveLocation'])) {
        saveLocation($_POST['locSave'], $_POST['update']);
        exit();
    }
    
    if(isset($_GET['removeLocation'])) {
        removeLocation($_POST['location']);
        exit();
    }

    if(isset($_GET['teams'])) {
        getTeams(false);
        exit();
    }
    
    if(isset($_GET['refreshTeams'])) {
        rosterTeams(true);
        exit();
    }
    
    if(isset($_GET['scheduleReload'])) {
        loadSchedule(getUserData($userId));
        exit();
    }

    if(isset($_GET['addUser'])) {
        addUser($_POST['userData'], $userId);
        exit();
    }
    if(isset($_GET['removeUser'])) {
        removeUser($_POST['id'], $userId);
        exit();
    }
    
    if(isset($_GET['rosterReload'])) {
        loadRoster(getUserData($userId));
        exit();
    }
    
    if(isset($_GET['saveTeam'])) {
        saveTeam($_POST['teamData']);
        exit();
    }
    
    if(isset($_GET['teamImage'])) {
        if($userCred['rank']=='Admin') {
            uploadTeamImage(false, $_GET['team'], $_FILES[0]);
        } else {
            uploadTeamImage(true, $userId, $_FILES[0]);
        }
        exit();
    }
    
    if(isset($_GET['tpSave'])) {
        if($userCred['rank']=='Admin') {
            updateTeamPage(false, $_GET['team'], $_POST['content'], $_POST['img'], $_POST['slogan']);
        } else {
            updateTeamPage(true, $userId, $_POST['content'], $_POST['img'], $_POST['slogan']);
        }
        exit();
    }
    
    if(isset($_GET['saveScore'])) {
        saveScore($_POST['game'], $_POST['match'], $_POST['team1'], $_POST['team2'], $userId);
        exit();
    }
    
    if(isset($_GET['editSiteContent'])) {
        if($userCred['rank']=='Admin') {
            editSiteContent($_POST['home'], $_POST['info']);
        }
        exit();
    }
    
    if(isset($_GET['endSeason'])) {
        if($userCred['rank']=='Admin') {
            endSeason();
        }
        exit();
    }
    
    if(isset($_GET['updateGame'])) {
        if($userCred['rank']=='Admin') {
            updateGame();
        }
        exit();
    }
    
    // Gather information about the user
    $userData = getUserData($userId);
    $userRank = $userData['me']['rank'];
    $userIsAdmin = (($userRank=='Admin') ? true : false);
    $userDisplay = (($userData['me']['prefernick']==true) ? $userData['me']['nickname'] : $userData['me']['fname'].' '.$userData['me']['lname']);
    $userTeam = $userData['team']['teamname'];
    
  
  $newsLinkWord = ($userIsAdmin ? 'League' : 'Team');
  $newUserLabel = ($userIsAdmin ? 'Add User' : 'New Player');
  
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>NCSL Admin</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" user-scalable="no" />
        <!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
        <link rel="stylesheet" href="assets/css/main.css" />
        <link rel="icon" type="image/x-icon" href="../images/softball.png">
        <!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
        <!--[if lte IE 9]><link rel="stylesheet" href="assets/css/ie9.css" /><![endif]-->
    </head>
    <body>

        <!-- Header -->
        <div id="header">

            <div class="top">

                <!-- Logo -->
                <div id="logo">
                    <span class="image avatar48"><img src="../images/softball.png" alt="" /></span>
                    <h1 id="title"><?php echo $userDisplay;?></h1>
                    <p><?php echo ($userIsAdmin ? 'Administrator' : $userRank);?></p>
                    <p><?php echo ($userIsAdmin ? 'Northside Christian Softball League' : $userTeam);?></p>
                </div>

                <!-- Nav -->
                <nav id="nav">
                    <!--

                            Prologue's nav expects links in one of two formats:

                            1. Hash link (scrolls to a different section within the page)

                               <li><a href="#foobar" id="foobar-link" class="icon fa-whatever-icon-you-want skel-layers-ignoreHref"><span class="label">Foobar</span></a></li>

                            2. Standard link (sends the user to another page/site)

                               <li><a href="http://foobar.tld" id="foobar-link" class="icon fa-whatever-icon-you-want"><span class="label">Foobar</span></a></li>

                    -->
                    <ul>
                        <li><a href="#dashboard" id="dashboard-link" class="skel-layers-ignoreHref"><span class="icon fa-home">Dashboard</span></a></li>
                        <li><a href="#schedule" id="schedule-link" class="skel-layers-ignoreHref"><span class="icon fa-calendar"><?php if($userIsAdmin)echo 'Edit ';?>Schedule</span></a></li>
                        <li><a href="#roster" id="roster-link" class="skel-layers-ignoreHref"><span class="icon fa-users"><?php if($userIsAdmin)echo 'Edit ';?>Roster</span></a></li>
                        <li><a href="#teampage" id="teampage-link" class="skel-layers-ignoreHref"><span class="icon fa-at"><?php if($userIsAdmin)echo 'Edit ';?>Team Page</span></a></li>
                        <?php if($userIsAdmin)echo '<li><a href="#content" id="content-link" class="skel-layers-ignoreHref"><span class="icon fa-cogs">Edit Site Content</span></a></li>';?>
                        <li>&nbsp;</li>
                        <li><a href="../"><span class="icon fa-eye">View Main Site</span></a></li>
                        <li onclick="logout()"><a href="#"><span class="icon fa-chain-broken">Logout</span></a></li>
                    </ul>
                </nav>

            </div>

            <div class="bottom">

                

            </div>

        </div>

        <!-- Main -->
        <div id="main">

            <!-- Dashboard -->
            <section id="dashboard" class="one dark cover">
                <div class="container">

                    <header>
                        <h2 class="alt">Admin Dashboard</h2>
                    </header>
                    <div class="row">
                    <?php if($userIsAdmin) {?>
                        <div class="4u 6u(normal) 6u(narrower)">
                            <div class="notificationsWrap">
                                <p style="text-align:center"><strong>Teams</strong></p>
                                <div id="notifications-Teams">
                                    <div id="notifications-Teams-DivA">
                                        <p><span style="font-weight:bold">Division A:</span> &nbsp; 
                                            <span class="notifications-numTeams">?</span> teams total 
                                            (<span class="notifications-teamsReady">?</span> ready)
                                        </p>
                                    </div>
                                    <div id="notifications-Teams-DivB">
                                        <p><span style="font-weight:bold">Division B:</span> &nbsp; 
                                            <span class="notifications-numTeams">?</span> teams total  
                                            (<span class="notifications-teamsReady">?</span> ready)
                                        </p>
                                    </div>
                                    <div id="notifications-Teams-DivC">
                                        <p><span style="font-weight:bold">Division C:</span> &nbsp; 
                                            <span class="notifications-numTeams">?</span> teams total 
                                            (<span class="notifications-teamsReady">?</span> ready)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="4u 6u(normal) 6u(narrower)">
                            <div class="notificationsWrap">
                                <p style="text-align:center"><strong>Games</strong></p>
                                <div id="notifications-Games">
                                    <div id="notifications-Games-DivA">
                                        <p><span style="font-weight:bold">Division A:</span> &nbsp; 
                                            <span class="notifications-numGames">?</span> games total 
                                            (<span class="notifications-gamesPlayed">?</span> played)
                                        </p>
                                    </div>
                                    <div id="notifications-Games-DivB">
                                        <p><span style="font-weight:bold">Division B:</span> &nbsp; 
                                            <span class="notifications-numGames">?</span> games total  
                                            (<span class="notifications-gamesPlayed">?</span> played)
                                        </p>
                                    </div>
                                    <div id="notifications-Games-DivC">
                                        <p><span style="font-weight:bold">Division C:</span> &nbsp; 
                                            <span class="notifications-numGames">?</span> games total 
                                            (<span class="notifications-gamesPlayed">?</span> played)
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="4u 6u(normal) 6u(narrower)">
                            <div class="notificationsWrap">
                                <p style="text-align:center"><strong>Coaches &amp; Players</strong></p>
                                <div id="notifications-Users">
                                    <div id="notifications-Users-DivA">
                                        <p><span style="font-weight:bold">Division A:</span> &nbsp; 
                                            <span class="notifications-numPlayers">?</span> <span>players</span>  
                                            (<span class="notifications-numCoaches">?</span> <span>coaches</span>)
                                        </p>
                                    </div>
                                    <div id="notifications-Users-DivB">
                                        <p><span style="font-weight:bold">Division B:</span> &nbsp; 
                                            <span class="notifications-numPlayers">?</span> <span>players</span>  
                                            (<span class="notifications-numCoaches">?</span> <span>coaches</span>)
                                        </p>
                                    </div>
                                    <div id="notifications-Users-DivC">
                                        <p><span style="font-weight:bold">Division C:</span> &nbsp; 
                                            <span class="notifications-numPlayers">?</span> <span>players</span>  
                                            (<span class="notifications-numCoaches">?</span> <span>coaches</span>)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php } else {?>
                        <div class="6u">
                            <div class="notificationsWrap">
                                <p style="text-align:center"><strong>Notifications</strong></p>
                                <div id="coachNotifications"></div>
                            </div>
                        </div>
                        <div class="6u">
                            <div class="notificationsWrap">
                                <p style="text-align:center"><strong>Statistics</strong></p>
                                <div id="coachStats">
                                    <p><span style="font-weight:bold">Total Players:</span> &nbsp; <span id="coachNumPlayers">?</span></p>
                                    <p><span style="font-weight:bold">Signed Waivers:</span> &nbsp; <span id="coachNumWaivers">? / ?</span></p>
                                    <p><span style="font-weight:bold">Games Played:</span> &nbsp; <span id="coachGamesPlayed">? / ?</span></p>
                                </div>
                            </div>
                        </div>
                    <?php }?>
                    </div>
                </div>
            </section>

            <!-- Schedule -->
            <section id="schedule" class="two">
                <div class="container">

                    <header>
                        <h2>Schedule</h2>
                    </header>
                    <div class="section-buttons">
                        <?php /* if($userIsAdmin) echo '<button type="button" class="button scheduleNav" id="scheduleBtn-add"><i class="icon fa-calendar-plus-o"></i><br>Add Event</button>'; */?>
                        <?php if($userIsAdmin) echo '<button type="button" class="button scheduleNav" id="scheduleBtn-locations"><i class="icon fa-globe"></i><br>Manage Locations</button>';?>
                        <?php if($userIsAdmin) echo '<button type="button" class="button scheduleNav" id="scheduleBtn-season"><i class="icon fa-leaf"></i><br>Manage Season</button>';?>
                        <?php if($userIsAdmin) echo '<button type="button" class="button scheduleNav" id="scheduleBtn-import"><i class="icon fa-download"></i><br>Batch Import</button>';?>
                        <button type="button" class="button" id="scheduleBtn-filter"><i class="icon fa-filter"></i><br>Filter Games</button>
                    </div>
                    
                    <div id="schedule-filter" class="row scheduleContent">
                        <?php if($userIsAdmin) {?>
                        <div class="schedule-filter-option">
                            <label for="schedule-filter-division">Division: &nbsp; </label>
                            <select id="schedule-filter-division">
                                <option value="null">Any</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <?php }?>
                        <div class="schedule-filter-option">
                            <label for="schedule-filter-team"><?php echo ($userIsAdmin ? 'Team:' : 'Opponent:');?> &nbsp; </label>
                            <select id="schedule-filter-team">
                                <option value="null">Any</option>
                            </select>
                        </div>
                        
                        <div class="schedule-filter-option">
                            <label for="schedule-filter-day">Day: &nbsp; </label>
                            <select id="schedule-filter-day">
                                <option value="null">Any</option>
                            </select>
                        </div>
                        <div class="schedule-filter-option">
                            <label for="schedule-filter-field">Field: &nbsp; </label>
                            <select id="schedule-filter-field">
                                <option value="null">Any</option>
                            </select>
                        </div>
                    </div>
                    <div id="schedule-list" class="row scheduleContent">
                        <table id="schedule-table">
                            <thead>
                                <tr>
                                    <?php if($userIsAdmin) echo '<th>Division</th>';?>
                                    <th>Who</th>
                                    <th>When</th>
                                    <th>Where</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php loadSchedule($userData);?>
                            </tbody>
                        </table>
                    </div>
<?php if($userIsAdmin) {?>                      
                    <div id="schedule-add" class="row scheduleContent">
                        <p>Coming soon!</p>
                    </div>
                                     
                    <!-- Schedule - Import --> 
                    <div id="schedule-import" class="row scheduleContent">
                        <p id="batchImportWarning" style="display:none">Note: This operation will clear all data for the current season!</p>
                        <p style="margin-bottom:0">Select the spreadsheet to import:
                            <br>
                            <input type="file" id="importSsFile" accept=".xls, .xlsx">
                            <br>
                            <span id="importStatus">&nbsp;</span>
                        </p>
                        
                        <p style="padding:0"><button type="button" id="btnBatchImport">Import Selected Spreadsheet</button></p>
                    </div>
                    
                    <!-- Schedule - Season --> 
                    <div id="schedule-season" class="row scheduleContent">
                        <div class="6u" style="padding-top:0">
                            <?php getSeasonStats(); ?>
                            <p id="scheduleEndSeason">
                                Ending the season will void all waivers, clear the schedule, and reset all team standings. Are you sure?<br><br>
                                <button type="button" id="endSeason-yes">Yes</button> &nbsp; <button type="button" id="endSeason-no">No</button>
                            </p>
                        </div>
                        <div class="6u" style="padding-top:0">
                            <p><strong>Past Seasons:</strong></p>
                            <br>
                            <?php getPastSeasons(); ?>
                        </div>
                        
                        
                        
                    </div>
                    
                    <!-- Schedule - Locations --> 
                    <div id="schedule-locations" class="row scheduleContent">
                        <div class="4u">
                            <p><button type="button" class="button scheduleNav" id="scheduleBtn-newLocation"><i class="icon fa-plus"></i><br>Add Location</button></p>
                            <p>Select an existing location from the list to modify it.</p>
                        </div>
                        <div class="8u">
                            <div id="locationsTable">
                                <div class="locationsTableHeading">
                                    <div class="locationsTableHead" id="locations-th-field">Field</div>
                                    <div class="locationsTableHead" id="locations-th-address">Address</div>
                                    <div class="locationsTableHead" id="locations-th-notes">Notes</div>
                                </div>
                                <div id="locationsTableBody">
                                    <?php getLocations();?>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Schedule - Locations - Info --> 
                    <div id="schedule-locationInfo" class="row scheduleContent">
                        <div class="6u locInfo">
                            <p>Field Name:<br><input type="text" class="locInfo" id="locInfo-name"></p>
                            <p>Field Notes:<br><input type="text" class="locInfo" id="locInfo-notes"></p>
                            <p>Venue Address: &nbsp; <input type="text" class="locInfo" id="locInfo-address" style="width:100%"></p>
                            <input type="hidden" class="locInfo" id="locInfo-lat">
                            <input type="hidden" class="locInfo" id="locInfo-lng">
                            <input type="hidden" class="locInfo" id="locInfo-confirmed">
                        </div>
                        <div class="6u locInfo">
                            <div id="locationMap"></div>
                            <span id="locMapMsg">Select a place to mark the exact location.</span>
                        </div>
                        <p>
                            <button type="button" class="button" id="scheduleBtn-locCancel"><i class="icon fa-undo"></i><br>Cancel Changes</button>
                            <button type="button" class="button" id="scheduleBtn-locSave"><i class="icon fa-save"></i><br>Save Location</button>
                            <button type="button" class="button removeBtn" id="scheduleBtn-locRemove"><i class="icon fa-remove"></i><br>Remove Location</button>
                        </p>
                    </div>
                </div>
<?php }?>
            </section>

            <!-- Roster -->
            <section id="roster" class="three">
                <div class="container">

                    <header>
                        <h2>Roster</h2>
                    </header>
                    <!-- Roster - Main -->
                    <div id="roster-main" class="row rosterContent" style="display:block">
                        <div class="12u">
                            <?php if($userIsAdmin) {
                                echo '<div class="12u"><div id="adminRosterShowWrap"><label for="rosterAdmin-list">Show: &nbsp; </label>';
                                echo '<select id="rosterAdmin-list">'
                                        . '<option value="users">Users</option>'
                                        . '<option value="teams">Teams</option>'
                                   . '</select></div></div><br>';
                                echo '<button type="button" class="button" id="rosterBtn-addUser"><i class="icon fa-user-plus"></i><br>Add User</button>';
                                echo '&nbsp; <button type="button" class="button" id="rosterBtn-addTeam"><i class="icon fa-plus"></i><br>Add Team</button>';
                                echo '&nbsp; <button type="button" class="button" id="rosterBtn-filter"><i class="icon fa-filter"></i><br>Filter <span id="rosterFilterType">Users</span></button>';
                                
                            } else {
                                echo '<button type="button" class="button" id="rosterBtn-addPlayer"><i class="icon fa-user-plus"></i><br>New Player</button>';
                            }?>
                        </div>
                        <?php if($userIsAdmin) {?>
                        <div class="12u" id="roster-filter" style="display:none">
                            <div id="rosterFilter-users" class="rosterFilterWrap">
                                <div class="roster-filter-option">
                                    <label for="roster-filter-rank">Rank: &nbsp; </label>
                                    <select id="roster-filter-rank">
                                        <option value="null">Any</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Coach">Coach</option>
                                        <option value="Player">Player</option>
                                    </select>
                                </div>
                                <div class="roster-filter-option">
                                    <label for="roster-filter-team">Team: &nbsp; </label>
                                    <select id="roster-filter-team">
                                        <option value="null">Any</option>
                                    </select>
                                </div>
                                <div class="roster-filter-option">
                                    <label for="roster-filter-waiver">Waiver: &nbsp; </label>
                                    <select id="roster-filter-waiver">
                                        <option value="null">Any</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div id="rosterFilter-teams" class="rosterFilterWrap">
                                <div class="roster-filter-option">
                                    <label for="roster-filter-division">Division: &nbsp; </label>
                                    <select id="roster-filter-division">
                                        <option value="null">All</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>
                                <div class="roster-filter-option">
                                    <label for="roster-filter-coach">Coach: &nbsp; </label>
                                    <select id="roster-filter-coach">
                                        <option value="null">Any</option>
                                    </select>
                                </div>
                                <div class="roster-filter-option">
                                    <label for="roster-filter-ready">Ready: &nbsp; </label>
                                    <select id="roster-filter-ready">
                                        <option value="null">Any</option>
                                        <option value="YES">Yes</option>
                                        <option value="NO">No</option>
                                    </select>
                                </div>
                            </div>
                            
                        </div>
                        <?php }?>
                        
                        <div id="roster-list">
                            <table id="roster-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <?php if($userIsAdmin) {?>
                                        <th>Rank</th>
                                        <th>Team</th>
                                        <?php } else {?>
                                        <th>Position(s)</th>
                                        <?php }?>
                                        <th>Waiver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php loadRoster($userData); ?>
                                </tbody>
                            </table>
                            <?php if($userIsAdmin) {?>
                            <table id="teams-table" style="display:none">
                                <thead>
                                    <tr>
                                        <th>Team</th>
                                        <th>Division</th>
                                        <th>Coach(es)</th>
                                        <th>Players</th>
                                        <th>Ready</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php rosterTeams(); ?>
                                </tbody>
                            </table>
                            <?php }?>
                        </div>
                    </div>
<?php if($userIsAdmin) {?>
                    <!-- Roster - Add/Edit User  [Admin Only] -->
                    <div id="roster-addEditUser" class="row rosterContent">
                        <p id="rosterUserRemoveWrap">
                            <button type="button" class="button removeBtn" id="rosterBtn-removeUser">
                              <i class="icon fa-remove"></i>
                              <br>
                              Remove User
                            </button>
                        </p>
                        
                        <div class="6u">
                            <p id="adminUserTypeWrap">
                                <label for="rosterUserInfo-Type">User Type:</label>
                                &nbsp;
                                <select id="rosterUserInfo-Type" class="rosterUserInfo">
                                    <option value="Player">Player</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Admin">Administrator</option>
                                </select>
                            </p>
                            <br>
                            <p>
                                <label for="rosterUserFname">First Name:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Fname" class="rosterUserInfo" placeholder="First Name">
                            </p>
                            <p>
                                <label for="rosterUserLname">Last Name:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Lname" class="rosterUserInfo" placeholder="Last Name">
                            </p>
                            <p id="rosterUserInfoNickWrap">
                                <label for="rosterUserNname">Nickname:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Nname" class="rosterUserInfo" placeholder="Leave blank for none">
                            </p>
                            <p style="margin-top:0;display:none">
                                <label for="rosterUserNamePrefer">Go by nickname?</label>
                                &nbsp;
                                <input type="checkbox" id="rosterUserInfo-NamePrefer" class="rosterUserInfo">
                            </p>
                            <p>
                                <label for="rosterUserPhone">Phone:</label>
                                &nbsp;
                                <input type="tel" id="rosterUserInfo-phone" class="rosterUserInfo" placeholder="123-456-7890" pattern="\b\d{3}-\d{3}-\d{4}\b" maxlength="12">
                            </p>
                        </div>
                        <div class="4u">
                            <div id="rosterUserInfoWrap-Player" class="rosterUserInfoWrap" style="display:block">
                                <p style="margin-bottom:20px">
                                    <label for="rosterUserInfo-playerTeam">Team:</label>&nbsp;
                                    <select id="rosterUserInfo-playerTeam" class="rosterUserInfo"></select>
                                </p>
                               <p style="margin-bottom:0">Position(s):</p>
                               <p style="line-height:1.1;text-align:left;padding:0 10%">
                                    <input type="checkbox" id="ruiPos-1stBase" class="rosterUserInfo-position"> <label for="ruiPos-1stBase">1st Base</label>
                                    <span style="float:right;text-align:right">
                                        <input type="checkbox" id="ruiPos-Pitcher" class="rosterUserInfo-position"> <label for="ruiPos-Pitcher">Pitcher</label>
                                    </span>
                                    <br>
                                    <input type="checkbox" id="ruiPos-2ndBase" class="rosterUserInfo-position"> <label for="ruiPos-2ndBase">2nd Base</label>
                                    <span style="float:right;text-align:right">
                                        <input type="checkbox" id="ruiPos-Catcher" class="rosterUserInfo-position"> <label for="ruiPos-Catcher">Catcher</label>
                                    </span>
                                    <br>
                                    <input type="checkbox" id="ruiPos-3rdBase" class="rosterUserInfo-position"> <label for="ruiPos-3rdBase">3rd Base</label>
                                    <span style="float:right;text-align:right">
                                        <input type="checkbox" id="ruiPos-Shortstop" class="rosterUserInfo-position"> <label for="ruiPos-Shortstop">Shortstop</label>
                                    </span>
                                    <br>
                                    <input type="checkbox" id="ruiPos-Outfield" class="rosterUserInfo-position"> <label for="ruiPos-Outfield">Outfield</label>
                                </p>
                                <p>
                                    <label for="rosterUserInfo-playerWaiver">Has Waiver?</label>
                                    &nbsp; 
                                    <input type="checkbox" id="rosterUserInfo-playerWaiver" class="rosterUserInfo">
                                </p>
                            </div>
                            
                            <div id="rosterUserInfoWrap-Coach" class="rosterUserInfoWrap">
                                <p id="adminCoachTeamWrap">
                                    <label for="rosterUserInfo-coachTeam">Team:</label>&nbsp;
                                    <select id="rosterUserInfo-coachTeam" class="rosterUserInfo"></select>
                                </p>
                                <p style="margin-bottom:1em">
                                    <label for="rosterUserInfo-coachWaiver">Signed Coach's Agreement?</label>
                                    &nbsp; 
                                    <input type="checkbox" id="rosterUserInfo-coachWaiver" class="rosterUserInfo">
                                </p>
                                <p>
                                    <label for="rosterUserInfo-cpWaiver">Signed Player Waiver?</label>
                                    &nbsp; 
                                    <input type="checkbox" id="rosterUserInfo-cpWaiver" class="rosterUserInfo">
                                </p>
                            </div>
                            
                            <div id="rosterUserInfoWrap-Admin" class="rosterUserInfoWrap">
                                <p>Administrators have full access privileges to manage all aspects of the website.</p>
                            </div>
                            
                            <p style="margin-top:20px">
                              <input type="text" id="rosterUserInfo-username" class="rosterUserInfo" placeholder="Username" autocomplete="new-password">
                              <br>
                              <input type="password" id="rosterUserInfo-password" class="rosterUserInfo" placeholder="Password" autocomplete="new-password">
                            </p>
                            
                        </div>
                        <p id="rosterUserInfoEmailWrap">  
                            <label for="rosterUserInfo-email">Email:</label>
                            &nbsp;
                            <input type="email" id="rosterUserInfo-email" class="rosterUserInfo" placeholder="Email Address" autocomplete="new-password">
                        </p>
                        <p style="margin-top:20px">
                            <button type="button" class="button" id="rosterBtn-addUserType">
                              <i id="rosterBtn-saveIcon" class="icon fa-user-plus"></i>
                              <br>
                              Save <span id="rosterUserType">Player</span>
                            </button>
                        </p>
                    </div>
                    
                    <div id="roster-addEditTeam" class="row rosterContent">
                        <div class="6u">
                            <div class="ratWrap">
                                <h4>Church or Organization Information</h4>
                                <p>
                                    <input type="text" id="rosterTeamInfo-orgName" class="rosterTeamInfo" placeholder="Name">
                                    <input type="text" id="rosterTeamInfo-orgPhone" class="rosterTeamInfo" placeholder="Phone">
                                </p>
                                <p><input type="text" id="rosterTeamInfo-orgAddress" class="rosterTeamInfo" placeholder="Address"></p>
                            </div>
                            <div class="ratWrap">
                                <h4>Lay Leader Contact Information</h4>
                                <p>
                                    <input type="text" id="rosterTeamInfo-layName" class="rosterTeamInfo" placeholder="Name">
                                    <input type="text" id="rosterTeamInfo-layPhone" class="rosterTeamInfo" placeholder="Phone">
                                </p>
                                <p><input type="text" id="rosterTeamInfo-layEmail" class="rosterTeamInfo" placeholder="Email"></p>
                            </div>
                        </div>
                        <div class="6u">
                            <div class="ratWrap">
                                <h4>Team Information</h4>
                                <p>
                                    <input type="text" id="rosterTeamInfo-teamName" class="rosterTeamInfo" placeholder="Team Name">
                                </p>
                                <p id="rosterTeamInfo-divWrap"><strong>Division:</strong> &nbsp;
                                    <input type="radio" id="rosterTeamInfo-teamDivisionA" name="teamDivision" class="rosterTeamInfo" value="A">
                                    <label for="rosterTeamInfo-teamDivisionA" style="font-weight:bold">A</label>
                                    &nbsp;&nbsp;
                                    <input type="radio" id="rosterTeamInfo-teamDivisionB" name="teamDivision" class="rosterTeamInfo" value="B">
                                    <label for="rosterTeamInfo-teamDivisionB" style="font-weight:bold">B</label>
                                    &nbsp;&nbsp;
                                    <input type="radio" id="rosterTeamInfo-teamDivisionC" name="teamDivision" class="rosterTeamInfo" value="C">
                                    <label for="rosterTeamInfo-teamDivisionC" style="font-weight:bold">C</label>
                                </p>
                                <br>
                                <p id="rosterCoachInfo" style="line-height:1.2">
                                    Coach must be assigned from the "Add User" section after the team has been created.
                                </p>
                            </div>
                            <p id="saveTeamStatus"></p>
                            <p>
                                <button type="button" class="button" id="rosterBtn-saveTeam"><i class="icon fa-save"></i><br>Save Team</button>
                                <button type="button" class="button removeBtn" id="rosterBtn-removeTeam"><i class="icon fa-remove"></i><br>Remove Team</button>
                            </p>
                        </div>
                    </div>
<?php } else {?>
                    <!-- Roster - Add Player (coach) -->
                    <div id="roster-addPlayer" class="row rosterContent">
                        <p id="rosterUserRemoveWrap">
                            <button type="button" class="button removeBtn" id="rosterBtn-removeUser">
                              <i class="icon fa-remove"></i>
                              <br>
                              Remove User
                            </button>
                        </p>
                        <div class="6u">
                            <p>
                                <label for="rosterUserFname">First Name:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Fname" class="rosterUserInfo" placeholder="First Name">
                            </p>
                            <p>
                                <label for="rosterUserLname">Last Name:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Lname" class="rosterUserInfo" placeholder="Last Name">
                            </p>
                            <p id="rosterUserInfoNickWrap">
                                <label for="rosterUserNname">Nickname:</label>
                                &nbsp;
                                <input type="text" id="rosterUserInfo-Nname" class="rosterUserInfo" placeholder="Leave blank for none">
                            </p>
                            <p style="margin-top:0;display:none">
                                <label for="rosterUserNamePrefer">Go by nickname?</label>
                                &nbsp;
                                <input type="checkbox" id="rosterUserInfo-NamePrefer" class="rosterUserInfo">
                            </p>
                            <p>
                                <label for="rosterUserPhone">Phone:</label>
                                &nbsp;
                                <input type="tel" id="rosterUserInfo-phone" class="rosterUserInfo" placeholder="123-456-7890" pattern="\b\d{3}-\d{3}-\d{4}\b" maxlength="12">
                            </p>
                        </div>
                        <div class="4u">
                            <p>Position(s):</p>
                            <p style="line-height:1.1;text-align:left;padding:0 15%">
                                <input type="checkbox" id="ruiPos-1stBase" class="rosterUserInfo-position"> <label for="ruiPos-1stBase">1st Base</label>
                                <span style="float:right;text-align:right">
                                    <input type="checkbox" id="ruiPos-Pitcher" class="rosterUserInfo-position"> <label for="ruiPos-Pitcher">Pitcher</label>
                                </span>
                                <br>
                                <input type="checkbox" id="ruiPos-2ndBase" class="rosterUserInfo-position"> <label for="ruiPos-2ndBase">2nd Base</label>
                                <span style="float:right;text-align:right">
                                    <input type="checkbox" id="ruiPos-Catcher" class="rosterUserInfo-position"> <label for="ruiPos-Catcher">Catcher</label>
                                </span>
                                <br>
                                <input type="checkbox" id="ruiPos-3rdBase" class="rosterUserInfo-position"> <label for="ruiPos-3rdBase">3rd Base</label>
                                <span style="float:right;text-align:right">
                                    <input type="checkbox" id="ruiPos-Shortstop" class="rosterUserInfo-position"> <label for="ruiPos-Shortstop">Shortstop</label>
                                </span>
                                <br>
                                <input type="checkbox" id="ruiPos-Outfield" class="rosterUserInfo-position"> <label for="ruiPos-Outfield">Outfield</label>
                            </p>
                            
                            <input type="hidden" id="rosterUserInfo-playerWaiver" class="rosterUserInfo" value="0">
                            <p style="margin-top:20px">
                              <input type="text" id="rosterUserInfo-username" class="rosterUserInfo" placeholder="Username" autocomplete="new-password">
                              <br>
                              <input type="password" id="rosterUserInfo-password" class="rosterUserInfo" placeholder="Password" autocomplete="new-password">
                            </p>
                            
                        </div>
                        <p style="margin-top:-40px">
                            
                            <label for="rosterUserInfo-email">Email:</label>
                            &nbsp;
                            <input type="email" id="rosterUserInfo-email" class="rosterUserInfo" placeholder="Email Address" autocomplete="new-password">
                        </p>
                        <p>
                          <button type="button" class="button" id="rosterBtn-savePlayer">
                              <i id="rosterBtn-saveIcon" class="icon fa-user-plus"></i>
                              <br>
                              Save Player
                          </button>
                        </p>
                    </div>       
<?php }?>            
                </div>
            </section>
            
            <!-- Team Page -->
            <section id="teampage" class="two">
                <div class="container">

                    <header>
                        <h2>Manage Team Page</h2>
                    </header>
                    <?php if($userIsAdmin) {?>
                    <div id="adminTeamSelectorWrap">
                        <select id="adminTeamSelector">
                            <?php adminTpOptions();?>
                        </select>
                    </div>
                    <?php }?>
                    <div id="manageTeamPageWrap" class="row"<?php if($userIsAdmin) echo ' style="display:none"';?>>
                        <div class="6u">
                            <p>
                                <label for="tpContent">Page Content:</label>
                                <textarea id="tpContent" style="width:90%;min-height:150px;font-size:0.9em">
                                    <?php if(!$userIsAdmin && $userData['team']['tpcontent']!='') {
                                        echo $userData['team']['tpcontent'];
                                    } else {
                                        echo '<p>Content here</p>';
                                    }
                                    ?>
                                </textarea>
                            </p>
                        </div>
                        <div class="6u">
                            <p style="margin-bottom:0">
                                <label for="tpImageFile">Team logo/image:</label> &nbsp; 
                                <button type="button" class="button" id="tpBtn-removeImage"<?php if(!$userIsAdmin && $userData['team']['tpimg']!='') echo ' style="display:inline"';?>>
                                    <i class="icon fa-remove"></i> Remove Image
                                </button>
                                
                            </p>
                            <div id="tpImgWrap">
                                <div id="tpImageFileWrap"<?php if(!$userIsAdmin && $userData['team']['tpimg']!='') echo ' style="display:none"'?>>
                                    <form id="imgUpForm">
                                        <input type="file" id="tpImageFile" accept="image/*">
                                    </form>
                                    <br>
                                    <span id="tpImgStatus"></span>
                                </div>
                                <?php if(!$userIsAdmin && $userData['team']['tpimg']!='') {
                                    echo '<img src="'.$userData['team']['tpimg'].'" />';
                                }?>
                            </div>
                            <p style="clear:both">
                                <label for="tpSlogan">Slogan / Caption:</label>
                                <input type="text" id="tpSlogan" style="width: 90%"<?php if(!$userIsAdmin) echo ' value="'.$userData['team']['tpslogan'].'"';?>>
                            </p>
                        </div>
                        <p style="text-align:center;width:100%;">
                            <button type="button" class="button" id="tpBtn-saveChanges"><i class="icon fa-save"></i><br>Save Changes</button>
                            <br>
                            <span id="tpStatus"></span>
                        </p>
                    </div>                      
                </div>
            </section>
            
            <!-- News Page -->
            <section id="news" class="three" style="display:none">
                <div class="container">

                    <header>
                        <h2>News</h2>
                    </header>
                  
                    <p>News post functionality will be added here soon.</p>
                </div>
            </section>
<?php if($userIsAdmin) {
    // Get site content from database
    $siteContent = getSiteContent();
?>             
            <!-- Content Page -->
            <section id="content" class="two">
                <div class="container">

                    <header>
                        <h2>Site Content</h2>
                    </header>
                    <div class="row">
                        <div class="12u" id="contentSubList">
                            <ul>
                                <li class="selected">Home Page</li>
                                <li>Info Page</li>
                            </ul>
                        </div>
                    </div>
                    <div class="row contentSub" id="content-home">
                        <div class="12u" style="padding-top:0">
                            <label for="siteContent-home-homeBlurb">Intro blurb:</label>
                            <br>
                            <textarea id="siteContent-home-homeBlurb" style="width:80%;min-height:150px;font-size:0.9em">
                                <?php echo $siteContent['home']['homeBlurb'];?>
                            </textarea>
                        </div>
                    </div>
                    <div class="row contentSub" id="content-info" style="display:none">
                        <div class="4u" style="padding-top:0">
                            <p style="margin-bottom:1em">Select a sub-page:</p>
                            <ul id="infoContentSub">
                                <li class="selected">About Us</li>
                                <li>Locations</li>
                                <li>Rules</li>
                            </ul>
                        </div>
                        <div class="8u" style="padding-top:0;text-align:left;">
                            <div id="contentInfo-aboutus" class="contentInfoWrap">
                                <label for="siteContent-info-aboutus"><strong>About Us</strong> Content:</label>
                                <br>
                                <textarea id="siteContent-info-aboutus" style="width:80%;min-height:150px;font-size:0.9em">
                                    <?php echo $siteContent['info']['aboutus'];?>
                                </textarea>
                            </div>
                            <div id="contentInfo-locations" class="contentInfoWrap" style="display:none">
                                <label for="siteContent-info-locations"><strong>Locations</strong> Content:</label>
                                <br>
                                <textarea id="siteContent-info-locations" style="width:80%;min-height:150px;font-size:0.9em">
                                    <?php echo $siteContent['info']['locations'];?>
                                </textarea>
                            </div>
                            <div id="contentInfo-rules" class="contentInfoWrap" style="display:none">
                                <label for="siteContent-info-rules"><strong>Rules</strong> Content:</label>
                                <br>
                                <textarea id="siteContent-info-rules" style="width:80%;min-height:150px;font-size:0.9em">
                                    <?php echo $siteContent['info']['rules'];?>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="12u">
                            <button type="button" id="btnSaveSiteContent">&nbsp; <i class="icon fa-save"></i> &nbsp; Save Content</button>
                            <p id="saveSiteContentStatus">&nbsp;</p>
                        </div>
                    </div>
                </div>
            </section>
<?php }?>
        </div>

        <!-- Footer -->
        <div id="footer">

            <!-- Copyright -->
            <ul class="copyright">
                <li>&copy; 2017-2019 Northside Christian Softball League.</li>
            </ul>

        </div>

        <!-- Scripts -->
        <script src="assets/js/jquery.min.js"></script>
        <script src="assets/js/jquery.scrolly.min.js"></script>
        <script src="assets/js/jquery.scrollzer.min.js"></script>
        <script src="assets/js/skel.min.js"></script>
        <script src="assets/js/util.js"></script>
        <!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
        <script src="assets/ckeditor/ckeditor.js"></script>
        <script>CKEDITOR.timestamp = '051019';</script>
        <script src="assets/ckeditor/styles.js"></script>
        <script src="assets/js/main.js"></script>
<?php if($userIsAdmin) {?>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBwKDFXAxINOWM2OpsDbgoMj0dfrq5YTyY&libraries=places&callback=initMap" type="text/javascript" async defer></script>
        <script src="assets/js/admin.js"></script>
        <!-- Admin only CSS overrides -->
        <style type="text/css">
            .adminEditable {
                cursor: pointer;
            }
            .adminEditable:hover {
                background-color: #333;
                color: #EEE;
            }
            
        </style>
<?php }?>
    </body>
</html>
<?php } else {
    if(count($_GET) > 0) {
        echo 'relogin';
        exit();
    }
$pageTitle = 'adminRestricted';
include('../header.php');
?>
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
                            <h2>Restricted Area</h2>
                        </header>
                        <p>Authorized personnel only.</p>
                        <p>Enter your credentials below:</p>
                        <form id="loginForm" onsubmit="loginSubmit(event)">
                        <p>
                            <label for="username">Username: </label>
                            <input type="text" id="username" name="username">
                        </p>
                        <p>
                            <label for="password">Password: </label>
                            <input type="password" id="password" name="password">
                        </p>
                        <p><button type="submit" id="btnloginSubmit">Login</button></p>
                        </form>
                    </section>
                  </div>
                </div>
            </div>
        </div>
    </div>
  </div>

<?php }
?>
