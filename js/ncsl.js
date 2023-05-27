var loadedPage = window.location.pathname;
var isMobile = (($('html').hasClass('mobile')) ? true : false);
var inTransition = false;
var ncslBaseUrl = 'https://www.knoxy.tk/portfolio/ncsl/';
var scheduleData;
var scheduleMap;
var standingsData;
var waiverLock = (window.location.search==='?waiver' ? true : false);

function navClick(href, caller, pop) {
    if(!waiverLock) {
        var ajaxContent = (pop ? '' : ncslBaseUrl) + href.substr(0, href.indexOf(' #main'))+'?ajax';
        if(href.substr(0,1) === ' ') ajaxContent = 'index.php?ajax';
        inTransition = true;
        $('li.active').removeClass('active');
        $(caller).parent().addClass('active');
        $('#main').fadeOut(function() {
            var loaded = false;
            $('#mainContentWrapper').load(ajaxContent, function() {
                loaded = true;
                if(!pop) history.pushState($(caller).prop('href'), null, $(caller).prop('href'));
                inTransition = false;
                $('#main').fadeIn();
                initNcslData();
            });
            setTimeout(function() {
                if(!loaded) $('#mainContentWrapper').html('<div class="container">Loading...</div>');
            }, 1000);
        });
    }
}

function loginSubmit(e) {
    e.preventDefault();
    var formData = $('#loginForm').serialize();
    $.ajax({
        type: "POST",
        url: ncslBaseUrl+"ncsl.php?login",
        data: formData,
        success: function(result) {
            result = result.trim();
            if(result.substr(0,7)==='success') {
                var userRank = result.substr(9);
                if(userRank==='Admin' || userRank==='Coach') {
                    // Redirect to admin page
                    if(loadedPage.indexOf('/admin') === -1) {
                        window.location = 'admin';
                    } else {
                        window.location.reload();
                    }
                } else {
                    if(loadedPage.indexOf('/admin') !== -1) {
                        window.location = ncslBaseUrl;
                        return;
                    }
                    // Player login successful
                    inTransition = true;
                    $('#main').fadeOut(function() {
                        var loaded = false;
                        $('li.active').children('a').html('News');
                        $('#nav ul').append('<li><a title="My Account" href="account"><i id="userButton" style="display:none" href="account" class="fa fa-user" aria-hidden="true"></i></a></li>');
                        $('#userButton').fadeIn(750);
                        $('#mainContentWrapper').load(ncslBaseUrl+'news.php?ajax', function() {
                            loaded = true;
                            inTransition = false;
                            $('#main').fadeIn();
                        });
                        setTimeout(function() {
                            if(!loaded) $('#mainContentWrapper').html('<div class="container">Loading...</div>');
                        }, 1000);
                        if(isMobile) {
                            $('#userButton').parent().html('My Account');
                        }
                    });
                }
            } else {
                if(result.trim()==='waiver') {
                    // Handle waiver redirect
                    window.location = '?waiver';
                } else {
                    // Handle invalid login
                    if(!$('#btnloginSubmit').parent().children('span').length) {
                        var invalid = document.createElement('span');
                        $(invalid).css('color','red').html('&nbsp; &nbsp; &nbsp; Invalid combination!').insertAfter('#btnloginSubmit');
                        setTimeout(function() {
                            $(invalid).fadeOut(function() {
                                $(this).remove();
                            });
                        }, 1500);
                    } 
                }  
            }
        }
    });
}

function scheduleFilterToggle() {
    var fHeight = $('#scheduleFilter').height();
    if(fHeight < 50) {
        $('#scheduleFilter').animate({height:"225px"}, function() {
            $('#btnScheduleFilterToggle').html('<i class="fa fa-angle-double-up" aria-hidden="true"></i>');
        });
    } else {
        $('#scheduleFilter').animate({height:"40px"}, function() {
            $('#btnScheduleFilterToggle').html('<i class="fa fa-angle-double-down" aria-hidden="true"></i>');
        });
    }
}

