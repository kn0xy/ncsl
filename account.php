<?php
include('header.php');
if($loggedIn) {
    include('db.php');
    $adminPanel = false;
    $userId = $_SESSION['userId'];
    $checkUserRank = mysqli_query($knoxyConn, "SELECT username,email,phone,fname,lname,nickname,prefernick,rank FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
    $userRankResult = mysqli_fetch_assoc($checkUserRank);
    $userName = $userRankResult['username'];
    $userEmail = $userRankResult['email'];
    $userPhone = $userRankResult['phone'];
    $userFname = $userRankResult['fname'];
    $userLname = $userRankResult['lname'];
    $userNick = $userRankResult['nickname'];
    $userPrefer = $userRankResult['prefernick'];
    $userRank = $userRankResult['rank'];
    
    
    if(isset($_GET['update'])) {
        $uUsername = addslashes(trim($_POST['Username']));
        $uPassword = (isset($_POST['Password']) ? md5($_POST['Password']) : false);
        $uEmail = addslashes(trim($_POST['Email']));
        $uPhone = addslashes(trim($_POST['Phone']));
        $uFname = addslashes(trim($_POST['Fname']));
        $uLname = addslashes(trim($_POST['Lname']));
        $uNickname = addslashes(trim($_POST['Nickname']));
        $uPrefer = intval($_POST['PreferNick']);

        // Check if username is already taken
        if($uUsername != $userName) {
            $cunq = mysqli_query($knoxyConn, "SELECT id FROM users WHERE username='$uUsername'") or die(mysqli_error($knoxyConn));
            if(mysqli_num_rows($cunq)) die('That username is already registered!');
        }
        
        // Check if email is already taken
        if($uEmail != $userEmail) {
            $ceq = mysqli_query($knoxyConn, "SELECT id FROM users WHERE email='$uEmail'") or die(mysqli_error($knoxyConn));
            if(mysqli_num_rows($ceq)) die('That email address is already registered!');
        }
        
        // Check which fields need to be updated
        $updateFields = [];
        if($uUsername != $userName) $updateFields['username'] = "'".$uUsername."'";
        if($uPassword) $updateFields['password'] = "'".$uPassword."'";
        if($uEmail != $userEmail) $updateFields['email'] = "'".$uEmail."'";       
        if($uPhone != $userPhone) $updateFields['phone'] = "'".$uPhone."'"; 
        if($uFname != $userFname) $updateFields['fname'] = "'".$uFname."'"; 
        if($uLname != $userLname) $updateFields['lname'] = "'".$uLname."'"; 
        if($uNickname != $userNick) $updateFields['nickname'] = "'".$uNickname."'"; 
        if(intval($uPrefer) != intval($userPrefer)) $updateFields['prefernick'] = $uPrefer; 
        
        // Update database
        if(count($updateFields)) {
            $updateQuery = "UPDATE users SET ";
            foreach($updateFields as $field=>$val) {
                $updateQuery .= $field.'='.$val.', ';
            }
            $updateQuery = substr($updateQuery, 0, strlen($updateQuery)-2) . " WHERE id=$userId";
            mysqli_query($knoxyConn, $updateQuery) or die(mysqli_error($knoxyConn));
        }
        echo 'success';
        exit();
    }
    
    
    $pageTitle = "Account";
    include('header.php');
    if($userRank=='Admin' || $userRank=='Coach') $adminPanel = true;
    
    if(!$ajaxNavRequest) {
?>
    <!-- Main -->
    <div id="mainContentWrapper">
<?php }?>
      <div id="main"<?php if($ajaxNavRequest) echo ' style="display:none"';?>>
        <div class="container">
            <div class="row"> 
                <!-- Content -->
                <div id="content" class="12u skel-cell-important">
                    <section>
                        <header>
                            <h2>My Account</h2>
                            <span class="byline"><?php echo ($userPrefer==0 ? $userFname.' '.$userLname : $userNick);?></span>
                        </header>
                        <p>
                            <button type="button" id="logoutBtn">
                                <i class="fa fa-hand-peace-o"></i>
                                <span>Logout</span>
                            </button> &nbsp; &nbsp; &nbsp;
                            <?php if($adminPanel) echo '<button type="button" onclick="window.location=\'admin\';">Admin Dashboard</button>';?>
                        </p>
                        <br>
                        <div class="row">
                            <div class="3u">
                                <p>
                                    <label for="myAccountUsername">Username: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountUsername" value="<?php echo $userName;?>">
                                </p>
                                <p>
                                    <label for="myAccountPassword">Password: </label><br>
                                    <input type="password" class="myAccInfo" id="myAccountPassword" placeholder="Leave blank if unchanged" autocomplete="new-password">
                                </p>
                                <p>
                                    <label for="myAccountEmail">Email: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountEmail" value="<?php echo $userEmail;?>">
                                </p>
                                <p>
                                    <label for="myAccountPhone">Phone: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountPhone" value="<?php echo $userPhone;?>">
                                </p>
                            </div>
                            <div class="3u">
                                <p>
                                    <label for="myAccountFname">First Name: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountFname" value="<?php echo $userFname;?>">
                                </p>
                                <p>
                                    <label for="myAccountLname">Last Name: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountLname" value="<?php echo $userLname;?>">
                                </p>
                                <p>
                                    <label for="myAccountNickname">Nickname: </label><br>
                                    <input type="text" class="myAccInfo" id="myAccountNickname" value="<?php echo $userNick;?>" placeholder="Leave blank for none">
                                    <br>
                                    <input type="checkbox" class="myAccInfo" id="myAccountPreferNick" <?php if($userPrefer==1) echo 'checked';?>>
                                    <label for="myAccountPreferNick">Prefer nickname?</label>
                                </p>
                            </div>
                        </div>
                            
                        <br>
                        <span id="updateAccountStatus"></span>
                        <p><button type="button" id="btnUpdateAccount">
                                <i class="fa fa-info-circle"></i>
                                <span>Update Account Details</span>
                           </button></p>
                        <br><br>
                        
                        
                    </section>
                </div>
            </div>
        </div>
      </div>
<?php if(!$ajaxNavRequest) echo '     </div>'."\n";

include('footer.php');
} else {
    header("Location: ./");
}
?>