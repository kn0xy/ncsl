userIsAdmin = true;
var locMap;
var locationInfo;
var teamInfo;

function initAdminNotifications() {
    teamsNotifications();
    gamesNotifications();
    userNotifications();
}

function teamsNotifications() {
    var minPlayers = 9;
    var divA = [];
    var divB = [];
    var divC = [];
    var noCoachA = [];
    var noCoachB = [];
    var noCoachC = [];
    var tfPlayersA = [];
    var tfPlayersB = [];
    var tfPlayersC = [];
    var readyA = 0;
    var readyB = 0;
    var readyC = 0;
    
    $('.teamsAlert').remove();
    $('.taList').remove();
    
    $('.teamsRow').each(function() {
        var name = $(this).children('.teamsVal-teamname').text();
        var div = $(this).children('.teamsVal-division').text();
        var coach = $(this).children('.teamsVal-coachname').text();
        var players = $(this).children('.teamsVal-players').text();
        var ready = $(this).children('.teamsVal-ready').text();
        
        if(div === 'A') {
            divA.push(name);
            if(coach === 'None') noCoachA.push(name);
            if(players !== 'N/A') {
                if(parseInt(players) < minPlayers) tfPlayersA.push({team:name, numPlayers:players});
            }
            if(ready === 'YES') readyA++;
        }
        if(div === 'B') {
            divB.push(name);
            if(coach === 'None') noCoachB.push(name);
            if(players !== 'N/A') {
                if(parseInt(players) < minPlayers) tfPlayersB.push({team:name, numPlayers:players});
            }
            if(ready === 'YES') readyB++;
        }
        if(div === 'C') {
            divC.push(name);
            if(coach === 'None') noCoachC.push(name);
            if(players !== 'N/A') {
                if(parseInt(players) < minPlayers) tfPlayersC.push({team:name, numPlayers:players});
            }
            if(ready === 'YES') readyC++;
        }
        
        $('#notifications-Teams-DivA').children('p:first-of-type').children('.notifications-numTeams').html(divA.length);
        $('#notifications-Teams-DivA').children('p:first-of-type').children('.notifications-teamsReady').html(readyA);
        
        $('#notifications-Teams-DivB').children('p:first-of-type').children('.notifications-numTeams').html(divB.length);
        $('#notifications-Teams-DivB').children('p:first-of-type').children('.notifications-teamsReady').html(readyB);
        
        $('#notifications-Teams-DivC').children('p:first-of-type').children('.notifications-numTeams').html(divC.length);
        $('#notifications-Teams-DivC').children('p:first-of-type').children('.notifications-teamsReady').html(readyC);
    });
    
    // Add "no coach" alerts
    if(noCoachA.length > 0) {
        var ancWrapA = document.createElement('p');
        var ancHtmlA = '* '+noCoachA.length+' team'+(noCoachA.length > 1 ? 's do' : ' does')+' not have a coach assigned!';
        var ancListA = document.createElement('ul');
        for(var t=0; t<noCoachA.length; t++) {
            var ancListHtml = '<li><span style="font-weight:bold">- '+noCoachA[t]+'</span></li>';
            $(ancListHtml).appendTo(ancListA);
        }
        $(ancWrapA).addClass('teamsAlert').addClass('taNoCoach').html(ancHtmlA).appendTo('#notifications-Teams-DivA');
        $(ancListA).addClass('taList').appendTo('#notifications-Teams-DivA');
    }
    if(noCoachB.length > 0) {
        var ancWrapB = document.createElement('p');
        var ancHtmlB = '* '+noCoachB.length+' team'+(noCoachB.length > 1 ? 's do' : ' does')+' not have a coach assigned!';
        var ancListB = document.createElement('ul');
        for(var t=0; t<noCoachB.length; t++) {
            var ancListHtml = '<li><span style="font-weight:bold">- '+noCoachB[t]+'</span></li>';
            $(ancListHtml).appendTo(ancListB);
        }
        $(ancWrapB).addClass('teamsAlert').addClass('taNoCoach').html(ancHtmlB).appendTo('#notifications-Teams-DivB');
        $(ancListB).addClass('taList').appendTo('#notifications-Teams-DivB');
    }
    if(noCoachC.length > 0) {
        var ancWrapC = document.createElement('p');
        var ancHtmlC = '* '+noCoachC.length+' team'+(noCoachC.length > 1 ? 's do' : ' does')+' not have a coach assigned!';
        var ancListC = document.createElement('ul');
        for(var t=0; t<noCoachC.length; t++) {
            var ancListHtml = '<li><span style="font-weight:bold">- '+noCoachC[t]+'</span></li>';
            $(ancListHtml).appendTo(ancListC);
        }
        $(ancWrapC).addClass('teamsAlert').addClass('taNoCoach').html(ancHtmlC).appendTo('#notifications-Teams-DivC');
        $(ancListC).addClass('taList').appendTo('#notifications-Teams-DivC');
    }
    
    // Add "too few players" alerts
    if(tfPlayersA.length > 0) {
        var atfpWrapA = document.createElement('p');
        var atfpHtmlA = '* '+tfPlayersA.length+' eligible team'+(tfPlayersA.length > 1 ? 's have' : ' has')+' fewer than '+minPlayers+' players!';
        var tfpListA = document.createElement('ul');
        for(var t=0; t<tfPlayersA.length; t++) {
            var np = parseInt(tfPlayersA[t].numPlayers);
            var tfpHtml = '<li><span style="font-weight:bold">- '+tfPlayersA[t].team+'</span> &nbsp; ';
            tfpHtml += '('+np+' '+(np===1 ? 'player' : 'players')+')</li>';
            $(tfpHtml).appendTo(tfpListA);
        }
        $(atfpWrapA).addClass('teamsAlert').addClass('taTfp').html(atfpHtmlA).appendTo('#notifications-Teams-DivA');
        $(tfpListA).addClass('taList').appendTo('#notifications-Teams-DivA');   
    }
    if(tfPlayersB.length > 0) {
        var atfpWrapB = document.createElement('p');
        var atfpHtmlB = '* '+tfPlayersB.length+' eligible team'+(tfPlayersB.length > 1 ? 's have' : ' has')+' fewer than '+minPlayers+' players!';
        var tfpListB = document.createElement('ul');
        for(var t=0; t<tfPlayersB.length; t++) {
            var np = parseInt(tfPlayersB[t].numPlayers);
            var tfpHtml = '<li><span style="font-weight:bold">- '+tfPlayersB[t].team+'</span> &nbsp; ';
            tfpHtml += '('+np+' '+(np===1 ? 'player' : 'players')+')</li>';
            $(tfpHtml).appendTo(tfpListB);
        }
        $(atfpWrapB).addClass('teamsAlert').addClass('taTfp').html(atfpHtmlB).appendTo('#notifications-Teams-DivB');
        $(tfpListB).addClass('taList').appendTo('#notifications-Teams-DivB');
    }
    if(tfPlayersC.length > 0) {
        var atfpWrapC = document.createElement('p');
        var atfpHtmlC = '* '+tfPlayersC.length+' eligible team'+(tfPlayersC.length > 1 ? 's have' : ' has')+' fewer than '+minPlayers+' players!';
        var tfpListC = document.createElement('ul');
        for(var t=0; t<tfPlayersC.length; t++) {
            var np = parseInt(tfPlayersC[t].numPlayers);
            var tfpHtml = '<li><span style="font-weight:bold">- '+tfPlayersC[t].team+'</span> &nbsp; ';
            tfpHtml += '('+np+' '+(np===1 ? 'player' : 'players')+')</li>';
            $(tfpHtml).appendTo(tfpListC);
        }
        $(atfpWrapC).addClass('teamsAlert').addClass('taTfp').html(atfpHtmlC).appendTo('#notifications-Teams-DivC');
        $(tfpListC).addClass('taList').appendTo('#notifications-Teams-DivC');
    }
    
    // Add "no scheduled games" alerts
    var nsgA = tnCheckGames(divA);
    var nsgB = tnCheckGames(divB);
    var nsgC = tnCheckGames(divC);
    
    if(nsgA.length > 0) {
        var nsgWrapA = document.createElement('p');
        var nsgHtmlA = '* '+nsgA.length+' team'+(nsgA.length > 1 ? 's have' : ' has')+' no scheduled games!';
        var nsgListA = document.createElement('ul');
        for(var t=0; t<nsgA.length; t++) {
            var nsgListHtml = '<li><span style="font-weight:bold">- '+nsgA[t]+'</span></li>';
            $(nsgListHtml).appendTo(nsgListA);
        }
        $(nsgWrapA).addClass('teamsAlert').addClass('taNsg').html(nsgHtmlA).appendTo('#notifications-Teams-DivA');
        $(nsgListA).addClass('taList').appendTo('#notifications-Teams-DivA');
    }
    if(nsgB.length > 0) {
        var nsgWrapB = document.createElement('p');
        var nsgHtmlB = '* '+nsgB.length+' team'+(nsgB.length > 1 ? 's have' : ' has')+' no scheduled games!';
        var nsgListB = document.createElement('ul');
        for(var t=0; t<nsgB.length; t++) {
            var nsgListHtml = '<li><span style="font-weight:bold">- '+nsgB[t]+'</span></li>';
            $(nsgListHtml).appendTo(nsgListB);
        }
        $(nsgWrapB).addClass('teamsAlert').addClass('taNsg').html(nsgHtmlB).appendTo('#notifications-Teams-DivB');
        $(nsgListB).addClass('taList').appendTo('#notifications-Teams-DivB');
    }
    if(nsgC.length > 0) {
        var nsgWrapC = document.createElement('p');
        var nsgHtmlC = '* '+nsgC.length+' team'+(nsgC.length > 1 ? 's have' : ' has')+' no scheduled games!';
        var nsgListC = document.createElement('ul');
        for(var t=0; t<nsgC.length; t++) {
            var nsgListHtml = '<li><span style="font-weight:bold">- '+nsgC[t]+'</span></li>';
            $(nsgListHtml).appendTo(nsgListC);
        }
        $(nsgWrapC).addClass('teamsAlert').addClass('taNsg').html(nsgHtmlC).appendTo('#notifications-Teams-DivC');
        $(nsgListC).addClass('taList').appendTo('#notifications-Teams-DivC');
    }
}

function tnCheckGames(teamsArray) {
    // Determine all teams with scheduled games
    var gameTeams = [];
    var noGames = [];
    $('#schedule-table').children('tbody').children('tr').each(function() {
        var who = $(this).children('.scheduleRow-who').html().split(' &nbsp; vs. &nbsp; ');
        if(gameTeams.indexOf(who[0]) === -1) gameTeams.push(who[0]);
        if(gameTeams.indexOf(who[1]) === -1) gameTeams.push(who[1]);
    });
    
    // Check each team in the teamsArray for a scheduled game
    for(var t=0; t<teamsArray.length; t++) {
        var checkTeam = teamsArray[t];
        if(gameTeams.indexOf(checkTeam) === -1 && noGames.indexOf(checkTeam) === -1) noGames.push(checkTeam);
    }
    
    return noGames;
}