function filterSchedule() {
    var division = $('#scheduleFilter-division').val();
    var team = $('#scheduleFilter-team').val();
    var day = $('#scheduleFilter-day').val();
    var loc = $('#scheduleFilter-loc').val();
    var blPre = 'All Divisions';
    var blSfx = '';
    
    // Update teams list when necessary
    if(division !== "all") {
        blPre = division+' Division';
        $('#scheduleFilter-team').children('option').show().each(function() {
            var teamOption = $(this).val();
            if(scheduleData.teams[division].indexOf(teamOption)<0) $(this).hide();
        });
        if(team !== 'all') {
            var td;
            var tk = Object.keys(scheduleData.teams);
            for(var k=0;k<tk.length;k++) {
                var div = tk[k];
                if(scheduleData.teams[div].indexOf(team)>=0) {
                    td = div;
                    break;
                }
            }
            if(td !== division) {
                $('#scheduleFilter-team').val('all');
                team = 'all';
                blPre = division+' Division';
                blSfx = '';
            }
        }
    } else {
        blPre = 'All Divisions';
        $('#scheduleFilter-team').children('option').show();
    }
    
    if(team !== 'all') {
        
        if(division !== 'all') {
            blPre = division+' Division';
            blSfx = team;
        } else {
            blPre = team;
            blSfx = '';
        }
        
    }
    
    // Filter each row by user-specified criteria
    $('.scheduleTableRow').each(function() {
        var showMe = true;
        if(division !== 'all') {
            var myDiv = $(this).children('.scheduleDivision').val();
            if(myDiv !== division) showMe = false;
        }       
        if(showMe && team !== 'all') {
            var team1 = $(this).children('.who').children('strong:nth-child(1)').html();
            var team2 = $(this).children('.who').children('strong:nth-child(2)').html();
            if(team1 !== team && team2 !== team) showMe = false;
        }     
        if(showMe && day !== 'all') {
            var myDay = $(this).children('.scheduleGameday').val();
            if(myDay !== day) showMe = false;
        }
        if(showMe && loc !== 'all') {
            var myLoc = $(this).children('.where').html();
            if(myLoc !== loc) showMe = false;
        }
        
        if(showMe) {
            $(this).show();
        } else {
            $(this).hide();
        }      
    });
    
    if($('.scheduleTableRow:visible').length===0) {
        $('#scheduleStatus').html('No games match your criteria!');
    } else {
        $('#scheduleStatus').html('Select a game to see more details.');
    }
    
    $('#scheduleDisplay').html((blSfx==='' ? blPre : blPre+' - '+blSfx));
    
}

function initNcslData() {
    var page = $('#main').attr('class');
    if(page) {
        var pageDataUrl = page.toLowerCase()+'?data';
        if(page==='Schedule') {
            if(!scheduleData) {
                $.ajax({
                    dataType: 'json',
                    url: pageDataUrl,
                    success: function(result) {
                        scheduleData = result;
                        initSchedule();                     
                    }
                });
            } else {
                initSchedule();
            }
        }
        if(page==='Standings') {
            if(!standingsData) {
                $.ajax({
                    dataType: 'json',
                    url: pageDataUrl,
                    success: function(result) {
                        standingsData = result;
                        initStandings();
                    }
                });
            } else {
                initStandings(true);
            }
        }
    }
}

