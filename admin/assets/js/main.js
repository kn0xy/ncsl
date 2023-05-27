/* Globals */
var userIsAdmin = false;
var scheduleInitialized = false;
var scheduleSub = null;
var tpImageUploadFile;

function logout() {
    $.ajax({
        type: "GET",
        url: "../ncsl.php?logout",
        success: function(result) {
            result = result.trim();
            if (result === 'success') {
                window.location = 'https://www.knoxy.tk/portfolio/ncsl';
            } else {
                alert('An unexpected server communication error occured. Please refresh the page and try again.');
            }
        }
    });
}

function initNotifications() {
    if(userIsAdmin) {
        initAdminNotifications();
    } else {
        $('#coachNotifications').empty();
        
        var notifications = 0;
        var minPlayers = 9;
        var numPlayers = $('.rosterRow').length;
        var gamesPlayed = 0;
        var noScore = [];
        var noWaiver = [];
        var noPosition = [];
        
 
        // Analyze schedule
        $('#schedule-table').children('tbody').children('tr').each(function() {
            var id = $(this).prop('id');
            var gt = $(this).children('.gametime').val().split(':');
            var gd = $(this).children('.gamedate').val().split('-');
            var gdt = new Date(parseInt(gd[0]), parseInt(gd[1])-1, parseInt(gd[2]), parseInt(gt[0]), parseInt(gt[1]));
            var played = (Date.now() > gdt.getTime() ? true : false);
            var score = $(this).children('.scheduleRow-score').text();
            if(played) {
                gamesPlayed++;
                if(score === 'Post') noScore.push(id);
            }
        });
        
        // Analyze roster
        $('.rosterRow').each(function() {
            var userDisplay = $(this).children('.rosterVal-display').text();
            var position = $(this).children('.rosterVal-position').text();
            var waiver = $(this).children('.rosterVal-waiver').text();
            
            if(position === 'None') noPosition.push(userDisplay);
            if(waiver === 'NO') noWaiver.push(userDisplay);
        });
        
        // Add "too few players" alert
        if(numPlayers < minPlayers) {
            var tfpWrap = document.createElement('p');
            var tfpHtml = '* Fewer than '+minPlayers+' players exist!';
            $(tfpWrap).addClass('coachAlert').html(tfpHtml).appendTo('#coachNotifications');
            notifications++;
        }
        
        // Add "no waiver" alert
        if(noWaiver.length > 0) {
            var nwWrap = document.createElement('p');
            var nwHtml = '* '+noWaiver.length+' '+(noWaiver.length===1 ? 'player has' : 'players have')+' not signed waiver!';
            var nwList = document.createElement('ul');
            for(var p=0; p<noWaiver.length; p++) {
                var nwListHtml = '<li><span style="font-weight:bold">- '+noWaiver[p]+'</span></li>';
                $(nwListHtml).appendTo(nwList);
            }
            $(nwWrap).addClass('coachAlert').addClass('caToggleList').html(nwHtml).appendTo('#coachNotifications');
            $(nwList).addClass('caList').appendTo('#coachNotifications');
            notifications++;
        }
        
        // Add "no position" alert
        if(noPosition.length > 0) {
            var npWrap = document.createElement('p');
            var npHtml = '* '+noPosition.length+' '+(noPosition.length===1 ? 'player has' : 'players have')+' no assigned position(s)!';
            var npList = document.createElement('ul');
            for(var p=0; p<noPosition.length; p++) {
                var npListHtml = '<li><span style="font-weight:bold">- '+noPosition[p]+'</span></li>';
                $(npListHtml).appendTo(npList);
            }
            $(npWrap).addClass('coachAlert').addClass('caToggleList').html(npHtml).appendTo('#coachNotifications');
            $(npList).addClass('caList').appendTo('#coachNotifications');
            notifications++;
        }
        
        // Add "no score" alert
        if(noScore.length > 0) {
            var nsWrap = document.createElement('p');
            var nsHtml = '* '+noScore.length+' played '+(noScore.length===1 ? 'game has' : 'games have')+' no posted score!';
            $(nsWrap).addClass('coachAlert').addClass('gMissingScore').prop('id', 'ga-'+noScore[0]).html(nsHtml).appendTo('#coachNotifications');
            notifications++;
        }
        
        if(notifications === 0) {
            $('<p>No notifications to display!</p>').appendTo('#coachNotifications');
        }
        
        
        
        // Number of players stat
        $('#coachNumPlayers').html(numPlayers);
        
        // Games played stat
        $('#coachGamesPlayed').html(gamesPlayed+' / '+$('#schedule-table').children('tbody').children('tr').length);
        
        // Signed waivers stat
        var signedWaivers = numPlayers - noWaiver.length;
        $('#coachNumWaivers').html(signedWaivers+' / '+numPlayers);
    }
}

