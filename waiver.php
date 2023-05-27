<?php

function ordinal($number) {
    $ends = array('th','st','nd','rd','th','th','th','th','th','th');
    if ((($number % 100) >= 11) && (($number%100) <= 13))
        return $number. 'th';
    else
        return $number. $ends[$number % 10];
}
$waiverDay = ordinal(date("j"));
$waiverMonth = date("F");
$waiverYear = date("Y");


$playerWaiver = <<<EOPW
     <h2 style="text-decoration:underline">RELEASE OF ALL CLAIMS AND HOLD HARMLESS</h2>
     <br>

<p>For and in consideration of the mutual covenants and agreements, and other good and valuable consideration,

the receipt and sufficiency of which are hereby acknowledged, the undersigned hereby forever releases, discharges and

agrees to hold harmless, Northview Christian Life Church, Inc. (“NVCL”), Castleview Baptist Church (“CBC”),

Crossroads Community Church (“CCC”) and the Northside Christian Softball League (the “League”), its league board,

its heirs, executors, administrators, agents, and assigns, of and from any and all manner of actions, causes of action,

suits, accounts, contracts, debts, claims, losses, injuries including death, damages and demands whatsoever, at law or in

equity, known or unknown, now existing or hereinafter arising, including particularly, but not exclusively, all matters

that were asserted, or could be asserted as a participant, in any capacity, in the League or by entering upon the property

and/or premises of NVCL, CBC, or CCC while participating in the League or League sponsored event.</p>



<p>The undersigned hereby understands and acknowledges that there are inherent risks and hazards as a

participant, in any capacity, in the League or by entering upon the property and/or premises of NVCL, CBC, or CCC

while participating in the League or League sponsored event but nonetheless agrees and does hereby agree to

voluntarily assume such risks and hazards associated therewith whether described above or otherwise.</p>



<p>It is further understood and agreed that this Release and Hold Harmless extends to all claims of every nature

and kind whatsoever, known or unknown, suspected or unsuspected, and that the undersigned is executing this Release

and Hold Harmless voluntarily, and if a minor, upon and with the consent and approval of his parent or guardian, and

not upon the representations of the parties released.</p>



<p>Further, the undersigned represents:</p>


<ul class="waiverList">

    <li>(1) that he is at least 16 years of age</li>

    <li>(2) that he has read and understood this Release and Hold Harmless, and if so requested, has been given an

    opportunity to consult with legal counsel prior to signing this document, and based upon such

    understanding and/or legal consultation, as signified by his or her signature hereto, is satisfied with and

    agrees to be bound by the terms of this Release and Hold Harmless, and</li>

    <li>(3) that if he is a minor, the parent or guardian of such minor consents and approves of the minor’s

    participation in the League or League sponsored events and agrees to be bound by the terms hereof for

    and on behalf of such minor.</li>

    <li>(4) That he agrees to fully defend and hold NVCL, CBC, CCC, and/or the League, harmless for principal,

    interest, court costs and reasonable attorney fees, together with any judgment rendered against any or all

    of them by virtue of the undersigned’s participation in the League or a League sponsored event, and an

    action or claim being brought against NVCL, CBC, CCC, and/or the League.</li>
</ul>       
<br>
<p>IN WITNESS WHEREOF, the undersigned, individually or as parent or guardian of such minor has set 
his or her hand this <strong style="text-decoration:underline">$waiverDay</strong> day of 
<strong style="text-decoration:underline">$waiverMonth, $waiverYear</strong>.</p>
EOPW;