function initSchedule() {
    // Setup table
    var games = scheduleData.games;
    var locs = [];
    var days = [];
    for(var g=0;g<games.length;g++) {
        var row = document.createElement('div');
        var who = document.createElement('div');
        var when = document.createElement('div');
        var where = document.createElement('div');
        var whoHtml = '<strong>'+games[g].team1+'</strong> &nbsp; vs. &nbsp; <strong>'+games[g].team2+'</strong>';
        var dateSplit = games[g].gamedate.split('-');
        var props = '<input type="hidden" class="scheduleDivision" value="'+games[g].division+'">';
        props += '<input type="hidden" class="scheduleGameday" value="'+games[g].gameday+'">';
        if(locs.indexOf(games[g].field)<0) locs.push(games[g].field);
        if(days.indexOf(games[g].gameday)<0) days.push(games[g].gameday);
        $(who).addClass('scheduleTableCell').addClass('who').html(whoHtml);
        $(when).addClass('scheduleTableCell').addClass('cuando').html(games[g].gameday.substr(0,3)+' '+dateSplit[1]+'/'+dateSplit[2]+'/'+dateSplit[0].substr(2));
        $(where).addClass('scheduleTableCell').addClass('where').html(games[g].field);
        $(row).prop('id', 'game-'+g).addClass('scheduleTableRow').append(who).append(when).append(where).append(props).appendTo('#scheduleTableBody');
    }

    // Setup filter
    var teams = scheduleData.teams;
    for(var a=0;a<teams.A.length;a++) {
        $('#scheduleFilter-team').append('<option value="'+teams.A[a]+'">'+teams.A[a]+'</option>');
    }
    for(var b=0;b<teams.B.length;b++) {
        $('#scheduleFilter-team').append('<option value="'+teams.B[b]+'">'+teams.B[b]+'</option>');
    }
    for(var c=0;c<teams.C.length;c++) {
        $('#scheduleFilter-team').append('<option value="'+teams.C[c]+'">'+teams.C[c]+'</option>');
    }
    for(var d=0;d<days.length;d++) {
        $('#scheduleFilter-day').append('<option value="'+days[d]+'">'+days[d]+'</option>');
    }
    for(var l=0;l<locs.length;l++) {
        $('#scheduleFilter-loc').append('<option value="'+locs[l]+'">'+locs[l]+'</option>');
    }

    // Update UI
    $('#scheduleStatus').html('<p>Select a game to see more details.</p>');
    $('#scheduleFilter').fadeIn('slow');
    $('#scheduleTable').fadeIn('slow');
    if($('#myTeamName').length) $('#scheduleFilter-team').val($('#myTeamName').val()).trigger('change');
}

function scheduleInfo(rowElem) {
    var rowId = parseInt($(rowElem).prop('id').split('-')[1]);
    var row = scheduleData.games[rowId];
    var rowLoc = scheduleLocation(row.field);
    var rowYmd = row.gamedate.split('-');
    var gameDate = new Date(rowYmd[0], rowYmd[1]-1, rowYmd[2]).toDateString().split(' ');
    var am1pm = 'am';
    var am2pm = 'am';
    var g1time = row.game1.split(':');
    var g2time = row.game2.split(':');
    var g1hour = parseInt(g1time[0]);
    var g2hour = parseInt(g2time[0]);
    if(g1hour >= 12) am1pm = 'pm';
    if(g1hour > 12) g1hour -= 12;
    if(g2hour >= 12) am2pm = 'pm';
    if(g2hour > 12) g2hour -= 12;
    var strGame1 = row.gameday+' '+gameDate[1]+' '+gameDate[2]+', '+gameDate[3]+' at '+g1hour+':'+g1time[1]+am1pm;
    var strGame2 = row.gameday+' '+gameDate[1]+' '+gameDate[2]+', '+gameDate[3]+' at '+g2hour+':'+g2time[1]+am2pm;
    $('.noLoc').remove();
    if(rowLoc===false) {
        $('#scheduleMap').hide();
        if(!$('.noLoc').length) $('#scheduleMapWrap').append('<p class="noLoc"><strong>'+row.field+'</strong><br><br>No location information is available.</p>');
    } else {
        $('#scheduleMap').show();
        loadMap(rowLoc);
    }

    $('#scheduleInfo-game1-teams').html('<strong>'+row.team1+'</strong><br>vs.<br><strong>'+row.team2+'</strong>');
    $('#scheduleInfo-game1-when').html(strGame1);

    $('#scheduleInfo-game2-teams').html('<strong>'+row.team2+'</strong><br>vs.<br><strong>'+row.team1+'</strong>');
    $('#scheduleInfo-game2-when').html(strGame2);
    
    $('#scheduleContent-info').fadeIn();
}

function scheduleLocation(field) {
    var locId = false;
    for(var f=0;f<scheduleData.locations.length;f++) {
        if(scheduleData.locations[f].name === field) {
            locId = f;
            break;
        }
    }
    return locId;
}