function gamesNotifications() {
    var gamesA = 0;
    var gamesB = 0;
    var gamesC = 0;
    var playedA = 0;
    var playedB = 0;
    var playedC = 0;
    var unpostedA = [];
    var unpostedB = [];
    var unpostedC = [];
    var allLocations = [];
    var noLocA = [];
    var noLocB = [];
    var noLocC = [];
    
    $('.gamesAlert').remove();
    $('.gaList').remove();
    
    $('.locationsTableRow').each(function() {
        var loc = $(this).children('.locationsTableCell:first-of-type').text();
        allLocations.push(loc);
    });
    
    $('#schedule-table').children('tbody').children('tr').each(function() {
        var id = $(this).prop('id');
        var div = $(this).children('.scheduleRow-division').text();
        var gt = $(this).children('.gametime').val().split(':');
        var gd = $(this).children('.gamedate').val().split('-');
        var gdt = new Date(parseInt(gd[0]), parseInt(gd[1])-1, parseInt(gd[2]), parseInt(gt[0]), parseInt(gt[1]));
        var played = (Date.now() > gdt.getTime() ? true : false);
        var score = $(this).children('.scheduleRow-score').text();
        var location = $(this).children('.scheduleRow-where').text();
        
        if(div === 'A') {
            gamesA++;
            if(allLocations.indexOf(location) === -1) {
                if(noLocA.indexOf(location) === -1) noLocA.push(location);
            }
            if(played) {
                playedA++;
                if(score === 'Post') unpostedA.push(id);
            }
        }
        if(div === 'B') {
            gamesB++;
            if(allLocations.indexOf(location) === -1) {
                if(noLocB.indexOf(location) === -1) noLocB.push(location);
            }
            if(played) {
                playedB++;
                if(score === 'Post') unpostedB.push(id);
            }
        }
        if(div === 'C') {
            gamesC++;
            if(allLocations.indexOf(location) === -1) {
                if(noLocC.indexOf(location) === -1) noLocC.push(location);
            }
            if(played) {
                playedC++;
                if(score === 'Post') unpostedC.push(id);
            }
        }
    });
    
    $('#notifications-Games-DivA').children('p:first-of-type').children('.notifications-numGames').html(gamesA);
    $('#notifications-Games-DivA').children('p:first-of-type').children('.notifications-gamesPlayed').html(playedA);

    $('#notifications-Games-DivB').children('p:first-of-type').children('.notifications-numGames').html(gamesB);
    $('#notifications-Games-DivB').children('p:first-of-type').children('.notifications-gamesPlayed').html(playedB);

    $('#notifications-Games-DivC').children('p:first-of-type').children('.notifications-numGames').html(gamesC);
    $('#notifications-Games-DivC').children('p:first-of-type').children('.notifications-gamesPlayed').html(playedC);
    
    // Add "no location" alerts
    if(noLocA.length > 0) {
        var anlWrapA = document.createElement('p');
        var anlHtmlA = '* '+noLocA.length+' scheduled '+(noLocA.length===1 ? 'location does' : 'locations do')+' not exist!';
        var anlListA = document.createElement('ul');
        for(var g=0; g<noLocA.length; g++) {
            var anlListHtml = '<li><span style="font-weight:bold">- '+noLocA[g]+'</span></li>';
            $(anlListHtml).appendTo(anlListA);
        }
        $(anlWrapA).addClass('gamesAlert').addClass('gLocAlert').html(anlHtmlA).appendTo('#notifications-Games-DivA');
        $(anlListA).addClass('gaList').appendTo('#notifications-Games-DivA');
    }
    if(noLocB.length > 0) {
        var anlWrapB = document.createElement('p');
        var anlHtmlB = '* '+noLocB.length+' scheduled '+(noLocB.length===1 ? 'location does' : 'locations do')+' not exist!';
        var anlListB = document.createElement('ul');
        for(var g=0; g<noLocB.length; g++) {
            var anlListHtml = '<li><span style="font-weight:bold">- '+noLocB[g]+'</span></li>';
            $(anlListHtml).appendTo(anlListB);
        }
        $(anlWrapB).addClass('gamesAlert').addClass('gLocAlert').html(anlHtmlB).appendTo('#notifications-Games-DivB');
        $(anlListB).addClass('gaList').appendTo('#notifications-Games-DivB');
    }
    if(noLocC.length > 0) {
        var anlWrapC = document.createElement('p');
        var anlHtmlC = '* '+noLocC.length+' scheduled '+(noLocC.length===1 ? 'location does' : 'locations do')+' not exist!';
        var anlListC = document.createElement('ul');
        for(var g=0; g<noLocC.length; g++) {
            var anlListHtml = '<li><span style="font-weight:bold">- '+noLocC[g]+'</span></li>';
            $(anlListHtml).appendTo(anlListC);
        }
        $(anlWrapC).addClass('gamesAlert').addClass('gLocAlert').html(anlHtmlC).appendTo('#notifications-Games-DivC');
        $(anlListC).addClass('gaList').appendTo('#notifications-Games-DivC');
    }
    
    // Add "unposted" alerts
    if(unpostedA.length > 0) {
        var upsWrapA = document.createElement('p');
        var upsHtmlA = '* '+unpostedA.length+' played games are missing scores!';
        if(parseInt(unpostedA.length) === 1) upsHtmlA = '* 1 played game is missing a score!';
        $(upsWrapA).addClass('gamesAlert').addClass('gMissingScore').prop('id', 'ga-'+unpostedA[0]).html(upsHtmlA).appendTo('#notifications-Games-DivA');
    }
    if(unpostedB.length > 0) {
        var upsWrapB = document.createElement('p');
        var upsHtmlB = '* '+unpostedB.length+' played games are missing scores!';
        if(parseInt(unpostedB.length) === 1) upsHtmlB = '* 1 played game is missing a score!';
        $(upsWrapB).addClass('gamesAlert').addClass('gMissingScore').prop('id', 'ga-'+unpostedB[0]).html(upsHtmlB).appendTo('#notifications-Games-DivB');
    }
    if(unpostedC.length > 0) {
        var upsWrapC = document.createElement('p');
        var upsHtmlC = '* '+unpostedC.length+' played games are missing scores!';
        if(parseInt(unpostedC.length) === 1) upsHtmlC = '* 1 played game is missing a score!';
        $(upsWrapC).addClass('gamesAlert').addClass('gMissingScore').prop('id', 'ga-'+unpostedC[0]).html(upsHtmlC).appendTo('#notifications-Games-DivC');
    }
}