$coachWaiver = <<<EOCW
    <h2 style="text-decoration:underline">Head Coach Agreement</h2>
    <br>
    <p>
        <strong>Overview</strong>
        <br>

        The objective of this agreement is to protect all participants and ensure that everyone is provided a

        quality experience that meets the goals and objectives of the Northside Christian Softball League. It

        is also to provide the Head Coach with an explanation of the expectations placed on him/her.
    </p>
        
    <p style="margin-bottom:1em"><strong>Expectations of Christian Character:</strong></p>
    <ul>
        <li>Is a professing Christian and actively involved in the church they represent as a Head Coach.</li>
        <li>Is a positive witness for Christ both on and off the field.</li>
        <li>Exhibits maturity in Christ-like character during competition, including, but not limited to, patience, 
            humility, integrity, respect for authority and fellow competitors, and a willingness to listen.</li>
        <li>Leads his/her team in representing Christ well in competition.</li>
    </ul>

    <p style="margin-bottom:1em"><strong>Expectations of Coaching Responsibilities:</strong></p>
    <ul>
        <li>Is directly accountable to the NCSL Leadership Board.</li>
        <li>Reads the league rules and demonstrates integrity in enforcing them.</li>
        <li>Obtains signed liability waivers for all participants prior to their involvement in any NCSL activities.</li>
        <li>Is responsible for the care and maintenance of all league supplied equipment and facilities.</li>
        <li>Communicates well with opposing coaches regarding forfeits and weather issues.</li>
        <li>Communicates well with team regarding scheduled league activities.</li>
    </ul>

<p>The mission of this league is to honor God by being a good witness for Christ to our teams,

opponents, and any spectators. The Head Coach is called to lead his/her team in fulfilling that

mission. In light of that, we encourage coaches, in addition to the expectations stated above, to set

up devotions at each game, to pray for his team members as a part of his normal prayer life, and to

seek to foster an atmosphere on his/her team of mutual encouragement, accountability, and growth.</p>

<p><strong>Agreement</strong>
<br>
I have carefully read and fully understand the responsibilities as a Northside Christian Softball

League Head Coach and will fulfill these duties as described.</p>
        
        
EOCW;