function loadMap(locId) {
    if(scheduleMap) {
        setTimeout(function(){
            google.maps.event.trigger(scheduleMap, 'resize');
            scheduleMap.setCenter(locPosition);
        }, 100);
    }
    var location = scheduleData.locations[locId];
    var locPosition = {lat: parseFloat(location.lat), lng: parseFloat(location.lng)};
    var locAddr = location.address.split(', ');
    
    scheduleMap = new google.maps.Map(document.getElementById('scheduleMap'), {
      center: locPosition,
      zoom: 15
    });
    var marker = new google.maps.Marker({
      map: scheduleMap,
      anchorPoint: new google.maps.Point(0, -44),
      draggable: false,
      position: locPosition
    });
    
    var infowindow = new google.maps.InfoWindow();
    var infoContent = '<p><strong>'+location.name+'</strong><br>'+location.notes+'</p><p>'+locAddr[0]+', '+locAddr[1]+', '+locAddr[2]+'</p>';
    showInfo(infoContent);
    marker.addListener('click', function() {
        showInfo(infoContent);
    });
    function showInfo(content) {
        infowindow.setContent(content);
        infowindow.open(scheduleMap, marker);
    }
}


function initStandings(quick) {
    for(var t=0;t<standingsData.length;t++) {
        var thisTeam = standingsData[t];
        var thisListing = document.createElement('li');
        var listInner = thisTeam.teamname+'<span>'+thisTeam.points+' pts</span>';
        $(thisListing).prop('id', 'team-'+t).html(listInner).appendTo('#teamList-'+thisTeam.division);
        if(!quick) {
            $('#standingsLoading').fadeOut(function() {
                $('#standingsRow').fadeIn();
            }); 
        } else {
            $('#standingsLoading').hide();
            $('#standingsRow').show();
        }
    }
}

function initTeamPage(teamObj) {
    var divRank = teamDivisionRank(teamObj);
    var rankHtml = '<strong>#'+divRank+'</strong> in Division '+teamObj.division+' &nbsp;&nbsp; <span style="font-size:0.8em">(';
    $('#standingsByline').html(rankHtml+teamObj.points+' points, '+teamObj.crd+' RD)</span>');
    
    $('.standingsBack').fadeIn();
    $('header h2').css('marginTop', '30px').html(teamObj.teamname);
    if(!isMobile) $('header h2').css('fontSize', '2.5em');
    
    var tpContent = '<p>Coach-manageable team page content will go here...</p>';
    if(teamObj.tpcontent !== '') tpContent = teamObj.tpcontent;
    
    var tpImg = 'Team logo/image here';
    if(teamObj.tpimg !== '') tpImg = '<img src="'+teamObj.tpimg+'" style="max-width:325px;max-height:200px;">';
    
    var tpSlogan = 'Team slogan or photo caption here';
    if(teamObj.tpslogan !== '') tpSlogan = teamObj.tpslogan;
    
    // Show team page content
    $('#teamPageContent').html(tpContent);
    
    // Show team page image
    if(teamObj.tpimg === '') {
        $('#teamPageImageWrap').hide();
    } else {
        $('#teamPageImageWrap').html(tpImg).show();
    }
    
    // Show team page slogan
    if(teamObj.tpslogan === '') {
        $('#teamPageSlogan').hide();
    } else {
        $('#teamPageSlogan').html(tpSlogan).show();
    }
    
    
    $('#teamPageWrapper').fadeIn();
    teamGameHistory(teamObj.teamname);
}

function teamGameHistory(teamName) {
    $('#gameHistoryInner').empty().html('<div class="loader"></div>');
    $.ajax({
        type: "POST",
        url: "?gameHistory",
        data: {team: teamName},
        dataType: 'json',
        success: function(gh) {
            if(gh.length > 0) {
                // show team game history
                var ul = document.createElement('ul');
                for(var i=0;i<gh.length;i++) {
                    var inner = '<span class="ghDate">'+gh[i].date+'</span> &nbsp; &nbsp; &nbsp; &nbsp; <span class="ghOpponent">'+gh[i].opponent+'</span> ';
                    inner += '&nbsp; &nbsp; &nbsp; &nbsp; <span class="ghResult">'+gh[i].result+'</span>';
                    var li = document.createElement('li');
                    $(li).html(inner).appendTo(ul);
                }
                $('#gameHistoryInner').empty();
                $(ul).css('width','300px').appendTo('#gameHistoryInner');
            } else {
                $('#gameHistoryInner').empty().html('<p style="font-style:italic">No games played this season!</p>');
            }
                
        }
    });
}