function userNotifications() {
    var playersA = 0;
    var playersB = 0;
    var playersC = 0;
    var coachesA = 0;
    var coachesB = 0;
    var coachesC = 0;
    var playerNoWaiverA = [];
    var playerNoWaiverB = [];
    var playerNoWaiverC = [];
    var coachCoachWaiverA = [];
    var coachPlayerWaiverA = [];
    var coachCoachWaiverB = [];
    var coachPlayerWaiverB = [];
    var coachCoachWaiverC = [];
    var coachPlayerWaiverC = [];
    var playerNoPositionA = [];
    var playerNoPositionB = [];
    var playerNoPositionC = [];
    
    $('.usersAlert').remove();
    $('.uaList').remove();
    
    
    $('.rosterRow').each(function() {
        var userType = $(this).children('.rosterVal-type').text();
        if(userType !== 'Admin') {
            // Determine division
            var teamElem = $(this).children('.rosterVal-team').children('a')[0];
            var teamName = $(teamElem).text();
            var teamId = '#teamsRow-'+teamElem.className.split(/\s+/)[0].split('-')[1];
            var teamDiv = $(teamId).children('.teamsVal-division').text();
            var waiver = $(this).children('.rosterVal-waiver').text();
            var positions = $(this).children('.rosterVal-position').val();
            var userDisplay = $(this).children('.rosterVal-fname').val()+' '+$(this).children('.rosterVal-lname').val()+' &nbsp; ';
            userDisplay += '('+teamName+')';
            
            if(teamDiv === 'A') {
                if(userType === 'Coach') {
                    coachesA++;
                    if(waiver === 'Needs Both') {
                        coachCoachWaiverA.push(userDisplay);
                        coachPlayerWaiverA.push(userDisplay);
                    } else {
                        if(waiver === 'Needs Player') {
                            coachPlayerWaiverA.push(userDisplay);
                        } else if(waiver === 'Needs Coach') {
                            coachCoachWaiverA.push(userDisplay);
                        }
                    }
                }
                if(userType === 'Player') {
                    playersA++;
                    if(waiver === 'NO') playerNoWaiverA.push(userDisplay);
                    if(positions === '[]') playerNoPositionA.push(userDisplay);
                }
            }
            if(teamDiv === 'B') {
                if(userType === 'Coach') {
                    coachesB++;
                    if(waiver === 'Needs Both') {
                        coachCoachWaiverB.push(userDisplay);
                        coachPlayerWaiverB.push(userDisplay);
                    } else {
                        if(waiver === 'Needs Player') {
                            coachPlayerWaiverB.push(userDisplay);
                        } else if(waiver === 'Needs Coach') {
                            coachCoachWaiverB.push(userDisplay);
                        }
                    }
                }
                if(userType === 'Player') {
                    playersB++;
                    if(waiver === 'NO') playerNoWaiverB.push(userDisplay);
                    if(positions === '[]') playerNoPositionB.push(userDisplay);
                }
            }
            if(teamDiv === 'C') {
                if(userType === 'Coach') {
                    coachesC++;
                    if(waiver === 'Needs Both') {
                        coachCoachWaiverC.push(userDisplay);
                        coachPlayerWaiverC.push(userDisplay);
                    } else {
                        if(waiver === 'Needs Player') {
                            coachPlayerWaiverC.push(userDisplay);
                        } else if(waiver === 'Needs Coach') {
                            coachCoachWaiverC.push(userDisplay);
                        }
                    }
                }
                if(userType === 'Player') {
                    playersC++;
                    if(waiver === 'NO') playerNoWaiverC.push(userDisplay);
                    if(positions === '[]') playerNoPositionC.push(userDisplay);
                }
            }
        }
    });
    
    var npa = $('#notifications-Users-DivA').children('p:first-of-type').children('.notifications-numPlayers');
    var spa = (playersA===1 ? 'player' : 'players');
    var nca = $('#notifications-Users-DivA').children('p:first-of-type').children('.notifications-numCoaches');
    var sca = (coachesA===1 ? 'coach' : 'coaches');
    $(npa).html(playersA);
    $(npa).next().html(spa);
    $(nca).html(coachesA);
    $(nca).next().html(sca);
    
    var npb = $('#notifications-Users-DivB').children('p:first-of-type').children('.notifications-numPlayers');
    var spb = (playersB===1 ? 'player' : 'players');
    var ncb = $('#notifications-Users-DivB').children('p:first-of-type').children('.notifications-numCoaches');
    var scb = (coachesB===1 ? 'coach' : 'coaches');
    $(npb).html(playersB);
    $(npb).next().html(spb);
    $(ncb).html(coachesB);
    $(ncb).next().html(scb);
    
    var npc = $('#notifications-Users-DivC').children('p:first-of-type').children('.notifications-numPlayers');
    var spc = (playersC===1 ? 'player' : 'players');
    var ncc = $('#notifications-Users-DivC').children('p:first-of-type').children('.notifications-numCoaches');
    var scc = (coachesC===1 ? 'coach' : 'coaches');
    $(npc).html(playersC);
    $(npc).next().html(spc);
    $(ncc).html(coachesC);
    $(ncc).next().html(scc);
    
    
    // Add "needs waiver" alerts
    if(coachCoachWaiverA.length > 0) {
        var ccwal = coachCoachWaiverA.length;
        var nwccWrapA = document.createElement('p');
        var nwccHtmlA = '* '+ccwal+' '+(ccwal===1 ? 'coach needs' : 'coaches need')+' to sign COACH waiver!';
        var nwccListA = document.createElement('ul');
        for(var c=0; c<ccwal; c++) {
            var nwccListHtml = '<li><span style="font-weight:bold">- '+coachCoachWaiverA[c]+'</span></li>';
            $(nwccListHtml).appendTo(nwccListA);
        }
        $(nwccWrapA).addClass('usersAlert').html(nwccHtmlA).appendTo('#notifications-Users-DivA');
        $(nwccListA).addClass('uaList').appendTo('#notifications-Users-DivA');
    }
    if(coachPlayerWaiverA.length > 0) {
        var cpwal = coachPlayerWaiverA.length;
        var nwcpWrapA = document.createElement('p');
        var nwcpHtmlA = '* '+cpwal+' '+(cpwal===1 ? 'coach needs' : 'coaches need')+' to sign PLAYER waiver!';
        var nwcpListA = document.createElement('ul');
        for(var c=0; c<cpwal; c++) {
            var nwcpListHtml = '<li><span style="font-weight:bold">- '+coachPlayerWaiverA[c]+'</span></li>';
            $(nwcpListHtml).appendTo(nwcpListA);
        }
        $(nwcpWrapA).addClass('usersAlert').html(nwcpHtmlA).appendTo('#notifications-Users-DivA');
        $(nwcpListA).addClass('uaList').appendTo('#notifications-Users-DivA');
    }
    if(playerNoWaiverA.length > 0) {
        var pnwal = playerNoWaiverA.length;
        var nwppWrapA = document.createElement('p');
        var nwppHtmlA = '* '+pnwal+' '+(pnwal===1 ? 'player needs' : 'players need')+' to sign PLAYER waiver!';
        var nwppListA = document.createElement('ul');
        for(var c=0; c<pnwal; c++) {
            var nwppListHtml = '<li><span style="font-weight:bold">- '+playerNoWaiverA[c]+'</span></li>';
            $(nwppListHtml).appendTo(nwppListA);
        }
        $(nwppWrapA).addClass('usersAlert').html(nwppHtmlA).appendTo('#notifications-Users-DivA');
        $(nwppListA).addClass('uaList').appendTo('#notifications-Users-DivA');
    }
    
    if(coachCoachWaiverB.length > 0) {
        var ccwalB = coachCoachWaiverB.length;
        var nwccWrapB = document.createElement('p');
        var nwccHtmlB = '* '+ccwalB+' '+(ccwalB===1 ? 'coach needs' : 'coaches need')+' to sign COACH waiver!';
        var nwccListB = document.createElement('ul');
        for(var c=0; c<ccwalB; c++) {
            var nwccListHtml = '<li><span style="font-weight:bold">- '+coachCoachWaiverB[c]+'</span></li>';
            $(nwccListHtml).appendTo(nwccListB);
        }
        $(nwccWrapB).addClass('usersAlert').html(nwccHtmlB).appendTo('#notifications-Users-DivB');
        $(nwccListB).addClass('uaList').appendTo('#notifications-Users-DivB');
    }
    if(coachPlayerWaiverB.length > 0) {
        var cpwalB = coachPlayerWaiverB.length;
        var nwcpWrapB = document.createElement('p');
        var nwcpHtmlB = '* '+cpwalB+' '+(cpwalB===1 ? 'coach needs' : 'coaches need')+' to sign PLAYER waiver!';
        var nwcpListB = document.createElement('ul');
        for(var c=0; c<cpwalB; c++) {
            var nwcpListHtml = '<li><span style="font-weight:bold">- '+coachPlayerWaiverB[c]+'</span></li>';
            $(nwcpListHtml).appendTo(nwcpListB);
        }
        $(nwcpWrapB).addClass('usersAlert').html(nwcpHtmlB).appendTo('#notifications-Users-DivB');
        $(nwcpListB).addClass('uaList').appendTo('#notifications-Users-DivB');
    }
    if(playerNoWaiverB.length > 0) {
        var pnwalB = playerNoWaiverB.length;
        var nwppWrapB = document.createElement('p');
        var nwppHtmlB = '* '+pnwalB+' '+(pnwalB===1 ? 'player needs' : 'players need')+' to sign PLAYER waiver!';
        var nwppListB = document.createElement('ul');
        for(var c=0; c<pnwalB; c++) {
            var nwppListHtml = '<li><span style="font-weight:bold">- '+playerNoWaiverB[c]+'</span></li>';
            $(nwppListHtml).appendTo(nwppListB);
        }
        $(nwppWrapB).addClass('usersAlert').html(nwppHtmlB).appendTo('#notifications-Users-DivB');
        $(nwppListB).addClass('uaList').appendTo('#notifications-Users-DivB');
    }
    
    if(coachCoachWaiverC.length > 0) {
        var ccwal = coachCoachWaiverC.length;
        var nwccWrapC = document.createElement('p');
        var nwccHtmlC = '* '+ccwal+' '+(ccwal===1 ? 'coach needs' : 'coaches need')+' to sign COACH waiver!';
        var nwccListC = document.createElement('ul');
        for(var c=0; c<ccwal; c++) {
            var nwccListHtml = '<li><span style="font-weight:bold">- '+coachCoachWaiverC[c]+'</span></li>';
            $(nwccListHtml).appendTo(nwccListC);
        }
        $(nwccWrapC).addClass('usersAlert').html(nwccHtmlC).appendTo('#notifications-Users-DivC');
        $(nwccListC).addClass('uaList').appendTo('#notifications-Users-DivC');
    }
    if(coachPlayerWaiverC.length > 0) {
        var cpwal = coachPlayerWaiverC.length;
        var nwcpWrapC = document.createElement('p');
        var nwcpHtmlC = '* '+cpwal+' '+(cpwal===1 ? 'coach needs' : 'coaches need')+' to sign PLAYER waiver!';
        var nwcpListC = document.createElement('ul');
        for(var c=0; c<cpwal; c++) {
            var nwcpListHtml = '<li><span style="font-weight:bold">- '+coachPlayerWaiverC[c]+'</span></li>';
            $(nwcpListHtml).appendTo(nwcpListC);
        }
        $(nwcpWrapC).addClass('usersAlert').html(nwcpHtmlC).appendTo('#notifications-Users-DivC');
        $(nwcpListC).addClass('uaList').appendTo('#notifications-Users-DivC');
    }
    if(playerNoWaiverC.length > 0) {
        var pnwal = playerNoWaiverC.length;
        var nwppWrapC = document.createElement('p');
        var nwppHtmlC = '* '+pnwal+' '+(pnwal===1 ? 'player needs' : 'players need')+' to sign PLAYER waiver!';
        var nwppListC = document.createElement('ul');
        for(var c=0; c<pnwal; c++) {
            var nwppListHtml = '<li><span style="font-weight:bold">- '+playerNoWaiverC[c]+'</span></li>';
            $(nwppListHtml).appendTo(nwppListC);
        }
        $(nwppWrapC).addClass('usersAlert').html(nwppHtmlC).appendTo('#notifications-Users-DivC');
        $(nwppListC).addClass('uaList').appendTo('#notifications-Users-DivC');
    }
    
    // Add "player no position" alerts
    if(playerNoPositionA.length > 0) {
        var pnpal = playerNoPositionA.length;
        var pnpWrapA = document.createElement('p');
        var pnpHtmlA = '* '+pnpal+' '+(pnpal===1 ? 'player has' : 'players have')+' no assigned position(s)!';
        var pnpListA = document.createElement('ul');
        for(var p=0; p<pnpal; p++) {
            var pnpListHtml = '<li><span style="font-weight:bold">- '+playerNoPositionA[p]+'</span></li>';
            $(pnpListHtml).appendTo(pnpListA);
        }
        $(pnpWrapA).addClass('usersAlert').html(pnpHtmlA).appendTo('#notifications-Users-DivA');
        $(pnpListA).addClass('uaList').appendTo('#notifications-Users-DivA');
    }
    if(playerNoPositionB.length > 0) {
        var pnpal = playerNoPositionB.length;
        var pnpWrapB = document.createElement('p');
        var pnpHtmlB = '* '+pnpal+' '+(pnpal===1 ? 'player has' : 'players have')+' no assigned position(s)!';
        var pnpListB = document.createElement('ul');
        for(var p=0; p<pnpal; p++) {
            var pnpListHtml = '<li><span style="font-weight:bold">- '+playerNoPositionB[p]+'</span></li>';
            $(pnpListHtml).appendTo(pnpListB);
        }
        $(pnpWrapB).addClass('usersAlert').html(pnpHtmlB).appendTo('#notifications-Users-DivB');
        $(pnpListB).addClass('uaList').appendTo('#notifications-Users-DivB');
    }
    if(playerNoPositionC.length > 0) {
        var pnpal = playerNoPositionC.length;
        var pnpWrapC = document.createElement('p');
        var pnpHtmlC = '* '+pnpal+' '+(pnpal===1 ? 'player has' : 'players have')+' no assigned position(s)!';
        var pnpListC = document.createElement('ul');
        for(var p=0; p<pnpal; p++) {
            var pnpListHtml = '<li><span style="font-weight:bold">- '+playerNoPositionC[p]+'</span></li>';
            $(pnpListHtml).appendTo(pnpListC);
        }
        $(pnpWrapC).addClass('usersAlert').html(pnpHtmlC).appendTo('#notifications-Users-DivC');
        $(pnpListC).addClass('uaList').appendTo('#notifications-Users-DivC');
    }
}


function scheduleNav(callerId, sectionBtn) {
    var subpage = callerId.split('-')[1];
    var destination = '#schedule-'+subpage;
    var newHeader = '<a href="#schedule" onclick="resetSchedule();">Schedule</a> &rarr; ';
    var reNav = false;
    
    if(subpage==='import' || subpage==='season' || subpage==='locations') {
        reNav = subpage.charAt(0).toUpperCase() + subpage.slice(1);
    } else {
        if(subpage==='add') reNav = 'Add Event';
        if(subpage==='newLocation') {
            newHeader = '<a href="#schedule" onclick="locInfoBack(resetSchedule)">Schedule</a> &rarr; ';
            reNav = '<a href="#schedule" onclick="locInfoBack()">Locations</a> &rarr; New';
            destination = '#schedule-locationInfo';
            $('#scheduleBtn-locRemove').hide();
        }
    }
    if(reNav) newHeader += reNav;
    $('.scheduleContent:visible').slideToggle();
    if(sectionBtn) {
        var elem = '#'+callerId;
        $(elem).parent().children('.button').css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75').attr('disabled','disabled');
        $(elem).parent().slideToggle();
        $(elem).css('color', '#cafb05').css('backgroundColor', 'rgba(0,0,0,0.5');
    }
    $(destination).slideToggle(function() {
        if(callerId==='back-locations') $('#locMapMsg').html('Select a place to mark the exact location.');
        if(subpage==='newLocation') initMap();
        if(subpage==='import') {
            if($('#schedule-table').children('tbody').children('tr').length > 0) {
                $('#batchImportWarning').show();
            } else {
                $('#batchImportWarning').hide();
            }
        }
    });
    $('#schedule header h2').html(newHeader);
    $('input.locInfo').val('').removeProp('disabled');
    $('html,body').animate({scrollTop: $('#schedule').children('.container').children('header').children('h2').offset().top}, 500);
    if($('.adminEditWrap').length) $('.btnCancelAE').trigger('click');
}