if(isset($_GET['waiver']) && $loggedIn) {
    include('db.php');
    $gfnq = mysqli_query($knoxyConn, "SELECT fname,lname FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
    $gfnr = mysqli_fetch_assoc($gfnq);
    $waiverFullName = $gfnr['fname'].' '.$gfnr['lname'];
    $waiverTitle;
    if($userRank=='Player') $waiverTitle = 'Player Agreement';
    if($userRank=='Coach') {
        if($userWaiver==0) {
            $waiverTitle = 'Coach Agreement &amp; Player Agreement';
        } elseif($userWaiver==1) {
            $waiverTitle = 'Player Waiver';
        } elseif($userWaiver==2) {
            $waiverTitle = 'Coach Agreement';
        }
    }
?>
    <!-- Main -->
    <div id="mainContentWrapper">
        <div id="main" class="<?php echo $pageTitle;?>">
            <div class="container">
                <div class="row">
                    <div id="content" class="4u">
                        <section>
                            <header>
                                <h2>Waiver</h2>
                                <span class="byline"><?php echo $waiverTitle;?></span>
                            </header>
                        </section>
                    </div>
                    <div class="8u">
                        <p id="waiverText">You must agree to these terms to continue!</p>
                    </div>
                </div>
                <div class="row">
                    <div class="12u" id="waiverContent">
                      <?php if($userRank == 'Player') {
                        echo $playerWaiver;
                       } else {?>
                        <style>
                            #cwsWrap {
                                border: 1px solid #CCC;
                                width: 300px;
                                padding: 5px;
                                margin: 20px auto; 
                                background-color: #ECECEC;
                                text-align: center;
                            }
                            #cwsWrap span {
                                text-decoration: underline;
                                cursor: pointer;
                            }
                            .cwSelected { 
                                font-weight: bold;
                                text-decoration: none !important;
                                cursor: default !important;
                            }
                            .wcc {
                                display: none;
                            }
                            .wcc ul {
                                list-style: disc;
                                margin-left: 25px;
                            }
                            #wccCoach p {
                                text-indent: 0;
                            }
                        </style>
                        <script>
                            $('body').on('click', '#cwsWrap span', function() {
                                if(!$(this).hasClass('cwSelected')) {
                                    var cwsVal = $(this).prop('id').split('-')[1];
                                    var content = '#wcc'+cwsVal;
                                    $('.cwSelected').removeClass('cwSelected');
                                    $(this).addClass('cwSelected');
                                    $('#coachWaiverSelected').val(cwsVal);
                                    $('.wcc').hide();
                                    $(content).show();
                                    if($(this).css('color')==='green' || $(this).css('color')==='rgb(0, 128, 0)') {
                                        $('#signWrapper').hide();
                                    } else {
                                        console.log($(this).css('color'));
                                        $('#signWrapper').show();
                                    }
                                    $('#signWaiverBox').val('');
                                }
                            });
                        </script>
                        <div id="cwsWrap">
                            <span id="cws-Coach" class="cwSelected"<?php if($userWaiver==1||$userWaiver==3) echo ' style="color:green"';?>>
                                Coach's Agreement
                            </span>
                            &nbsp; &bull; &nbsp;
                            <span id="cws-Player"<?php if($userWaiver==2||$userWaiver==3) echo ' style="color:green"';?>>
                                Player Waiver
                            </span> 
                            <input type="hidden" id="coachWaiverSelected" value="Coach">
                        </div>
                        <div id="wccCoach" class="wcc" style="display:block">
                            <?php if($userWaiver==1 || $userWaiver==3) {
                                echo '<p>Head Coach Agreement already signed!</p>';
                            } else {
                                echo $coachWaiver;
                            }?>
                        </div>
                        <div id="wccPlayer" class="wcc">
                            <?php if($userWaiver==2 || $userWaiver==3) {
                                echo '<p>Player release waiver already signed!</p>';
                            } else {
                                echo $playerWaiver;
                            }?>
                        </div>
                       <?php }?>
                    </div>
                </div>
                <div class="row">
                    <div class="12u">
                        <div id="signWrapper"<?php if($userWaiver >= 1) echo ' style="display:none"';?>>
                            <p style="text-align:center">
                                By entering your name in the text box below, you acknowledge and accept the terms:<br>
                                <input type="text" id="signWaiverBox" placeholder="<?php echo $waiverFullName;?>"><br>
                            </p>
                            <?php if($userRank == 'Player') {?>
                            <p style="text-align:center">
                                <input type="checkbox" id="signWaiverMinor"> 
                                <label for="signWaiverMinor" style="font-style:italic">I am signing on behalf of a minor</label>
                                <span id="waiverMinorNameWrap">
                                    <br>
                                    <input type="text" id="waiverMinorName" placeholder="<?php echo $waiverFullName;?>">                                
                                </span>
                                <script>
                                    $('#signWaiverMinor').on('change', function() {
                                        if($(this).prop('checked')) {
                                            $(this).next('label').css('fontWeight', 'bold');
                                            $('#waiverMinorNameWrap').fadeIn();
                                            $('#signWaiverBox').prop('placeholder', 'Parent/Guardian Signature');
                                            $('#waiverMinorName').prop('placeholder', '<?php echo $waiverFullName;?>');
                                        } else {
                                            $('#waiverMinorNameWrap').fadeOut();
                                            $(this).next('label').css('fontWeight', 'normal');
                                            $('#signWaiverBox').prop('placeholder', '<?php echo $waiverFullName;?>');
                                            $('#waiverMinorName').prop('placeholder', 'Name of Minor');
                                        }
                                    });
                                </script>
                            </p>
                            <?php } ?>
                            <p style="text-align:center">
                                <button type="button" id="signWaiverBtn">I Agree</button>
                                <script>
                                    $('body').on('click', '#signWaiverBtn', function() {
                                        var wData = {
                                            signature: $('#signWaiverBox').val(),
                                            isminor: false,
                                            minorname: ''
                                        };
                                        <?php if($userRank=='Player') {
                                            echo "wData.isminor = $('#signWaiverMinor').prop('checked');";
                                            echo "wData.minorname = $('#waiverMinorName').val();";
                                        } else {
                                            echo "wData.wtype = $('#coachWaiverSelected').val();";
                                        }?>
                                        $.ajax({
                                            type: "POST",
                                            url: '?signWaiver',
                                            data: wData,
                                            success: function(result) {
                                                var Result = result.trim();
                                                if(Result.indexOf('success::') !== -1) {
                                                    var waiverStatus = parseInt(Result.split('::')[1]);
                                                    if(waiverStatus===1) {
                                                        // Coach waiver signed
                                                        $('#cws-Coach').css('color', 'green');
                                                        $('#signWrapper').hide();
                                                        $('#wccCoach').slideToggle(function() {
                                                            $(this).html('<p>Head Coach Agreement signed!</p>').show();
                                                        });
                                                    } else if(waiverStatus===2) {
                                                        // Player waiver signed
                                                        $('#cws-Player').css('color', 'green');
                                                        $('#wccPlayer').slideToggle(function() {
                                                            $(this).html('<p>Player waiver signed!</p>').show();
                                                        });
                                                    } else if(waiverStatus===3) {
                                                        // Both signed
                                                        window.location = '<?php echo $ncslBaseUrl;?>';
                                                    }
                                                    return;
                                                }

                                                if(Result !== 'success') {
                                                    if(Result==='signature') {
                                                        $('#signWaiverBox').addClass('hasError');
                                                    } else if(Result==='minor') {
                                                        $('#waiverMinorName').addClass('hasError');
                                                    } else {
                                                        console.log('wtf: '+Result);
                                                    }
                                                    $('<p style="color:red" id="waiverStatus">Invalid signature!</p>').insertAfter($('#signWaiverBtn').parent());
                                                    setTimeout(function() {
                                                        $('#waiverStatus').fadeOut(function() {
                                                            $(this).remove();
                                                        });
                                                    }, 1500);
                                                } else {
                                                    window.location = '<?php echo $ncslBaseUrl;?>';
                                                }
                                            }
                                        });
                                    });
                                </script>
                            </p>
                        </div>
                        <br><br>
                        <p>If you do not agree with the above terms and do not wish to continue, you can 
                            <a href="#" id="logoutBtn" style="padding: 0 1px">log out and return to the public site</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php
    include('footer.php');
    exit();
}