function teamDivisionRank(team) {
    var divTeams = [];
    var rank = 1;
    for(var t=0;t<standingsData.length;t++) {
        var thisTeam = standingsData[t];
        if(thisTeam.division === team.division) divTeams.push(thisTeam);
    }   
    for(var d=0;d<divTeams.length;d++) {
        if(parseInt(divTeams[d].id) !== parseInt(team.id)) {
            rank++;
        } else {
            break;
        }
    }   
    return rank;
}



function updateAccountInfo(accInfo) {
    $.ajax({
        type: "POST",
        data: accInfo,
        url: 'account.php?update',
        success: function(result) {
            if(result.trim() !== 'success') {
                $('#updateAccountStatus').css('color','red').html(result);
            } else {
                $('#updateAccountStatus').css('color','green').html('Updated successfully!');
            }
            setTimeout(function() {
                $('#updateAccountStatus').fadeOut(function() {
                    $(this).empty().removeAttr('style');
                });
            }, 2500);
        }
    });
}

window.addEventListener('popstate', function(e) {
    console.log(e);
    var fullUrl = e.state;
    if(!fullUrl) fullUrl = './index.php';
    var ssStart = fullUrl.lastIndexOf('/') + 1;
    var caller = fullUrl.substr(ssStart);
    var popCollar;
    $('li.active').removeClass('active');
    $('#nav').children('ul').children('li').each(function() {
        var thisLink = $(this).children('a').prop('href');
        var linkFile = thisLink.substr(thisLink.lastIndexOf('/')+1);
        if(linkFile === caller) popCollar = $(this).children('a');
    });
    try {
        navClick(fullUrl+' #main', popCollar[0], true);
        console.log(fullUrl);
    } catch(e) {
        navClick('./index.php #main', $('#nav ul li:first a'), false);
    }
     
});