function initMap() {
    console.log('initializing map');
    var map = new google.maps.Map(document.getElementById('locationMap'), {
      center: {lat: 39.95077327651588, lng: -86.01127624511719},
      zoom: 11
    });
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -44),
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById('locInfo-address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    
    // Show confirmation window
    function showConfirmationWindow(ajaxOverride) {
        var iwTitle = ($('#locInfo-name').val()==='' ? (ajaxOverride && typeof(ajaxOverride)==='string' ? ajaxOverride : place.name) : $('#locInfo-name').val());
        var iwContent = '<div id="locMap-iwContent"><span id="iwTitle">'+iwTitle+'</span><br>';
        var confirmed = $('#locInfo-confirmed').val();
        if(!confirmed || confirmed==='' || confirmed==='false') {
            iwContent += '<span>Drag this pin to mark the exact location.</span><br><button type="button" id="scheduleBtn-confirmLocation">Confirm Location</button>';
        } else {
            iwContent += '<span>Location is confirmed.</span><br><button type="button" id="scheduleBtn-changeLocation">Change</button>';
        }
        infowindow.setContent(iwContent);
        infowindow.open(map, marker);
        locInfoHandlers();
    }
    
    // Place marker on map
    function placeMarker(pos) {
        marker.setIcon(({
          url: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 49),
          scaledSize: new google.maps.Size(50, 50)
        }));
        marker.setAnimation(google.maps.Animation.DROP);
        marker.setPosition(pos);
        marker.setVisible(true);
        marker.addListener('click', showConfirmationWindow);
        marker.addListener('drag', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            $('#locMapMsg-lat').html(marker.position.lat().toPrecision(8));
            $('#locMapMsg-lng').html(marker.position.lng().toPrecision(8));
        });
        marker.addListener('dragend', function() {
            var newPos = marker.getPosition();
            marker.setAnimation(null);
            map.setCenter({lat: newPos.lat()+0.0003, lng: newPos.lng()});
            updatePosition(newPos);
        });
    }
    
    // Update address based on position
    function updatePosition(pos) {
        var upLat = pos.lat();
        var upLng = pos.lng();
        $('#locInfo-lat').val(upLat).trigger('change');
        $('#locInfo-lng').val(upLng).trigger('change');
        $.ajax({
            type: "GET",
            url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+upLat+','+upLng+'&key=AIzaSyCmUKkZ-9UARFxFXzqGUk0_nEmKONW0yOo',
            dataType: 'json',
            success: function(query) {
                if(query.results.length > 0) {
                    var newAddr = query.results[0].formatted_address;
                    $('#locInfo-address').val(newAddr);
                    showConfirmationWindow(newAddr.split(',')[0]);
                }
            }
        });
    }
    
    locMap = {
        map: map,
        marker: marker,
        info: infowindow,
        showConfirm: showConfirmationWindow,
        placePin: placeMarker
    };
    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) return;
        
        // Update UI
        var pLat = place.geometry.location.lat();
        var pLng = place.geometry.location.lng();
        $('#locInfo-address').val(place.formatted_address);
        $('#locInfo-lat').val(pLat).trigger('change');
        $('#locInfo-lng').val(pLng).trigger('change');
        $('#locMapMsg').html('<strong>Exact Location:</strong> &nbsp; <span id="locMapMsg-lat">'+pLat.toPrecision(8)+'</span>, <span id="locMapMsg-lng">'+pLng.toPrecision(8)+'</span>');

        // Mark selected place on the map
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(12);  // 
        }
        placeMarker(place.geometry.location);
        showConfirmationWindow(place.name);
    });
}


function placeMapMarker() {
    var lat = parseFloat(locationInfo.lat);
    var lng = parseFloat(locationInfo.lng);
    var newCenter = {lat: lat, lng: lng};
    locMap.map.setCenter(newCenter);
    locMap.map.setZoom(14);
    locMap.placePin(newCenter);
    locMap.showConfirm();
    locMap.marker.setDraggable(false);
}


function locInfoBack(callback) { 
    var goAhead = true;
    // Check fields
    $('input.locInfo').each(function() {
        var value = $(this).val();       
        if(value && value !== '' && value !== 'false') goAhead = false;
    });
    if($('#locInfo-saved').val() === 'true') {
        goAhead = true;
        $('#locInfo-saved').remove();
    }

    // Prompt user if unsaved data will be lost
    if(!goAhead) {
        var promptUser = window.confirm("You have unsaved data that will be lost! Proceed?");
        if(promptUser===true) {
            if(callback) {
                callback();
            } else {
                locInfoReset();
            }
        }
    } else {
        if(callback) {
            callback();
        } else {
            locInfoReset();
        }
    }
    
    function locInfoReset() {
        scheduleNav('back-locations');
        locationInfo = null;
        locMap.marker.setVisible(false);
        locMap.info.close();
        locMap.map.setCenter({lat: 39.95077327651588, lng: -86.01127624511719});
        $('input.locInfo').val('');
        $('#locInfo-update').remove();
        var sbHtml = '<button type="button" class="button" id="scheduleBtn-locCancel"><i class="icon fa-undo"></i><br>Cancel Changes</button>';
        sbHtml += '<button type="button" class="button" id="scheduleBtn-locSave"><i class="icon fa-save"></i><br>Save Location</button>';
        sbHtml += '<button type="button" class="button removeBtn" id="scheduleBtn-locRemove"><i class="icon fa-remove"></i><br>Remove Location</button>';
        $('#scheduleBtn-locSave').show().parent().empty().html(sbHtml);
    }
}

function locInfoSave() {
    var locStatus = document.createElement('span');
    var okToSave = true;
    var locInfo = {};
    // Check fields
    $('input.locInfo').each(function() {
        var value = $(this).val();       
        if(!value || value==='' || value==='false') {
            okToSave = false;
            if($(this).attr('type')==='hidden') {
                $('#locInfo-address').addClass('hasError');
            } else {
                $(this).addClass('hasError');
            }
        } else {
            var lid = $(this).prop('id').split('-')[1];
            locInfo[lid] = value;
        }
    });
    
    // Check for duplicate name
    var duplicateName = false;
    var luid = ($('#locInfo-update').length ? 'location-'+$('#locInfo-update').val() : 'null');
    var checkLocName = $('#locInfo-name').val().toLowerCase();
    $('.locationsTableRow').each(function() {
        if($(this).prop('id') !== luid) {
            var thisLocName = $(this).children('.locationsTableCell:nth-of-type(1)').html().toLowerCase();
            if(thisLocName === checkLocName) {
                duplicateName = true;
                okToSave = false;
            }
        }
    });
    
    
    if(okToSave) {
        var saveIsUpdate = ($('#locInfo-update').length ? $('#locInfo-update').val() : false);
        $('#scheduleBtn-locRemove').hide();
        $('#scheduleBtn-locCancel').hide();
        $(locStatus).html('<br>Saving...').insertAfter($('#scheduleBtn-locSave'));
        $('.locInfo.hasError').removeClass('hasError');
        $.ajax({
            type: "POST",
            url: '?saveLocation',
            data: { locSave: JSON.stringify(locInfo), update: saveIsUpdate },
            success: function(result) {
                if(result.trim()==='success') {
                    locationInfo = locInfo;
                    if($('#locInfo-update').length) locInfoUpdate();
                    if(!$('#locInfo-saved').length) {
                        $('<input type="hidden" id="locInfo-saved" value="true">').insertAfter($('#locInfo-confirmed'));
                    } else {
                        $('#locInfo-saved').val('true');
                    }
                    $(locStatus).css('color','green').html('<br>Saved!');
                    setTimeout(function() {
                        $(locStatus).fadeOut(function() {
                            $(this).remove();
                        });
                    }, 1750);
                    $('input:text.locInfo').prop('disabled', true);
                    $('#scheduleBtn-locSave').hide();
                    locMap.marker.setClickable(false);
                    locMap.info.close();
                    if(!saveIsUpdate) addLocRow();
                    $('<br><button type="button" onclick="locInfoBack()">Back to Locations</button>').insertAfter('#scheduleBtn-locSave');
                    initAdminNotifications();
                } else {
                    console.log(result);
                }
            }
        });
        
        function addLocRow() {
            var lastRow = $('.locationsTableRow').last();
            var nextIndex = parseInt($(lastRow).prop('id').split('-')[1])+1;
            var locName = '<div class="locationsTableCell">'+locInfo.name+'</div>';
            var locAddr = '<div class="locationsTableCell">'+locInfo.address+'</div>';
            var locNotes = '<div class="locationsTableCell">'+locInfo.notes+'</div>';
            var locLatLng = '<input type="hidden" class="locRowLatLng" value="'+locInfo.lat+','+locInfo.lng+'">';
            var locDiv = document.createElement('div');
            $(locDiv).addClass('locationsTableRow').prop('id', 'location-'+nextIndex).append(locName).append(locAddr).append(locNotes).append(locLatLng);
            $(locDiv).insertAfter(lastRow);
        }
    } else {
        if(duplicateName) {
            $('#locInfo-name').addClass('hasError');
            $(locStatus).html('<br>A location already exists with that name!').css('color','red').insertAfter($('#scheduleBtn-locRemove'));
            setTimeout(function() {
                $(locStatus).fadeOut(function() {
                    $(this).remove();
                });
            }, 1750);
        }
    }
}


function locInfoUpdate() {
    var updateRow = '#location-'+$('#locInfo-update').val();
    $(updateRow).children('.locationsTableCell:nth-child(1)').html(locationInfo.name);
    $(updateRow).children('.locationsTableCell:nth-child(2)').html(locationInfo.address);
    $(updateRow).children('.locationsTableCell:nth-child(3)').html(locationInfo.notes);
}


function locInfoRevert(resetMap) {
    $('#locMapMsg').html('Exact Location: &nbsp; <strong>Confirmed</strong>');
    $('#locInfo-name').val(locationInfo.name);
    $('#locInfo-notes').val(locationInfo.notes);
    $('#locInfo-address').val(locationInfo.addr).prop('disabled',true);
    $('#locInfo-lat').val(locationInfo.lat);
    $('#locInfo-lng').val(locationInfo.lng);
    $('#locInfo-confirmed').val('true');
    if($('#locInfo-saved').length) {
        $('#locInfo-saved').val('true');
    } else {
        var domSaved = document.createElement('input');
        $(domSaved).attr('type', 'hidden').prop('id', 'locInfo-saved').val('true').insertAfter('#locInfo-confirmed');
    }
    if(!$('#locInfo-update').length) $('<input type="hidden" id="locInfo-update" value="'+locationInfo.id+'">').insertAfter('#locInfo-confirmed');
    $('.locInfo.hasError').removeClass('hasError');
    if(resetMap) {
        placeMapMarker();
        locInfoCheckSaved();
    }
}



function locInfoHandlers() {
    $('#locInfo-name').on('keyup', function() {
        var locName = $(this).val();
        $('#iwTitle').html(locName);
    });
    $('input.locInfo').on('change', function() {
        if(locationInfo) locInfoCheckSaved();
    });
    $('input.locInfo').on('keyup', function() {
        if(locationInfo) locInfoCheckSaved();
    });
}


function locInfoView(mEvent) {
    locInfoSet($(mEvent.target).parent());
    locInfoRevert();
    $('#schedule-locations').slideToggle();
    $('#schedule-locationInfo').slideToggle(function() {
        $('#schedule header h2').html('<a href="#schedule" onclick="locInfoBack(resetSchedule)">Schedule</a> &rarr; <a href="#schedule" onclick="locInfoBack()">Locations</a> &rarr; '+locationInfo.name);   
        if(!locMap) {
            initMap();
            setTimeout(placeMapMarker, 500);
        } else {
            placeMapMarker();
        }    
    });
    $('html,body').animate({scrollTop: $('#schedule').children('.container').children('header').children('h2').offset().top}, 500);
}


function locInfoSet(locInfoRow) {
    if(!locInfoRow) {
        locationInfo = null;
        return;
    }
    var locInfoId = $(locInfoRow).prop('id').split('-')[1];
    var locInfoName = $(locInfoRow).children('.locationsTableCell:nth-child(1)').html();
    var locInfoAddr = $(locInfoRow).children('.locationsTableCell:nth-child(2)').html();
    var locInfoNotes = $(locInfoRow).children('.locationsTableCell:nth-child(3)').html();
    var locInfoLatLng = $(locInfoRow).children('.locRowLatLng').val().split(',');
    var locInfoLat = locInfoLatLng[0];
    var locInfoLng = locInfoLatLng[1];
    locationInfo = {
        id: locInfoId,
        name: locInfoName,
        addr: locInfoAddr,
        notes: locInfoNotes,
        lat: locInfoLat,
        lng: locInfoLng
    };
}


function locInfoCheckSaved() {
    var saveValid = true;
    $('input:text.locInfo').each(function() {
        var key = $(this).prop('id').split('-')[1];
        if(key==='confirmed') return;
        if(key==='address') key='addr';
        if($(this).val() !== locationInfo[key]) {
            saveValid = false;
            console.log(locationInfo[key]);
        }
    });
    if(parseFloat($('#locInfo-lat').val()) !== parseFloat(locationInfo.lat)) saveValid = false;
    if(parseFloat($('#locInfo-lng').val()) !== parseFloat(locationInfo.lng)) saveValid = false;
    if($('#locInfo-confirmed').val() !== 'true') saveValid = false;
    if(!saveValid) {
        $('#locInfo-saved').val('false');
        $('#scheduleBtn-locCancel').fadeIn();
    } else {
        $('#locInfo-saved').val('true');
        $('#scheduleBtn-locCancel').fadeOut();
    }
}