if(isset($_GET['signWaiver'])) {
    include('db.php');
    // Check that signature matches registered name
    $signature = addslashes($_POST['signature']);
    $isMinor = $_POST['isminor'];
    $minorName = addslashes($_POST['minorname']);
    $getName = mysqli_query($knoxyConn, "SELECT fname,lname FROM users WHERE id=$userId") or die(mysqli_error($knoxyConn));
    $nameResult = mysqli_fetch_assoc($getName);
    $correct = $nameResult['fname'].' '.$nameResult['lname'];
    $sigToCheck = ($isMinor=='true' ? $minorName : $signature);
    if(strtolower($sigToCheck) == strtolower($correct)) {
        // add waiver to database
        $wType = ($userRank=='Player' ? $userRank : addslashes($_POST['wtype']));
        $wDate = date("Y-m-d");
        $wMinor = ($isMinor=='true' ? 1 : 0);
        $addWaiverSql = "INSERT INTO waivers(user,wtype,wdate,signature,isminor) VALUES ($userId, '$wType', '$wDate', '$signature', $wMinor)";
        mysqli_query($knoxyConn, $addWaiverSql) or die(mysqli_error($knoxyConn));
        
        // update haswaiver value in the database
        $hwVal = 1;
        if($userRank=='Coach') {
            $hwv = ($wType=='Player' ? 2 : 1);
            $hwVal = intval($userWaiver) + $hwv;
        }
        mysqli_query($knoxyConn, "UPDATE users SET haswaiver=$hwVal WHERE id=$userId") or die(mysqli_error($knoxyConn));
        $_SESSION['userWaiver'] = $hwVal;
        echo 'success';
        if($userRank=='Coach') echo '::'.$hwVal;
    } else {
        $swError = ($isMinor=='true' ? 'minor' : 'signature');
        echo $swError;
    }
    exit();
}
?>