function initSchedule(reInit) {
    var myTeam = 'null';
    var teams = [];
    var days = [];
    var fields = [];
    var tableRows = $('#schedule-table tbody').children('tr');
    if(reInit) {
        var teamSelected = $('#schedule-filter-team').val();
        var daySelected = $('#schedule-filter-day').val();
        var fieldSelected = $('#schedule-filter-field').val();
    }
    $('#schedule-filter-team').html('<option value="null">Any</option>');
    $('#schedule-filter-day').html('<option value="null">Any</option>');
    $('#schedule-filter-field').html('<option value="null">Any</option>');
    
    if($('#logo').children('p:nth-of-type(2)').html() !== 'Northside Christian Softball League') {
        myTeam = $('#logo').children('p:nth-of-type(2)').html();
    }
  
    for(var row=0;row<tableRows.length;row++) {
        var thisRow = tableRows[row];
        var rWho = $(thisRow).children('.scheduleRow-who').html();
        var rWhen = $(thisRow).children('.scheduleRow-when').html();
        var rWhere = $(thisRow).children('.scheduleRow-where').html();
        var theseTeams = rWho.split(' &nbsp; vs. &nbsp; ');
        var team1 = theseTeams[0];
        var team2 = theseTeams[1];
        var thisDay = rWhen.substr(0, rWhen.indexOf(','));
        
        if(teams.indexOf(team1) === -1 && team1 !== myTeam) teams.push(team1);
        if(teams.indexOf(team2) === -1 && team2 !== myTeam) teams.push(team2);
        if(days.indexOf(thisDay) === -1) days.push(thisDay);
        if(fields.indexOf(rWhere) === -1) fields.push(rWhere);
    }
    for(var t=0;t<teams.length;t++) {
        var tOpt = '<option value="'+teams[t]+'"';
        if(reInit && teamSelected !== 'null') {
            if(teams[t] === teamSelected) tOpt += ' selected';
        }
        tOpt += '>'+teams[t]+'</option>';
        $('#schedule-filter-team').append(tOpt);
    }
    for(var d=0;d<days.length;d++) {
        var dOpt = '<option value="'+days[d]+'"';
        if(reInit && daySelected !== 'null') {
            if(days[d] === daySelected) dOpt += ' selected';
        }
        dOpt += '>'+days[d]+'</option>';
        $('#schedule-filter-day').append(dOpt);
        
    }
    for(var f=0;f<fields.length;f++) {
        var fOpt = '<option value="'+fields[f]+'"';
        if(reInit && fieldSelected !== 'null') {
            if(fields[f] === fieldSelected) fOpt += ' selected';
        }
        fOpt += '>'+fields[f]+'</option>';
        $('#schedule-filter-field').append(fOpt);
    }
    
    scheduleInitialized = true;
}

function resetSchedule() {
    $('#schedule header h2').html('Schedule');
    $('#schedule .section-buttons:hidden').slideToggle().children('.button').css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75').removeAttr('disabled');
    $('.scheduleContent:visible').slideToggle(function() {
        $('#schedule-list').slideToggle();
    });
    
    // Reset filter
    $('#schedule-filter-division').val("null");
    $('#schedule-filter-team').val("null");
    $('#schedule-filter-day').val("null");
    $('#schedule-filter-field').val("null");
    $('#schedule-table tbody tr').show();
    
    $('.dnWrap').fadeIn();
}