function rosterAddUser() {
    var userInfo = rosterCheckFields(true);
    if(userInfo) {
        // Disable UI
        $('.rosterUserInfo').prop('disabled', true);
        $('#rosterBtn-addUserType').hide();
        $('<br><span>Saving...</span>').insertAfter('#rosterBtn-addUserType');
        
        // Send new user data to the server
        var saveBtn = this;
        $.ajax({
            type: "POST",
            url: '?addUser',
            data: {userData: JSON.stringify(userInfo)},
            success: function(result) {
                $(saveBtn).parent().children('br').remove();
                $(saveBtn).parent().children('span').remove();
                if(result.trim()==='success') {
                    var success = '<p style="color:green">'+userInfo.Type+' saved successfully!<br>';
                    success += '<button type="button" onclick="rosterBack(rosterReload)">Back to Roster</button></p>';
                    $(success).insertAfter(saveBtn);
                    rosterRefreshTeams();
                } else {
                    $(saveBtn).show();
                    $('.rosterUserInfo').removeProp('disabled');
                    if(result.trim()==='!username') {
                        $('<p style="color:#FF0000">That username is already in use!</p>').insertBefore(saveBtn);
                    } else {
                        $('<p style="color:#FF0000">An unexpected error occurred. Please try again later.</p>').insertBefore(saveBtn);
                    }
                    setTimeout(function(){$(saveBtn).prev('p').fadeOut(1500, function(){$(this).remove();});}, 3500);
                    console.log(result);
                }
            }
        });
    }
}

function rosterRefreshTeams() {
    $.ajax({
        type: "GET",
        url: "?refreshTeams",
        dataType: "json",
        success: function(teamsResult) {
            $('#teams-table').children('tbody').html(teamsResult.html);
            teamInfo = teamsResult.js;
            initRosterFilter(true);
            initAdminNotifications();
        }
    });
}

function rosterCheckFields(addNew) {
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
    
    if(addNew) {
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
        if($('#roster-addEditUser .hasError:visible').length) {
            if(!$('.addUserError').length) {
                $('<p class="addUserError" style="color:#FF0000">You must specify a value for the highlighted fields.</p>').insertBefore('#rosterBtn-addUserType');
            }
            return false;
        }
    }
    return userObj;
}

function rosterNavTeamPage(teamId) {
    var elem = '#teamsRow-'+teamId;
    if(!teamInfo) {
        $.ajax({
            dataType: "json",
            url: "?teams",
            success: function(result) {
                console.log(result);
                teamInfo = result;
                $(elem).click();
            }
        });
    } else {
        $(elem).click();
    }
}

function resetRosterUserInfo() {
    var saveBtn = $('#rosterBtn-addUserType').clone();
    $(saveBtn).show();
    $('#rosterBtn-addUserType').parent().empty().append(saveBtn);
    $('.rosterUserInfo').removeProp('disabled');
    $('select.rosterUserInfo').val('null');
    $('#rosterUserInfo-Type').val('Player').trigger('change');
    $('#adminUserTypeWrap').show();
    $('#rosterUserInfo-password').val('').prop('placeholder', 'Password');
    $('input:text.rosterUserInfo').val('');
    $('#rosterUserInfo-email').val('');
    $('#rosterUserInfo-phone').val('');
    $('input:checkbox.rosterUserInfo').removeAttr('checked');
    $('input:checkbox.rosterUserInfo-position').removeAttr('checked');
    $('#rosterUserInfo-NamePrefer').parent().hide();
    $('#roster-addEditUser .hasError').removeClass('hasError');
    $('#rosterUserRemoveWrap').hide();
    $('#rosterUserInfo-userId').remove();
    $('#rosterUserInfo-update').remove();
    $('#adminUserTypeFixed').remove();
    $('#adminCoachTeamFixed').remove();
    
}

function initRosterAddUser(isEdit) {
    // Gather available teams
    if(!teamInfo) {
        $.ajax({
            dataType: "json",
            url: "?teams",
            success: function(result) {
                console.log(result);
                teamInfo = result;
                initRosterAddUser(isEdit);
            }
        });
        return;
    }
    
    // Populate Team drop-downs
    $('#rosterUserInfo-playerTeam').empty().html('<option value="null" selected disabled>Select team</option>');
    $('#rosterUserInfo-coachTeam').empty().html('<option value="null" selected disabled>Select team</option>');
    for(var p=0;p<teamInfo.length;p++) {
        var teamCoach = teamInfo[p].coach;
        var teamElem = document.createElement('option');
        $(teamElem).val(teamInfo[p].id).html(teamInfo[p].teamname);
        $(teamElem).appendTo('#rosterUserInfo-coachTeam');
        if(teamCoach !== '[]') $(teamElem).clone().appendTo('#rosterUserInfo-playerTeam');   
    }
    
    if(isEdit) {    
        $('#rosterUserInfo-Type').prop('disabled', true);
        $('#adminUserTypeWrap').hide();
        $('#adminCoachTeamWrap').hide();   
    } else {
        $('#rosterUserInfo-Type').removeProp('disabled');
        $('adminUserTypeWrap').show();
        $('#adminCoachTeamWrap').show();
    }
}

function rosterInitEditUser(userInfoElem) {
    var userType = $(userInfoElem).children('.rosterVal-type').html();
    var userTeamElem = $(userInfoElem).children('.rosterVal-team').children('a');
    var userTeamId = (userType!=='Admin' ? $(userTeamElem).attr('class').split('-')[1] : 'N/A');
    var userTeamName = $(userTeamElem).html();
    $('#rosterUserInfo-Type').val(userType).trigger('change');
    $('<p id="adminUserTypeFixed">User Type: &nbsp; <strong>'+$('#rosterUserInfo-Type').val()+'</strong></p>').insertAfter('#adminUserTypeWrap');
    $('<p id="adminCoachTeamFixed">Team: &nbsp; <strong>'+userTeamName+'</strong></p>').insertAfter('#adminCoachTeamWrap');
    initRosterAddUser(true);
    if(userType !== 'Admin') {
        // Select team
        setTimeout(function() {
            if(userType === 'Player') {
                $('#rosterUserInfo-playerTeam').val(userTeamId).trigger('change');
            } else if(userType === 'Coach') {
                $('#rosterUserInfo-coachTeam').empty().html('<option value="'+userTeamId+'">'+userTeamName+'</option>').val(userTeamId).trigger('change');
            }
        }, 350);
        
        // Select applicable waiver checkboxes
        var userWaiver = $(userInfoElem).children('.rosterVal-waiver').children('span').html();
        if(userType==='Player') {
            if(userWaiver==='Yes') {
                $('#rosterUserInfo-playerWaiver').prop('checked',true);
            } else {
                $('#rosterUserInfo-playerWaiver').removeProp('checked');
            }
        } else {
            if(userWaiver==='Yes') {
                $('#rosterUserInfo-coachWaiver').prop('checked',true);
                $('#rosterUserInfo-cpWaiver').prop('checked',true);
            } else if(userWaiver==='Needs Player') {
                $('#rosterUserInfo-coachWaiver').prop('checked',true);
                $('#rosterUserInfo-cpWaiver').removeProp('checked');
            } else if(userWaiver==='Needs Coach') {
                $('#rosterUserInfo-cpWaiver').prop('checked',true);
                $('#rosterUserInfo-coachWaiver').removeProp('checked');
            } else {
                $('#rosterUserInfo-coachWaiver').removeProp('checked');
                $('#rosterUserInfo-cpWaiver').removeProp('checked');
            }
        }
    }  
}

function initRosterFilter(reInit) {
    if(!teamInfo) {
        $.ajax({
            dataType: "json",
            url: "?teams",
            success: function(result) {
                teamInfo = result;
                initRosterFilter(reInit);
            }
        });
        return;
    } else {        
        // Populate teams list
        $('#roster-filter-team').html('<option value="null">Any</option>');
        for(var t=0; t<teamInfo.length; t++) {
            var opt = '<option value="'+teamInfo[t].id+'"';
            if(reInit && parseInt($('#roster-filter-team').val())===parseInt(teamInfo[t].id)) opt += ' selected';
            opt += '>'+teamInfo[t].teamname+'</option>';
            $('#roster-filter-team').append(opt);
        }
        
        // Populate coaches list
        $('#roster-filter-coach').html('<option value="null">Any</option><option value="None">None</option>');
        $('.teamsVal-coachid').each(function() {
            if($(this).val() !== '[]') {
                //var coachIds = JSON.parse($(this).val());
                var coaches = $(this).parent().children('.teamsVal-coachname').html().split(', ');
                for(var c=0; c<coaches.length; c++) {
                    var opt = '<option value="'+coaches[c]+'">'+coaches[c]+'</option>';
                    $('#roster-filter-coach').append(opt);
                }
            }
        });
    }
}

function filterRoster() {
    if($('#rosterAdmin-list').val() === 'users') {
        // Filter users
        var rank = $('#roster-filter-rank').val();
        var team = $('#roster-filter-team').val();
        var waiver = $('#roster-filter-waiver').val();
        
        $('.rosterRow').show();
        
        if(rank !== 'null') {
            $('.rosterVal-type').each(function() {
                var thisRank = $(this).html();
                if(thisRank !== rank) {
                    $(this).parent().hide();
                }
            });
        }
        
        if(team !== 'null') {
            var teamClass = 'rosterTeam-'+team;
            $('.rosterVal-team').each(function() {
                if(!$(this).children('a').hasClass(teamClass)) {
                    $(this).parent().hide();
                }
            });
        }
        
        if(waiver !== 'null') {
            if(waiver==='Yes') {
                $('.rosterVal-waiver').each(function() {
                    if($(this).children('span').html() !== 'Yes') {
                        $(this).parent().hide();
                    }
                });
            } else {
                $('.rosterVal-waiver').each(function() {
                    if($(this).children('span').html() === 'Yes' || $(this).children('span').html() === 'N/A') {
                        $(this).parent().hide();
                    }
                });
            }
            
        }
    } else {
        // Filter teams
        var division = $('#roster-filter-division').val();
        var coach = $('#roster-filter-coach').val();
        var ready = $('#roster-filter-ready').val();
        
        $('.teamsRow').show();
        
        if(division !== 'null') {
            $('.teamsVal-division').each(function() {
                var thisDivision = $(this).html();
                if(thisDivision !== division) {
                    $(this).parent().hide();
                }
            });
        }
        
        if(coach !== 'null') {
            $('.teamsVal-coachname').each(function() {
                var show = false;
                var coaches = $(this).html().split(', ');
                for(var c=0; c<coaches.length; c++) {
                    if(coach === 'None') {
                        if(coaches[c] === '<span style="color:red">None</span>') show = true;
                    } else {
                        if(coaches[c] === coach) show = true;
                    }
                    
                }
                if(!show) {
                    $(this).parent().hide();
                }
            });
        }
        
        if(ready !== 'null') {
            $('.teamsVal-ready').each(function() {
                var rdyVal = $(this).children('span').html();
                if(rdyVal !== ready) {
                    $(this).parent().hide();
                }
            });
        }
    }
    
}