$(document).ready(function() {
    initNcslData();
    
    // Nav link handler
    $('body').on('click', '#nav ul li a', function(e) {
        e.preventDefault();
        if(!inTransition) {
            var href = e.target.href;
            if(!href) {
                if(e.target.id === 'userButton') {
                    href = 'account.php';
                } else {
                    href = './index.php';
                }

            }
            var ssStart = href.lastIndexOf('/') + 1;
            var caller = href.substr(ssStart) + ' #main';
            navClick(caller,this);
        }
    });
    
    // Logout button click handler
    $('body').on('click', '#logoutBtn', function() {
        inTransition = true;
        $('#logoutBtn').prop('disabled', true).html('Logging out...');
        $.ajax({
            type: "GET",
            url: "ncsl.php?logout",
            success: function(result) {
                result = result.trim();
                if(result==='success') {
                    $('#main').fadeOut(function() {
                        $('#mainContentWrapper').html('<div class="container">Loading...</div>').load('index.php?ajax', function() {
                            history.pushState('./', null, './');
                            $('#main').fadeIn();
                            $('li.active').fadeOut(750, function() {
                                $(this).remove();
                                inTransition = false;
                            });
                            $('nav ul li:first').addClass('active').children('a').html('Home');
                        });
                    });
                } else {
                    alert('An unexpected server communication error occured. Please refresh the page and try again.');
                }
            }
        });
    });
    
    // Footer link click handler
    $('body').on('click', '.ncslFooterLink', function(e) {
        e.preventDefault();
        var fc = $(this).prop('href') + ' #main';
        navClick(fc, this, true);
    });
    
    // Schedule filter re-style on orientation change
    skel.onStateChange(function() {
        var state = skel.stateId.trim();
        if(state === 'mobile') {
            $('#scheduleFilter').css('height','40px');
            $('#btnScheduleFilterToggle').html('<i class="fa fa-angle-double-down" aria-hidden="true"></i>');
        } else {
            $('#scheduleFilter').css('height','225px');
            $('#btnScheduleFilterToggle').html('<i class="fa fa-angle-double-up" aria-hidden="true"></i>');
        }
    });
    
    // Schedule filter toggle handler
    $('body').on('click', '.scheduleFilterHeader', function() {
        scheduleFilterToggle();
    });
    $('body').on('touchstart', '.scheduleFilterHeader', scheduleFilterToggle);
    
    // Schedule filter option changed
    $('body').on('change', '.scheduleFilterOption', function() {
        filterSchedule();
    });
    
    // Schedule table row clicked
    $('body').on('click', '.scheduleTableRow', function() {
        var row = this;
        var offscreenLeft = $(document).width() * -1 + 'px';
        var offscreenTop = $('#header').height() * 1.5;
        $('#scheduleContent-main').animate({left: offscreenLeft}, function() {
            $(this).hide();
            if($(document).scrollTop() > offscreenTop) $(document).scrollTop(offscreenTop);
            scheduleInfo(row);
        });
    });
    
    // Back to Schedule clicked
    $('body').on('click', '.scheduleBack', function() {
        $('#scheduleContent-info').fadeOut(function() {
            $('#scheduleContent-main').show().animate({left:0});
        });
        
    });
    
    // Standings listing clicked
    $('body').on('click', '.standingsTeamList li', function() {
        var teamId = parseInt($(this).prop('id').split('-')[1]);
        var teamObj = standingsData[teamId];
        var offscreenLeft = $(document).width() * -1 + 'px';
        var offscreenTop = $('#header').height() * 1.5;
        $('#standingsRow').animate({left: offscreenLeft}, function() {
            $(this).hide();
            if($(document).scrollTop() > offscreenTop) $(document).scrollTop(offscreenTop);
            initTeamPage(teamObj);
        });      
    });
    
    // Back to Standings clicked
    $('body').on('click', '.standingsBack', function() {
        $('#teamPageWrapper').fadeOut(function() {
            $('.standingsBack').hide();
            $('#standingsByline').html('');
            $('header h2').removeAttr('style').html('Standings');
            // teamPageReset();
            $('#standingsRow').show().animate({left: 0});
        });
    });
    
    // Info page filter option clicked
    $('body').on('click', '#infoFilterGuide li', function() {
        if($(this).hasClass('selected')) return;
        var text = $(this).html();
        var content = '#infoContent-'+text.toLowerCase().replace("'", '').replace(' ', '');
        $('#infoFilterGuide').children('li.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.byline').html(text);
        
        $('.infoContent:visible').fadeOut(function() {
            // load the corresponding content
            $(content).fadeIn();
        });
    });
    
    // Update Account button clicked
    $('body').on('click', '#btnUpdateAccount', function() {
        var accountInfo = {};
        // Validate fields
        var ok = true;
        $('input.myAccInfo:text').each(function() {
            var key = $(this).prop('id').substr(9);
            if(key !== 'password' && key !== 'Nickname') {
                if($(this).val()==='') {
                    $(this).addClass('hasError');
                    ok = false;
                }
            }
            accountInfo[key] = $(this).val();
        });
        if(!ok) {
            $('#updateAccountStatus').css('color','red').html('You must specify a value for the highlighted fields!');
        } else {
            accountInfo['PreferNick'] = ($('#myAccountPreferNick').prop('checked') ? 1 : 0);
            if($('#myAccountPassword').val() !== '') accountInfo['Password'] = $('#myAccountPassword').val();
            updateAccountInfo(accountInfo);
        }
    });
    
    
    
    // Clear error state
    $('body').on('focus', '.hasError', function() {
        $(this).removeClass('hasError');
        if(!$('.myAccInfo.hasError').length) {
            $('#updateAccountStatus').fadeOut(function() {
                $(this).empty().removeAttr('style');
            });
        }    
    });
});