function filterSchedule() {
    $('#schedule-table tbody tr').show();
    
    if(userIsAdmin) {
        var fDivision = $('#schedule-filter-division').val();
        
        if(fDivision !== 'null') {
            $('.scheduleRow-division').each(function() {
                if($(this).html() !== fDivision) $(this).parent().hide();
            });
        } else {
            $('#schedule-table tbody tr').show();
        }
    }
    
    var fTeam = $('#schedule-filter-team').val();
    var fDay = $('#schedule-filter-day').val();
    var fField = $('#schedule-filter-field').val();
    
    $('#schedule-table tbody tr:visible').each(function() {
        var rWho = $(this).children('.scheduleRow-who').html();
        var rWhen = $(this).children('.scheduleRow-when').html();
        var rWhere = $(this).children('.scheduleRow-where').html();
        var teamMatch, dayMatch, fieldMatch = false;
        
        if(fTeam !== 'null') {
            if(rWho.indexOf(fTeam) !== -1) teamMatch = true;
        } else {
            teamMatch = true;
        }
        
        if(fDay !== 'null') {
            if(rWhen.substr(0,rWhen.indexOf(',')) === fDay) dayMatch = true;
        } else {
            dayMatch = true;
        }
        
        if(fField !== 'null') {
            if(rWhere === fField) fieldMatch = true;
        } else {
            fieldMatch = true;
        }
        
        if(teamMatch && dayMatch && fieldMatch) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


function addRosterCheck() {
    var userObj = {};
    $('.rosterUserInfo').each(function() {
        if($(this).parent().parent().is(':visible')) {
            var key = $(this).prop('id').split('-')[1];
            if($(this).attr('type')==='checkbox') {
                userObj[key] = $(this).prop('checked');
            } else {
                userObj[key] = $(this).val();
            }
        }
    });
    
    // Create array of selected player positions
    var selectedPositions = [];
    $('.rosterUserInfo-position').each(function() {
        if($(this).prop('checked')) {
            var pos = $(this).prop('id').split('-')[1];
            selectedPositions.push(pos);
        }
    });
    userObj.positions = selectedPositions;

    // ensure validity of all field values
    $.each(userObj, function(oKey, oVal) {
        // no blank fields
        if(!oVal || oVal==='' || oVal==='null') {
            var keyElem = '#rosterUserInfo-'+oKey;
            // ignore nickname, nameprefer and waiver
            if(oKey!=='Nname' && $(keyElem).attr('type')!=='checkbox') {
                if(oKey==='password' && $('#rosterUserInfo-update').length) {
                    // ignore blank password when updating
                } else {
                    $(keyElem).addClass('hasError');
                }
            }
        }
    });
    if($('#roster-addPlayer .hasError:visible').length) {
        if(!$('.addUserError').length) {
            $('<p class="addUserError" style="color:#FF0000">You must specify a value for the highlighted fields.</p>').insertBefore('#rosterBtn-savePlayer');
        }
        return false;
    }
    
    rosterSavePlayer(userObj);
}

function rosterSavePlayer(userInfo) {
    // Disable UI
    $('.rosterUserInfo').prop('disabled', true);
    $('#rosterBtn-savePlayer').hide();
    $('<br><span>Saving...</span>').insertAfter('#rosterBtn-savePlayer');
    
    // Send new user data to the server
    userInfo['Type'] = 'Player';
    $.ajax({
        type: "POST",
        url: '?addUser',
        data: {userData: JSON.stringify(userInfo)},
        success: function(result) {
            $('#rosterBtn-savePlayer').parent().children('br').remove();
            $('#rosterBtn-savePlayer').parent().children('span').remove();
            if(result.trim()==='success') {
                var success = '<p style="color:green">'+userInfo.Type+' saved successfully!<br>';
                success += '<button type="button" onclick="rosterBack(rosterReload)">Back to Roster</button></p>';
                $(success).insertAfter('#rosterBtn-savePlayer');
            } else {
                $('#rosterBtn-savePlayer').show();
                $('.rosterUserInfo').removeProp('disabled');
                if(result.trim()==='!username') {
                    $('<p style="color:#FF0000">That username is already in use!</p>').insertBefore('#rosterBtn-savePlayer');
                } else {
                    $('<p style="color:#FF0000">An unexpected error occurred. Please try again later.</p>').insertBefore('#rosterBtn-savePlayer');
                }
                setTimeout(function(){$('#rosterBtn-savePlayer').prev('p').fadeOut(1500, function(){$(this).remove();});}, 3500);
            }
        }
    });
}

function rosterReload() {
    if(userIsAdmin) {
        resetRosterUserInfo();
    } else {
        rosterResetPlayerInfo();
    }
    
    $.ajax({
        type: "GET",
        url: "?rosterReload",
        success: function(result) {
            if(result.trim() === 'relogin') {
                window.location.reload(true);
            } else {
                $('#roster-table').children('tbody').empty().html(result);
                if(userIsAdmin) filterRoster();
                initNotifications();
            }
            
        }
    });
}

function rosterResetPlayerInfo() {
    var saveBtn = $('#rosterBtn-savePlayer').clone();
    $(saveBtn).show();
    $('#rosterBtn-savePlayer').parent().empty().append(saveBtn);
    $('.rosterUserInfo').removeProp('disabled');
    $('select.rosterUserInfo').val('null');
    $('#rosterUserInfo-password').val('').prop('placeholder', 'Password');
    $('input:text.rosterUserInfo').val('');
    $('#rosterUserInfo-email').val('');
    $('#rosterUserInfo-phone').val('');
    $('input:checkbox.rosterUserInfo').removeAttr('checked');
    $('input:checkbox.rosterUserInfo-position').removeAttr('checked');
    $('#rosterUserInfo-NamePrefer').parent().hide();
    $('#roster-addPlayer .hasError').removeClass('hasError');
    $('#rosterBtn-saveIcon').removeAttr('class').addClass('icon').addClass('fa-user-plus');
    $('#rosterUserRemoveWrap').hide();
    $('#rosterUserInfo-update').remove();
    $('#rosterUserInfo-userId').remove();
}

function rosterBack(callback) {
    $('#roster header h2').html('Roster');
    $('.rosterContent:visible').slideToggle();
    $('#roster-main').slideToggle(function() {
        if(callback) callback();
    });
    $('html,body').animate({scrollTop: $('#roster').children('.container').children('header').children('h2').offset().top}, 500);
}

function rosterRemoveUser() {
    var confirm = prompt("Are you sure you want to remove this user? This cannot be undone!\r\nType DELETE in the box to confirm");
    if(confirm.toLowerCase() === 'delete') {
        // Send command to server
        var userId = $('#rosterUserInfo-userId').val();
        $.ajax({
            type: 'POST',
            url: '?removeUser',
            data: {id: userId},
            success: function(result) {
                if(result.trim()==='success') {
                    rosterBack(rosterReload);
                    if(userIsAdmin) rosterRefreshTeams();
                } else {
                    console.log(result);
                    alert('An unexpected error occurred! Try again later.');
                }
            }
        });
    }
}

function rosterEditUser(event) {
    if(event.target.className.split('-')[0]==='rosterTeam') {
        var teamId = event.target.className.split('-')[1];
        rosterNavTeamPage(teamId);
        return;
    }
    var userId = $(this).prop('id').split('-')[1];
    var userDisplay = $(this).children('.rosterVal-display').html();
    var userWaiver = ($(this).children('.rosterVal-waiver').children('span').html()==='YES' ? 1 : 0);
    var userUname = $(this).children('.rosterVal-uname').val();
    var userFname = $(this).children('.rosterVal-fname').val();
    var userLname = $(this).children('.rosterVal-lname').val();
    var userNick = $(this).children('.rosterVal-nick').val();
    var userPreferNick = $(this).children('.rosterVal-prefernick').val();
    var userPhone = $(this).children('.rosterVal-phone').val();
    var userEmail = $(this).children('.rosterVal-email').val();
    var editContent = (userIsAdmin ? '#roster-addEditUser' : '#roster-addPlayer');
    var userPosition = (userIsAdmin ? $(this).children('.rosterVal-position').val() : $(this).children('.rosterVal-position').html());
    
    // Parse positions and mark applicable checkboxes
    if(!userIsAdmin) {
        if(userPosition !== '<span style="color:red">None</span>') {
            var positions = $(this).children('.rosterVal-position').html().split(', ');
            $(positions).each(function(index) {
                positions[index] = this.replace(' ', '');
                var thisPos = '#ruiPos-'+positions[index];
                $(thisPos).prop('checked','checked');
            });
        }
    } else {
        var jp = userPosition.replace(/'/g, '"');
        var positions = JSON.parse(jp);
        $(positions).each(function() {
            var thisPos = '#ruiPos-'+this;
            $(thisPos).prop('checked','checked');
        });
    }
    
    // Parse the general fields
    $('#rosterUserInfo-username').val(userUname).prop('disabled', true);
    $('#rosterUserInfo-Fname').val(userFname);
    $('#rosterUserInfo-Lname').val(userLname);
    $('#rosterUserInfo-Nname').val(userNick);
    $('#rosterUserInfo-phone').val(userPhone);
    $('#rosterUserInfo-email').val(userEmail);
    $('#rosterUserInfo-password').prop('placeholder', 'Blank if unchanged');
    $('#rosterUserInfo-playerWaiver').val(userWaiver);
    if(userPreferNick==='true') $('#rosterUserInfo-NamePrefer').prop('checked',true);
    if(userNick !== '') $('#rosterUserInfo-NamePrefer').parent().show();
    if(userIsAdmin) rosterInitEditUser(this);
    
    // Update UI
    if(!$(this).hasClass('coachNav')) {
        $('#roster-main').slideToggle();
    } else {
        $('#roster-addEditTeam').slideToggle();
    }
    $(editContent).slideToggle(function() {
        $('#roster header h2').html('<a href="#roster" onclick="rosterBack(rosterReload)">Roster</a> &rarr; '+userDisplay);
        $('#rosterBtn-saveIcon').removeClass('fa-user-plus').addClass('fa-save');
        $('#rosterUserRemoveWrap').show();
        $('<input type="hidden" id="rosterUserInfo-update" class="rosterUserInfo" value="true">').insertAfter('#rosterUserInfo-email');
        $('<input type="hidden" id="rosterUserInfo-userId" class="rosterUserInfo" value="'+userId+'">').insertAfter('#rosterUserInfo-email');
    });
    $('html,body').animate({scrollTop: $('#roster').children('.container').children('header').children('h2').offset().top}, 500);
}



function tpSaveChanges() {
    $('#tpStatus').html('Saving...');
    var tpContent = CKEDITOR.instances.tpContent.getData();
    var tpImg = '';
    if($('#tpImgWrap').children('img').length) tpImg = $('#tpImgWrap').children('img').prop('src');
    var tpSlogan = $('#tpSlogan').val();
    var saveData = {
        content: tpContent,
        img: tpImg,
        slogan: tpSlogan
    };
    var saveUrl = '?tpSave';
    if(userIsAdmin) saveUrl += '&team='+$('#adminTeamSelector').val();
    $.ajax({
        type: 'POST',
        url: saveUrl,
        data: saveData,
        dataType: 'json',
        success: function(result) {
            if(result.hasOwnProperty('success')) {
                $('#tpStatus').html('Changes saved!');
                if(userIsAdmin && result.hasOwnProperty('teams')) {
                    teamInfo = result.teams;
                }
            } else {
                $('#tpStatus').html('Error!');
                console.log(result);
            }
            setTimeout(function() {
                $('#tpStatus').fadeOut(function() {
                    $(this).empty().show();
                });
            }, 1500);
        }
    });
}

function tpUploadImage(fe) {
    fe.stopPropagation();
    fe.preventDefault();
    
    // Update UI
    $('#tpImageFile').prop('disabled', 'disabled');
    $('#tpImgStatus').removeAttr('style').html('Uploading...');
    
    // Send file to server
    var fileData = new FormData();
    $.each(tpImageUploadFile, function(key, value) {
        fileData.append(key, value);
    });
    var ajaxUrl = '?teamImage';
    if(userIsAdmin) ajaxUrl += '&team='+$('#adminTeamSelector').val();
    $.ajax({
        type: "POST",
        url: ajaxUrl,
        data: fileData,
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            if(result.trim().indexOf('error:') === -1) {
                tpImageUploadFile = result;
                $('#tpImageFileWrap').hide();
                var previewImg = document.createElement('img');
                $(previewImg).prop('src', result).css('width','325px').css('height','200px').appendTo('#tpImgWrap');
                $('#tpBtn-removeImage').show();
            } else {
                if(result.trim() === 'error: filesize') {
                    $('#tpImgStatus').html('The image you selected is too large! You must reduce the file size, or select a different image.');
                    $('#tpImgStatus').css('color','red');
                    $('#tpImageFile').removeProp('disabled');
                }
            }
        }
    });
}

function tpImageChanged() {
    // Handle team image file changes
    $('#tpImageFile').on('change', function(ce) {
        if(!this.files.length) return;
        var fileType = this.files[0].type.split('/')[0];
        if(fileType !== 'image') {
            $('#tpImgStatus').css('color','red').html('You must select a valid image file!');
            setTimeout(function() {
                $('#tpImgStatus').fadeOut(function() {
                    $(this).empty().removeAttr('style');
                });
            }, 1500);
            $(this).replaceWith('<input type="file" id="tpImageFile" accept="image/*">');
            tpImageChanged();
        } else {
            // Upload the image and show preview
            tpImageUploadFile = ce.target.files;
            $('#imgUpForm').submit();
        }
    });
}

function tpRemoveImage() {
    $('#tpBtn-removeImage').fadeOut();
    $('#tpImgWrap').children('img').fadeOut(function(){$(this).remove();});
    $('#tpImgStatus').empty();
    $('#tpImageFile').replaceWith('<input type="file" id="tpImageFile" accept="image/*">');
    $('#tpImageFileWrap').fadeIn();
    tpImageChanged();
}



/* Event listeners */

// Notifications - Missing Score link clicked
$('body').on('click', '.gMissingScore', function() {
    var gameId = '#' + $(this).prop('id').substr(3);
    $('html,body').animate({scrollTop: $(gameId).offset().top}, 500);
    $(gameId).children('.scheduleRow-score').children('.postScore').click();
});

// Notifications - Toggle List link clicked
$('body').on('click', '.caToggleList', function() {
    var listElem = $(this).next();
    $('.caList:visible').slideToggle();
    if(!$(listElem).is(':visible')) $(listElem).slideToggle();
});

// Schedule - Add event button
$('body').on('click', '#scheduleBtn-add', function() {
    if(!userIsAdmin) {
        $('.scheduleContent:visible').slideToggle(function() {
            $('.dnWrap').hide();
        });
        $(this).parent().children('.button').css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75').attr('disabled','disabled');
        $(this).parent().slideToggle();
        $(this).css('color', '#cafb05').css('backgroundColor', 'rgba(0,0,0,0.5');
        $('#schedule-add').slideToggle();
        $('#schedule header h2').html('<a href="#schedule" onclick="resetSchedule();">Schedule</a> &rarr; Add Event');
        scheduleSub = 'AddEvent';
    } 
});

// Schedule - Filter games button
$('body').on('click', '#scheduleBtn-filter', function() {
    if(!scheduleInitialized) initSchedule();
    if(scheduleSub===null) {
        if($('#schedule-filter').css('display') === 'none') {
            $(this).css('color', '#cafb05').css('backgroundColor', 'rgba(0,0,0,0.5');
        } else {
            $(this).css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75');
        }
        $('#schedule-filter').slideToggle();
    }
});

// Schedule - filter options changed
$('.schedule-filter-option select').on('change', function() {
    filterSchedule();
});

// Schedule - Post score link clicked
$('body').on('click', '.postScore', function() {
    $('.postScore').show();
    if($(this).html() === 'Post' && !$(this).parent().parent().next().hasClass('adminEditWrap')) {
        var colSpan = (userIsAdmin ? 5 : 4);
        var insertPoint = $(this).parent().parent();
        var teams = $(insertPoint).children('.scheduleRow-who').html().split(' &nbsp; vs. &nbsp; ');
        var scoreWrap = document.createElement('tr');
        $(scoreWrap).addClass('scorePostWrap').css('display','none').insertAfter(insertPoint).slideToggle(function() {
            var scoreEntry = '<td colspan="'+colSpan+'">Enter number of runs scored by <strong>'+teams[0]+'</strong>: <input type="number" class="scoreRuns team0"><br>';
            scoreEntry += 'Enter number of runs scored by <strong>'+teams[1]+'</strong>: <input type="number" class="scoreRuns team1"><br>';
            scoreEntry += '<button type="button" class="btnSaveScore">Save Score</button></td>';
            $(this).html(scoreEntry);
        });
        $('#schedule-table tbody tr').removeClass('adminEditable');
        $(this).css('color','#000').html('Cancel');
        $('.postScore').each(function() {
            if($(this).html() === 'Post') {
                $(this).hide();
            }
        });
    } else {
        if(!$(this).parent().parent().next().hasClass('adminEditWrap')) {
            $('.postScore').css('color','green').html('Post');
            $('.scorePostWrap:visible').fadeOut(function() {
                if($('.adminEditWrap').length === 0) $('#schedule-table tbody tr').addClass('adminEditable');
                $(this).remove();
            });
        }   
    }
});

// Schedule - Save score button clicked
$('body').on('click', '.btnSaveScore', function() {
    var caller = $(this);
    var gameData = $(this).parent().parent().prev().prop('id').split('-');
    var gameId = parseInt(gameData[1]);
    var matchId = parseInt(gameData[2]);
    var team1 = (matchId===1 ? $(this).parent().children('.team0').val() : $(this).parent().children('.team1').val());
    var team2 = (matchId===1 ? $(this).parent().children('.team1').val() : $(this).parent().children('.team0').val());
    var t1score = parseInt(team1);
    var t2score = parseInt(team2);
    $.ajax({
        type: "POST",
        url: "?saveScore",
        data: {
            game: gameId,
            match: matchId,
            team1: t1score,
            team2: t2score
        },
        success: function(result) {
            if(result.trim() !== 'success') {
                console.log('error:');
                console.log(result);
            } else {
                var score1 = $(caller).parent().children('.team0').val();
                var score2 = $(caller).parent().children('.team1').val();
                if(parseInt(score1)===0 && parseInt(score2)===0) {
                    $(caller).parent().parent().slideToggle(function() {
                        $('#schedule-table tbody tr').addClass('adminEditable');
                        $(this).prev().children('.scheduleRow-score').html('<span class="postScore">Post</span>');
                        $(this).remove();
                    });
                } else {
                    var score = score1+'-'+score2;
                    $(caller).parent().parent().slideToggle(function() {
                        if(userIsAdmin) {
                            $(this).prev().children('.scheduleRow-score').html(score);
                        } else {
                            $(this).prev().children('.scheduleRow-score').children('.postScore').replaceWith(score);
                        }

                        $('#schedule-table tbody tr').addClass('adminEditable');
                        $(this).remove();
                    });
                }
                initNotifications();           
                
            }
        }
    });
    $('.postScore').show();
});



// Roster - Add User Nickname changed
$('body').on('keyup', '#rosterUserInfo-Nname', function() {
    if($(this).val() !== '') {
        $(this).parent().next('p').fadeIn();
    } else {
        $(this).parent().next('p').hide();
    }
});

// Roster - Add Player button clicked
$('body').on('click', '#rosterBtn-addPlayer', function() {
    $('#roster-main').slideToggle();
    $('#roster-addPlayer').slideToggle(function() {
        $('#roster header h2').html('<a href="#roster" onclick="rosterBack(rosterResetPlayerInfo)">Roster</a> &rarr; Add Player');
    });
    $('html,body').animate({scrollTop: $('#roster').children('.container').children('header').children('h2').offset().top}, 500);
});

// Roster - Existing user clicked
$('body').on('click', '.rosterRow', rosterEditUser);

// Roster - Save Player button clicked
$('body').on('click', '#rosterBtn-savePlayer', addRosterCheck);

// Roster - Remove User button clicked
$('body').on('click', '#rosterBtn-removeUser', rosterRemoveUser);


// Team Page - Save Changes button clicked
$('body').on('click', '#tpBtn-saveChanges', tpSaveChanges);

// Team Page - Remove Image button clicked
$('body').on('click', '#tpBtn-removeImage', tpRemoveImage);

// Team Page - Image changed
$('body').on('submit', '#imgUpForm', tpUploadImage);



// Developer notes open
$('body').on('click', '.developerNotes', function() {
    var div = document.createElement('div');
    var dnBody = document.createElement('div');
    var dnList = '.' + $(this).prop('id');
    $(dnBody).addClass('devNotesBody');
    $(dnList).each(function() {
        var dNote = $(this).val();
        $(dnBody).append('<p>'+dNote+'</p>');
    });
    $(div).addClass('devNotes').html('<h2>Developer Notes</h2><br>').append(dnBody).append('<br><button type="button" class="devNotesClose">Close</button>');
    $(div).insertBefore('#main').css('left', ($(document).width()-$(div).width())/2+'px');
});

// Developer notes close
$('body').on('click', '.devNotesClose, .devNotes', function() {
    $('.devNotes').remove();
});

// Clear Error State
$('body').on('focus', '.hasError', function() {
    $(this).removeClass('hasError');
    if(!$('.rosterUserInfo.hasError').length) $('.addUserError').fadeOut(function(){$(this).remove();});
    if(!$('.rosterTeamInfo.hasError').length && !$('#rosterTeamInfo-divWrap').hasClass('hasError')) {
        $('#saveTeamStatus').fadeOut(function(){
            $(this).empty().show();
        });
    }
});


/* On document ready */
$(document).ready(function() {
    initNotifications();
    
    if(!userIsAdmin && !scheduleInitialized) initSchedule();
    
    // Initialize ckEditor
    CKEDITOR.replace('tpContent', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
    
    // Handle team image file changes
    tpImageChanged();
});









/*
 Prologue by HTML5 UP
 html5up.net | @n33co
 Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 */

(function($) {

    skel.breakpoints({
        wide: '(min-width: 961px) and (max-width: 1880px)',
        normal: '(min-width: 961px) and (max-width: 1620px)',
        narrow: '(min-width: 961px) and (max-width: 1320px)',
        narrower: '(max-width: 960px)',
        mobile: '(max-width: 736px)'
    });

    $(function() {

        var $window = $(window),
                $body = $('body');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function() {
            $.prioritize(
                    '.important\\28 mobile\\29',
                    skel.breakpoint('mobile').active
                    );
        });

        // Scrolly links.
        $('.scrolly').scrolly();

        // Nav.
        var $nav_a = $('#nav a');

        // Scrolly-fy links.
        $nav_a
                .scrolly()
                .on('click', function(e) {

                    var t = $(this),
                            href = t.attr('href');

                    if (href[0] != '#')
                        return;

                    e.preventDefault();

                    // Clear active and lock scrollzer until scrolling has stopped
                    $nav_a
                            .removeClass('active')
                            .addClass('scrollzer-locked');

                    // Set this link to active
                    t.addClass('active');

                });

        // Initialize scrollzer.
        var ids = [];

        $nav_a.each(function() {

            var href = $(this).attr('href');

            if (href[0] != '#')
                return;

            ids.push(href.substring(1));

        });

        $.scrollzer(ids, {pad: 200, lastHack: true});

        // Header (narrower + mobile).

        // Toggle.
        $(
                '<div id="headerToggle">' +
                '<a href="#header" class="toggle"></a>' +
                '</div>'
                )
                .appendTo($body);

        // Header.
        $('#header')
                .panel({
                    delay: 500,
                    hideOnClick: true,
                    hideOnSwipe: true,
                    resetScroll: true,
                    resetForms: true,
                    side: 'left',
                    target: $body,
                    visibleClass: 'header-visible'
                });

        // Fix: Remove transitions on WP<10 (poor/buggy performance).
        if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
            $('#headerToggle, #header, #main')
                    .css('transition', 'none');

    });
    
})(jQuery);