function rosterSaveTeam() {
    var saveTeamInfo = rosterCheckTeamFields();
    if(!saveTeamInfo) return;
    
    // Disable UI
    $('input.rosterTeamInfo').prop('disabled', true);
    $('#rosterBtn-saveTeam').hide();
    $('#saveTeamStatus').html('<span style="font-style:italic;color:green">Saving...</span>');
    
    // Send data to server
    $.ajax({
        type: "POST",
        url: '?saveTeam',
        data: {teamData: JSON.stringify(saveTeamInfo)},
        dataType: 'json',
        success: function(result) {
            if(result.hasOwnProperty('success')) {
                var success = '<span style="color:green;font-size:1.2em">Saved successfully!</span><br>';
                success += '<button type="button" onclick="rosterBack(resetRosterTeamInfo)">Back to Roster</button>';
                $('#saveTeamStatus').html(success);
                teamInfo = result.js;
                $('#teams-table').children('tbody').html(result.html);
                initRosterFilter(true);
                initAdminNotifications();
            } else {
                $('#rosterBtn-saveTeam').show();
                $('.rosterTeamInfo').removeProp('disabled');
                if(result.message==='!teamname') {
                    $('#saveTeamStatus').html('A team already exists with that name!');
                } else {
                    $('#saveTeamStatus').html('An unexpected error occurred. Please try again later.');
                }
                setTimeout(function() {
                    $('#saveTeamStatus').html('&nbsp;');
                }, 3500);
                console.log(result);
            }
        }
    });
}

function rosterCheckTeamFields() {
    var ok = true;
    var checkTeamInfo = {};
    
    // Check text fields
    var texts = $('input.rosterTeamInfo:text');
    $(texts).each(function() {
        if($(this).val() === '' || !$(this).val()) {
            ok = false;
            $(this).addClass('hasError');
        } else {
            var tiKey = $(this).prop('id').split('-')[1];
            var tiVal = $(this).val();
            checkTeamInfo[tiKey] = tiVal;
        }
    });
    
    // Check team division
    var radio = $('input.rosterTeamInfo:radio');
    var rs = false;
    $(radio).each(function() {
        if($(this).prop('checked')===true) rs = true;
    });
    if(!rs) {
        ok = false;
        $('#rosterTeamInfo-divWrap').addClass('hasError');
    } else {
        var div;
        if($('#rosterTeamInfo-teamDivisionA').prop('checked')===true) div = 'A';
        if($('#rosterTeamInfo-teamDivisionB').prop('checked')===true) div = 'B';
        if($('#rosterTeamInfo-teamDivisionC').prop('checked')===true) div = 'C';
        checkTeamInfo['teamDivision'] = div;
    }
    
    // Check team name
    var nameOk = rosterCheckTeamName($('#rosterTeamInfo-teamName').val(), $('#rosterTeamInfo-teamId').val());
    if(!nameOk) {
        $('#saveTeamStatus').html('A team already exists with that name!');
        return false;
    }
    
    // Check if update
    if($('#rosterTeamInfo-update').length) {
        checkTeamInfo['update'] = 'true';
        checkTeamInfo['teamId'] = $('#rosterTeamInfo-teamId').val();
    }
    
    if(!ok) {
        $('#saveTeamStatus').html('You must specify a value for the highlighted fields!');
        return false;
    } else {      
        return checkTeamInfo;
    }
}

function rosterCheckTeamName(teamname, teamid) {
    var ok = true;
    if(teamid) teamid = parseInt(teamid);
    for(var i=0;i<teamInfo.length;i++) {
        var thisTeam = teamInfo[i].teamname;
        if(thisTeam.toLowerCase() === teamname.toLowerCase()) {
            if(!teamid) {
                ok = false;
                break;
            } else {
                if(teamid !== parseInt(teamInfo[i]['id'])) {
                    ok = false;
                    break;
                }
            } 
        }       
    }
    return ok;
}

function resetRosterTeamInfo() {
    $('input.rosterTeamInfo').val('').removeProp('disabled').removeClass('hasError');
    $('#rosterTeamInfo-divWrap').removeClass('hasError');
    $('#rosterTeamInfo-teamDivisionA').removeProp('checked');
    $('#rosterTeamInfo-teamDivisionB').removeProp('checked');
    $('#rosterTeamInfo-teamDivisionC').removeProp('checked');
    $('#saveTeamStatus').html('&nbsp;');
    $('#rosterBtn-saveTeam').show();
    $('#rosterCoachInfo').html('Coach must be assigned from the "Add User" section after the team has been created.');
    $('#rosterTeamInfo-userId').remove();
    $('#rosterTeamInfo-update').remove();
    rosterReload();
}

function rosterToggleTeams() {
    if($(this).val() === 'teams') {
        if(!teamInfo) {
            $.ajax({
                url: '?teams',
                dataType: 'json',
                success: function(result) {
                    teamInfo = result;
                }
            });
        }
        $('#roster-table').hide();
        $('#teams-table').show();
        $('#rosterFilterType').html('Teams');
    } else { 
       $('#teams-table').hide();
        $('#roster-table').show();
        $('#rosterFilterType').html('Users');
    }
    
    // Reset filter if open
    if($('#roster-filter').css('display') !== 'none') {
        $('#rosterBtn-filter').css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75');
        $('.roster-filter-option').children('select').val('null').trigger('change');
        $('.rosterRow').show();
        $('.teamsRow').show();
        $('#roster-filter').slideToggle();
    }
}

function rosterEditTeam() {
    var teamId = $(this).prop('id').split('-')[1];
    var teamIndex = -1; 
    for(var t=0;t<teamInfo.length;t++) {
        if(parseInt(teamInfo[t].id) === parseInt(teamId)) {
            teamIndex = t;
            break;
        }
    }
    
    if(teamIndex > -1) {
        var removeable = ($(this).children('.teamsVal-removeable').length ? true : false);
        var teamName = teamInfo[teamIndex].teamname;
        var teamDiv = teamInfo[teamIndex].division;
        var coachName = $(this).children('.teamsVal-coachname').html();
        var coachId = teamInfo[teamIndex].coach;
        var layEmail = teamInfo[teamIndex].layemail;
        var layName = teamInfo[teamIndex].layname;
        var layPhone = teamInfo[teamIndex].layphone;
        var orgAddr = teamInfo[teamIndex].orgaddr;
        var orgName = teamInfo[teamIndex].orgname;
        var orgPhone = teamInfo[teamIndex].orgphone;
        $('#rosterTeamInfo-orgName').val(orgName);
        $('#rosterTeamInfo-orgPhone').val(orgPhone);
        $('#rosterTeamInfo-orgAddress').val(orgAddr);
        $('#rosterTeamInfo-layName').val(layName);
        $('#rosterTeamInfo-layPhone').val(layPhone);
        $('#rosterTeamInfo-layEmail').val(layEmail);
        $('#rosterTeamInfo-teamName').val(teamName);
        $('#rosterTeamInfo-teamDivision'+teamDiv).click();
        if(!removeable) {
            $('#rosterTeamInfo-teamName').prop('disabled',true);
            $('.rosterTeamInfo[type=radio]').each(function() {
                if(!$(this).prop('checked')) $(this).prop('disabled', true);
            });
        }
        
        if(coachId !== '[]') {
            var parseCoaches = JSON.parse(coachId);
            if(parseCoaches.length === 1) {
                $('#rosterCoachInfo').html('<strong>Coach:</strong> &nbsp; <a href="#roster" class="coachLink" id="coachLink-'+parseCoaches[0]+'">'+coachName+'</a>');
            } else {
                $('#rosterCoachInfo').html('<strong>Coaches:</strong><br>');
                var cNames = coachName.split(', ');
                for(var i=0;i<parseCoaches.length;i++) {
                    var coachLink = '<a href="#roster" class="coachLink" id="coachLink-'+parseCoaches[i]+'">'+cNames[i]+'</a><br>';
                    $(coachLink).appendTo('#rosterCoachInfo');
                }
            }
        } else {
            $('#rosterCoachInfo').html('Coach must be assigned from the "Add User" section after the team has been created.');
        }

        // Update UI
        if(removeable) {
            $('#rosterBtn-removeTeam').show();
        } else {
            $('#rosterBtn-removeTeam').hide();
        }
        $('#roster-main').slideToggle();
        $('#roster-addEditTeam').slideToggle(function() {
            $('#roster header h2').html('<a href="#roster" onclick="rosterBack(resetRosterTeamInfo)">Roster</a> &rarr; Edit Team');
            $('<input type="hidden" id="rosterTeamInfo-update" class="rosterTeamInfo" value="true">').insertAfter('#saveTeamStatus');
            $('<input type="hidden" id="rosterTeamInfo-teamId" class="rosterTeamInfo" value="'+teamId+'">').insertAfter('#saveTeamStatus');
        });
        $('html,body').animate({scrollTop: $('#roster').offset().top}, 500);
    } else {
        console.log('Internal error: could not find teamId in teamInfo');
    }  
}

function rosterNavCoach() {
    var elem = '#rosterRow-'+$(this).prop('id').split('-')[1];
    $(elem).addClass('coachNav').click();
}

function rosterSort() {
    
}

function fixTime(time) {
    var timeSplit = time.split(':');
    var hrs = parseInt(timeSplit[0]);
    var mins = parseInt(timeSplit[1]);
    var ampm = 'am';
    
    if(hrs >= 12) ampm = 'pm';
    if(hrs > 12) hrs -= 12;
    
    var fixed = hrs+':'+mins+ampm;
    return fixed;
}


function adminTpSelected(teamId) {
    var team;
    var teamIndex = -1;
    
    // Get reference to team data
    for(var t=0;t<teamInfo.length;t++) {
        if(teamInfo[t].id === teamId) {
            team = teamInfo[t];
            teamIndex = t;
        }
    }
        
    // Reset fields
    if(CKEDITOR.instances.tpContent) CKEDITOR.instances.tpContent.destroy();
    $('#tpImgWrap').children('img').remove();
    $('#tpImageFileWrap').show();
    tpImageChanged();
    
    // Populate fields with team data
    $('#tpContent').val(team.tpcontent);
    CKEDITOR.replace('tpContent', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
    $('#tpSlogan').val(team.tpslogan);
    if(team.tpimg !== '') {
        var tpImg = document.createElement('img');
        $(tpImg).prop('src', team.tpimg).appendTo('#tpImgWrap');
        $('#tpImageFileWrap').hide();
        $('#tpBtn-removeImage').show();
    } else {
        $('#tpBtn-removeImage').hide();
    }
    
    // Show editing area
    if(!$('#manageTeamPageWrap').is(':visible')) $('#manageTeamPageWrap').fadeIn();
    
    $('html,body').animate({scrollTop: $('#teampage').offset().top}, 500);
}

function generateImportConflicts(noExist, noGames) {
    var subPage = document.createElement('div');
    var saveBtn = '<button type="button" id="btnResolveConflicts">Resolve Conflicts</button>';
    var neHtml;
    var ngHtml;
    $(subPage).prop('id', 'schedule-importConflicts').addClass('row').addClass('scheduleContent');
    
    if(noExist && noGames) {
        neHtml = gicNoExist(noExist, false);
        ngHtml = gicNoGames(noGames, false);
        $(subPage).append(neHtml);
        $(subPage).append(ngHtml);
    } else {
        if(noExist) { 
            neHtml = gicNoExist(noExist, true);
            $(subPage).html(neHtml);
        }
        if(noGames) { 
            ngHtml = gicNoGames(noGames, true);
            $(subPage).html(ngHtml);
        }
    }
    
    $(subPage).append('<div class="12u" style="padding-top:0">'+saveBtn+'</div>');
    $(subPage).insertAfter('#schedule-import');
    
    if(noExist && noGames) {
        for(var t=0; t<noGames.length; t++) {
            $('.neSelect').append('<option value="'+noGames[t]+'">'+noGames[t]+'</option>');
        } 
    }
}

function gicNoExist(ne, full) {
    var rHtml = '<div class="'+(full ? '12u' : '6u')+'">';
    rHtml += '<h3 style="color:red">Unidentified</h3>';
    rHtml += '<p class="icDescription">The following team(s) are on the schedule but could not be identified. ';
    rHtml += 'You must select the corresponding team or select <strong>New Team</strong> to add the team to the roster.</p>';
    rHtml += '<ul class="icUl">';
    for(var i=0; i<ne.length; i++) {
        rHtml += '<li class="neList"><span class="neTeam">'+ne[i].teamname+'</span><span class="neDiv">'+ne[i].teamdiv+'</span>';
        rHtml += '<span style="float:right"><select id="neSelect-'+i+'" class="neSelect"><option value="_NEW_TEAM" selected>New Team</option>';
        rHtml += '</span></select></li>';
    }
    rHtml += '</ul></div>';
    return rHtml;
}

function gicNoGames(ng, full) {
    var rHtml = '<div class="'+(full ? '12u' : '6u')+'">';
    rHtml += '<h3 style="color:red">No Games</h3>';
    rHtml += '<p class="icDescription">The following existing team(s) have no scheduled games.<br>';
    rHtml += '<span style="font-size:0.8em;"><strong>Note: Removing a team will also remove all associated users.</strong></span></p>';
    rHtml += '<ul class="icUl">';
    for(var i=0; i<ng.length; i++) {
        rHtml += '<li class="ngList"><span class="ngTeam">'+ng[i]+'</span>';
        rHtml += '<span style="float:right;font-size:0.7em;font-weight:bold"><label for="ngRemove-'+i+'">Remove?</label> ';
        rHtml += '<input type="checkbox" class="ngRemove" id="ngRemove-'+i+'" checked></span></li>'; 
    }
    rHtml += '</div>';
    return rHtml;
}

function icDetermineAvailableTeams() {
    var teamsToHide = [];
    $('.neSelect').each(function() {
        var tv = $(this).val();
        if(tv !== '_NEW_TEAM') {
            teamsToHide.push(tv);
        }
    });
    
    $('.neSelect').each(function() {
        var tv = $(this).val();
        $(this).children().each(function() {
            var tcv = $(this).val();
            if(tcv !== tv && tcv !== '_NEW_TEAM') {
                if(teamsToHide.indexOf(tcv) !== -1) {
                    $(this).css('display','none');
                } else {
                    $(this).removeAttr('style');
                }
            }
        });
    });
    
    $('.ngTeam').each(function() {
        var tt = $(this).html();
        if(teamsToHide.indexOf(tt) !== -1) {
            if($(this).parent().is(':visible')) {
                $(this).parent().fadeOut();
            }
        } else {
            if(!$(this).parent().is(':visible')) {
                $(this).parent().fadeIn();
            }
        }
    });
}




/*
 * Event Listeners
 */


// Notifications - Teams alert clicked
$('body').on('click', '.teamsAlert', function() {
    var listElem = $(this).next();
    $('.taList:visible').slideToggle();
    if(!$(listElem).is(':visible')) $(listElem).slideToggle();
});

// Notifications - Games alert clicked
$('body').on('click', '.gamesAlert', function() {
    if($(this).hasClass('gMissingScore')) {
        var gameId = '#' + $(this).prop('id').substr(3);
        $('html,body').animate({scrollTop: $(gameId).offset().top}, 500);
    }
    if($(this).hasClass('gLocAlert')) {
        var listElem = $(this).next();
        $('.gaList:visible').slideToggle();
        if(!$(listElem).is(':visible')) $(listElem).slideToggle();
    }
});

// Notifications - Users alert clicked
$('body').on('click', '.usersAlert', function() {
    var listElem = $(this).next();
    $('.uaList:visible').slideToggle();
    if(!$(listElem).is(':visible')) $(listElem).slideToggle();
});


// Schedule Nav Button clicked
$('body').on('click', '.scheduleNav', function() {
    scheduleNav($(this).prop('id'), $(this).parent().hasClass('section-buttons'));
});

// Schedule - Location Table Row clicked
$('body').on('click', '.locationsTableRow', locInfoView);

// Schedule - Confirm Location button clicked
$('body').on('click', '#scheduleBtn-confirmLocation', function() {
    locMap.marker.setDraggable(false);
    $('#locInfo-confirmed').val('true').trigger('change');
    $('#locInfo-address').prop('disabled', true);
    $('#locMapMsg').html('Exact Location: &nbsp; <strong>Confirmed</strong>');
    $('#locInfo-address').removeClass('hasError');
    locMap.showConfirm();
});

// Schedule - Change Location button clicked
$('body').on('click', '#scheduleBtn-changeLocation', function() {
    var msg = '<strong>Exact Location:</strong> &nbsp; <span id="locMapMsg-lat">'+parseFloat($('#locInfo-lat').val()).toPrecision(8)+'</span>, ';
    msg += '<span id="locMapMsg-lng">'+parseFloat($('#locInfo-lng').val()).toPrecision(8)+'</span>';
    locMap.marker.setDraggable(true);
    $('#locInfo-confirmed').val('false').trigger('change');
    $('#locInfo-address').removeProp('disabled');
    $('#locMapMsg').html(msg);
    locMap.showConfirm();
});

// Schedule -- Location Info - Save Location button clicked
$('body').on('click', '#scheduleBtn-locSave', locInfoSave);

// Schedule -- Location Info - Cancel Changes button clicked
$('body').on('click', '#scheduleBtn-locCancel', locInfoRevert);

// Schedule -- Location Info - Remove Location button clicked
$('body').on('click', '#scheduleBtn-locRemove', function() {
    var locId = $('#locInfo-update').val();
    var rid = '#location-'+locId;
    var confirm = prompt("Are you sure you want to remove this location? This cannot be undone!\r\nType DELETE in the box to confirm");
    if(confirm.toLowerCase() === 'delete') {
        $('#scheduleBtn-locCancel').hide();
        $('#scheduleBtn-locSave').hide();
        $('#scheduleBtn-locRemove').hide();
        $(rid).remove();
        locInfoBack();
        
        // Send remove command to server
        $.ajax({
            type: "POST",
            url: "?removeLocation",
            data: { location: locId },
            success: function(result) {
                if(result.trim() !== 'success') {
                    alert('An unexpected error occurred! The location may have not been removed.');
                    console.log(result);
                } else {
                    initAdminNotifications();
                }
            }
        });
    } 
});

// Schedule - Batch Import File Selected
var importFiles;
$('#importSsFile').change(function() {
    $('#importStatus').html('&nbsp;');
    if(this.files.length > 0) {
        importFiles = this.files;
        $('#btnBatchImport').fadeIn();
    } else {
        if($('#btnBatchImport').is(':visible')) $('#btnBatchImport').fadeOut();
        importFiles = null;
    }
});

// Schedule - Import Spreadsheet Button Clicked
$('body').on('click', '#btnBatchImport', function() {
    $(this).prop('disabled','disabled');
    $('#importSsFile').prop('disabled','disabled');
    $('#importStatus').css('color', '#000').html('Importing spreadsheet data...');
    if($('#batchImportWarning').is(':visible')) {
        $('#batchImportWarning').slideToggle();
    }
    var ssData = new FormData();
    $(importFiles).each(function(key, value) {
        ssData.append(key, value);
    });
    
    $.ajax({
        url: 'import.php',
        type: 'POST',
        data: ssData,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(result) {
            console.log(result);
            if(typeof result.error !== 'undefined') {
                $('#importStatus').css('color', '#FF0000').html(result.error);
                $('#importSsFile').val('').removeProp('disabled');
                $('#btnBatchImport').removeProp('disabled').fadeOut();
            } else if(typeof result.success !== 'undefined') {
                var tne = result.teamsNoExist;
                var tng = result.teamsNoGames;
                $('#importStatus').css('color','green').html('Successfully added '+result.gamesAdded+' games!');
                if(tne !== false || tng !== false) {
                    generateImportConflicts(tne, tng);
                    var tcCount = tne.length + tng.length;
                    var tcHtml = '<br><br><span style="color:red;font-weight:bold">'+tcCount+' team conflicts exist and must be resolved!</span><br>';
                    tcHtml += '<button type="button" style="font-size:0.75em" onclick="viewImportConflicts();">View Conflicts</button>';
                    $(tcHtml).insertAfter('#importStatus');
                } else {
                    $('#importStatus').append('<br><button type="button" onclick="window.location.reload(false)">Reload</button>');
                }
                $('#btnBatchImport').removeProp('disabled').fadeOut();
                initAdminNotifications();
            }
        }
    });
});

// Schedule - Batch Import - View Conflicts Button Clicked
function viewImportConflicts() {
    $('#schedule-import').slideToggle();
    $('#schedule-importConflicts').slideToggle();
    $('#schedule').children('.container').children('header').children('h2').html('Schedule &rarr; Import Conflicts');
    $('.skel-layers-ignoreHref').removeClass('active').addClass('scrollzer-locked');
        $('#schedule-link').addClass('active');
        $('#nav a').each(function() {
            var clone = $(this).clone();
            $(this).replaceWith(clone);
        });
    $('#dashboard').hide();
    $('#roster').hide();
    $('#teampage').hide();
    $('#news').hide();
    $('#content').hide();    
}

// Schedule - Batch Import - Team Identified
$('body').on('change', '.neSelect', function() {
    var thisId = $(this).prop('id');
    icDetermineAvailableTeams(thisId);
});

// Schedule - Batch Import - Resolve Conflicts Button Clicked
var resolveStatusTimer = null;
$('body').on('click', '#btnResolveConflicts', function() {
    var newTeams = [];
    var idTeams = [];
    var removeTeams = [];
    
    if($('.neSelect').length) {
        $('.neSelect').each(function() {
            var tv = $(this).val();
            var tn = $(this).parent().parent().children('.neTeam').html();
            var td = $(this).parent().parent().children('.neDiv').html();
            if(tv === '_NEW_TEAM') {
                var ntObj = {
                    name: tn,
                    division: td
                };
                newTeams.push(ntObj);
            } else {
                var idtObj = {
                    ssName: tn,
                    ssDiv: td,
                    dbName: tv
                };
                idTeams.push(idtObj);
            }
        });
    }
    
    if($('.ngRemove').length) {
        $('.ngRemove').each(function() {
            if($(this).prop('checked')) {
                var mp = $(this).parent().parent();
                if($(mp).is(':visible')) {
                    var rtn = $(mp).children('.ngTeam').html();
                    removeTeams.push(rtn);
                }
            }
        });
    }
    
    // Prepare ajax request
    var adnt = (newTeams.length ? JSON.stringify(newTeams) : false);
    var adidt = (idTeams.length ? JSON.stringify(idTeams) : false);
    var adrt = (removeTeams.length ? JSON.stringify(removeTeams) : false);
    var ajaxData = {
        nt: adnt,
        idt: adidt,
        rt: adrt
    };
    
    // Update UI
    $('.neSelect').prop('disabled',true);
    $('.ngRemove').prop('disabled',true);
    if(!$('#resolveConflictsStatus').length) {
        $('<span id="resolveConflictsStatus">Resolving conflicts...</span>').insertAfter('#btnResolveConflicts');
        $('#btnResolveConflicts').hide();
        resolveStatusTimer = setInterval(function() {
            $('#resolveConflictsStatus').append('.');
        }, 750);
    }
    
    // Send ajax request
    $.ajax({
        type: 'POST',
        url: 'import.php?resolve',
        data: ajaxData,
        dataType: 'json',
        success: function(result) {
            clearInterval(resolveStatusTimer);
            if(result.success === true) {
                $('#resolveConflictsStatus').html(result.log);
                $('#resolveConflictsStatus').append('<button type="button" onclick="window.location.reload(false);">Reload</button>');
            } else {
                $('#resolveConflictsStatus').html('An unexpected error occurred! Check console for details');
                console.log(result);         
            }
        }
    });
});

// Schedule - Existing game clicked
$('body').on('click', '.adminEditable', function(event) {
    if(event.target.className !== 'postScore') {
        var insertPoint = this;
        var ipScore = $(this).children('.scheduleRow-score').html();
        var teams = $(insertPoint).children('.scheduleRow-who').html().split(' &nbsp; vs. &nbsp; ');
        var score = (ipScore==='TBD'||ipScore.indexOf('<span class="postScore')!==-1 ? false : ipScore.split('-'));
        
        var aeWrap = document.createElement('tr');
        var aeLoc = $(this).children('.scheduleRow-where').html();
        var aeLocation = '<option value="'+aeLoc+'" selected>'+aeLoc+'</option>';
        var aeContent = '<td colspan="2" style="text-align:left"><div class="aecWrap">';
        aeContent += '<p style="margin-bottom:10px"><label for="aecDate">Date: &nbsp; </label>';
        aeContent += '<input type="date" id="aecDate" value="'+$(this).children('.gamedate').val()+'">';
        aeContent += '<span style="float:right"><label for="aecTime">Time: &nbsp; </label>';
        aeContent += '<input type="time" id="aecTime" value="'+$(this).children('.gametime').val()+'"></span></p>';
        aeContent += '<p style="margin-bottom:0"><label for="aecLocation">Location: &nbsp; </label><select id="aecLocation">'+aeLocation+'</select>';
        aeContent += '<p class="aeNotice"><strong>Note:</strong> &nbsp; Editing the date or location will affect both games!</p></div></td>';
        aeContent += '<td colspan="3" style="padding-right: 10px;">Runs scored by <strong>'+teams[0]+'</strong>: ';
        aeContent+= '<input type="number" class="scoreRuns team0" value='+(score ? score[0] : '')+'><br>';
        aeContent += 'Runs scored by <strong>'+teams[1]+'</strong>: ';
        aeContent += '<input type="number" class="scoreRuns team1" value='+(score ? score[1] : '')+'><br>';
        aeContent += '<button type="button" class="btnCancelAE">Cancel</button> &nbsp; ';
        aeContent += '<button type="button" class="btnSaveAE">Save Changes</button></td>';
        $(aeWrap).addClass('adminEditWrap').css('display','none').insertAfter(insertPoint).slideToggle(function() {
            $(this).html(aeContent);
            $(insertPoint).prev().css('borderBottom','1px solid');
            $(insertPoint).css('borderBottom','none').css('borderLeft','1px solid').css('borderRight','1px solid').css('fontWeight','400');
            setTimeout(function() {
                $('.locationsTableRow').each(function() {
                    var loc = $(this).children('.locationsTableCell:first').html();
                    if(loc !== aeLoc) {
                        var aLoc = '<option value="'+loc+'">'+loc+'</option>';
                        $(aLoc).appendTo('#aecLocation');
                    }
                });
            }, 10);
        });
        $('#schedule-table tbody tr').removeClass('adminEditable');
        $('.postScore').hide();
        $('.schedule-filter-option').children('select').prop('disabled', true);
    }  
});

// Schedule - Existing Game - Cancel Button Clicked
$('body').on('click', '.btnCancelAE', function() {
    $('.adminEditWrap:visible').fadeOut(function() {
        $('#schedule-table tbody tr').addClass('adminEditable');
        $('.postScore').show();
        $('.schedule-filter-option').children('select').removeProp('disabled');
        $(this).prev().removeAttr('style').prev().removeAttr('style');
        $(this).remove();
    });
});

// Schedule - Existing Game - Save Changes Button Clicked
$('body').on('click', '.btnSaveAE', function() {
    var parent = $(this).parent().parent().prev();
    var gidParts = $(parent).prop('id').split('-');
    var gameId = gidParts[1];
    var matchId = parseInt(gidParts[2]);
    var gamedate = $('#aecDate').val();
    var gametime = $('#aecTime').val();
    var gameLoc = $('#aecLocation').val();
    var team1 = (matchId===1 ? $(this).parent().children('.team0').val() : $(this).parent().children('.team1').val());
    var team2 = (matchId===1 ? $(this).parent().children('.team1').val() : $(this).parent().children('.team0').val());
    var t1score = parseInt(team1);
    var t2score = parseInt(team2);
    if(t1score==='' || !t1score) t1score = 0;
    if(t2score==='' || !t2score) t2score = 0;
    if(gamedate==='') {
        $('#aecDate').addClass('hasError');
        return;
    }
    if(gametime==='') {
        $('#aecTime').addClass('hasError');
        return;
    }
    
    $(this).prop('disabled',true);
    $('.btnCancelAE').hide();
    
    // Update hidden values
    $(parent).children('.gametime').val(gametime);
    $(parent).children('.gamedate').val(gamedate);
      
    // Prepare data to be saved
    var saveData = {
        game: gameId,
        match: matchId,
        date: gamedate,
        time: gametime,
        loc: gameLoc,
        t1: t1score,
        t2: t2score
    };
    
    // Send data to server
    $.ajax({
        type: "POST",
        url: '?updateGame',
        data: saveData,
        dataType: 'json',
        success: function(result) {
            if(result.hasOwnProperty('success')) {
                // Reload the schedule list
                $.ajax({
                    type: "GET",
                    url: "?scheduleReload",
                    success: function(srResult) {
                        $('#schedule-table').children('tbody').html(srResult);
                        initSchedule(true);
                        filterSchedule();
                        $('.schedule-filter-option').children('select').removeProp('disabled');
                        initAdminNotifications();
                    }
                });      
            } else {
                console.log(result);
                var errorHtml = '<p id="errSaveAE" style="margin-bottom:0;color:red">An unexpected error occurred! Changes may not have been saved.</p>';
                $(errorHtml).insertAfter('.btnSaveAE');
                setTimeout(function() {
                    $('#errSaveAE').fadeOut(function() {
                        $(this).remove();
                    });
                }, 3000);
            }
        }
    });
});


// Schedule - Season - Export Button Clicked
$('body').on('click', '.exportBtn', function() {
    alert('Export functionality coming soon!');
});

// Schedule - Season - End Season Button Clicked
$('body').on('click', '#scheduleBtn-endSeason', function() {
    $(this).fadeOut(function() {
        $('#scheduleEndSeason').fadeIn();
    });
});

// Schedule - End Season - Yes Button Clicked
$('body').on('click', '#endSeason-yes', function() {
    $('#scheduleEndSeason').html('Archiving season data...');
    $.ajax({
        type: 'GET',
        url: '?endSeason',
        success: function(result) {
            if(result.trim() === 'success') {
                var updateUI = '<span style="color:green">Season archived successfully!</span><br><br>';
                updateUI += '<button type="button" onclick="location.reload(true)">Reload</button>';
                $('#scheduleEndSeason').html(updateUI);
            }
        }
    });
});

// Schedule - End Season - No Button Clicked
$('body').on('click', '#endSeason-no', function() {
    $('#scheduleEndSeason').fadeOut(function() {
        $('#scheduleBtn-endSeason').fadeIn();
    });
});



// Roster - Add User button clicked
$('body').on('click', '#rosterBtn-addUser', function() {
    $('#roster-main').slideToggle();
    $('#roster-addEditUser').slideToggle(function() {
        $('#roster header h2').html('<a href="#roster" onclick="rosterBack(resetRosterUserInfo)">Roster</a> &rarr; Add User');
    });
    $('html,body').animate({scrollTop: $('#roster').children('.container').children('header').children('h2').offset().top}, 500);
    initRosterAddUser();
});

// Roster - Add User Type changed
$('#rosterUserInfo-Type').on('change', function() {
    var userType = $(this).val();
    var newType = '#rosterUserInfoWrap-'+userType;
    $('#rosterUserType').html(userType);
    $('.rosterUserInfoWrap').hide();
    $(newType).show();
});

// Roster -- Add User -- Add <usertype> button clicked
$('body').on('click', '#rosterBtn-addUserType', rosterAddUser);

// Roster - Add Team button clicked
$('body').on('click', '#rosterBtn-addTeam', function() {
    $('#roster-main').slideToggle();
    $('#roster-addEditTeam').slideToggle(function() {
        $('#roster header h2').html('<a href="#roster" onclick="rosterBack(resetRosterTeamInfo)">Roster</a> &rarr; Add Team');
    });
    $('html,body').animate({scrollTop: $('#roster').children('.container').children('header').children('h2').offset().top}, 500);
});

// Roster - Save Team button clicked
$('body').on('click', '#rosterBtn-saveTeam', rosterSaveTeam);

// Roster - Show Table selection changed
$('#rosterAdmin-list').on('change', rosterToggleTeams);

// Roster - Existing team clicked
$('body').on('click', '.teamsRow', rosterEditTeam);

// Roster - Edit Team - Coach link clicked
$('body').on('click', '.coachLink', rosterNavCoach);

// Roster - Filter users/teams button
$('body').on('click', '#rosterBtn-filter', function() {
    var rvElem = '#rosterFilter-' + $('#rosterAdmin-list').val();
    $('.rosterFilterWrap').hide();
    $(rvElem).show();
    
    if($('#roster-filter').css('display') === 'none') {
        $(this).css('color', '#cafb05').css('backgroundColor', 'rgba(0,0,0,0.5');
    } else {
        $(this).css('color', '#fff').css('backgroundColor', 'rgba(0,0,0,0.75');
    }
    $('#roster-filter').slideToggle();
    $('.rosterRow').show();
    $('.teamsRow').show();
    
    initRosterFilter();
});

// Roster - Filter Users
$('body').on('change', '#roster-filter-rank', filterRoster);
$('body').on('change', '#roster-filter-team', filterRoster);
$('body').on('change', '#roster-filter-waiver', filterRoster);

// Roster - Filter Teams
$('body').on('change', '#roster-filter-division', filterRoster);
$('body').on('change', '#roster-filter-coach', filterRoster);
$('body').on('change', '#roster-filter-ready', filterRoster);





// Team Page - Team Selected
$('#adminTeamSelector').on('change', function() {
    var teamId = $(this).val();
    if(!teamInfo) {
        $.ajax({
            dataType: "json",
            url: "?teams",
            success: function(result) {
                teamInfo = result;
                adminTpSelected(teamId);
            }
        });
        return;
    }
    adminTpSelected(teamId);
});


// Site Content - Sub list item clicked
$('body').on('click', '#contentSubList ul li', function() {
    if(!$(this).hasClass('selected')) {
        var dest = $(this).html().split(' ')[0].toLowerCase();
        var dElem = '#content-'+dest;
        $('.contentSub').hide();
        $(dElem).show();
        $('#contentSubList ul li.selected').removeClass('selected');
        $(this).addClass('selected');
    }     
});

// Site Content - Info Page sub list item clicked
$('body').on('click', '#infoContentSub li', function() {
    if(!$(this).hasClass('selected')) {
        var dest = $(this).html().replace(' ','').replace("'",'').toLowerCase();
        var dElem = '#contentInfo-'+dest;
        $('.contentInfoWrap').hide();
        $(dElem).show();
        $('#infoContentSub li.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

// Site Content - Save Content button clicked
$('body').on('click', '#btnSaveSiteContent', function() {
    $(this).prop('disabled', 'disabled');
    $('#saveSiteContentStatus').html('Saving...');
    
    var siteContent = {
        home: {},
        info: {}
    };
    $.each(CKEDITOR.instances, function(key, val) {
        var scKey = key.split('-');
        if(scKey[0]==='siteContent') {
            var scp = scKey[1];
            var sce = scKey[2];
            siteContent[scp][sce] = val.getData();
        }
    });
    $.ajax({
        type: "POST",
        url: "?editSiteContent",
        data: siteContent,
        success: function(result) {
            if(result.trim()==='success') {
                $('#btnSaveSiteContent').removeProp('disabled');
                $('#saveSiteContentStatus').html('Saved successfully!');
                setTimeout(function() {
                    $('#saveSiteContentStatus').fadeOut(function() {
                        $(this).html('&nbsp;').show();
                    });
                }, 1500);
            } else {
                console.log(result);
            }
        }
    });
});


$(document).ready(function() {
    // Setup site content editors
    CKEDITOR.replace('siteContent-home-homeBlurb', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
    CKEDITOR.replace('siteContent-info-aboutus', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
    CKEDITOR.replace('siteContent-info-locations', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
    CKEDITOR.replace('siteContent-info-rules', {
        on: {
            instanceReady: function(ev) {
                this.dataProcessor.writer.indentationChars = '';
                this.dataProcessor.writer.lineBreakChars = '';  
            }
        }
    });
});


