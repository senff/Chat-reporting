// ==UserScript==
// @name         Happychat Coverage & Reports
// @namespace    http://tampermonkey.net/
// @version      0.95
// @description  Coverage logger for Happychat
// @author       Senff
// @require      https://code.jquery.com/jquery-1.12.4.js
// @match        https://hud.happychat.io/*
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

function getCoverage() {
    // Logging the coverage at certain points
    var aSr = 0;
    var cSr = 0;
    var oSr = 0;
    var aSrb = 0;
    var cSrb = 0;
    var oSrb = 0;
    var greenOps = 0;
    var blueOps = 0;
    var UTCdiff = 5; // CHANGE THIS TO THE TIME DIFFERENCE BETWEEN YOU AND UTC
    var todaysDate = new Date();
    var curDay = todaysDate.getUTCDate();
    var curHour = todaysDate.getUTCHours();
    var curMin = todaysDate.getMinutes();
    var curMonth = todaysDate.getUTCMonth()+1;
    var nextHour = parseInt(curHour) + 1;
    if (nextHour > 23) {
        nextHour = parseInt(nextHour) - 24;
    }
    if (curHour < 10) {
        curHour = "0"+curHour;
    }
    if (nextHour < 10) {
        nextHour = "0"+nextHour;
    }
    if (curMin < 10) {
        curMin = "0"+curMin;
    }
    var thisHour = "hour-" + curHour + "-" + nextHour;

    // Let's loop through all HEs and find load and throttle for each, and add that to the totals

    $('.chat__chat-queue .operators').each(function( index ) {

        var opInfo = $(this).find('img').attr('title');

        // Find number of chats an HE has
            var opLoadPos = opInfo.indexOf('Load: ');
            var opLoad = opInfo.substr(opLoadPos+6, 1);

        // Find number of slots an HE has
            var opThrottlePos = opInfo.indexOf('Throttle: ');
            var opThrottle = opInfo.substr(opThrottlePos+10, 1);

        if ($(this).hasClass('operators__available')) {
            // Only GREEN ops!
            greenOps++;

            // Add to the total amount of CHATS that are going on for green HEs
                cSr = parseInt(cSr) + parseInt(opLoad);

            // Add to the total amount of AVAILABLE slots of all green HEs
                aSr = parseInt(aSr) + parseInt(opThrottle);

        }

        if ($(this).hasClass('operators__reserve')) {
            blueOps++;
            // Add to the total amount of CHATS that are going on for blue HEs
                cSrb = parseInt(cSrb) + parseInt(opLoad);

            // Add to the total amount of AVAILABLE slots of all blue HEs
                aSrb = parseInt(aSrb) + parseInt(opThrottle);

        }

    });

    var aS = parseInt(aSr) * 5; // Available slots (green)
    var cS = parseInt(cSr) * 5; // Current chats (green)
    var oS = parseInt(oSr)* 5;
    var aSb = parseInt(aSrb) * 5; // Available slots (blue)
    var cSb = parseInt(cSrb) * 5; // Current chats (blue)
    var oSb = parseInt(oSrb)* 5;
    if ((aS) && (cS)) {
        var morechat = "";
        if ((cS + cSb) >= (aS + aSb)) {
            morechat = "morechat";
        }
        var thisTime = "   <td class='hour-"+curHour+" min-"+curMin+"'><div class='av'><img class='a' style='height:"+aSb+"px;' src='http://senff.com/x.png' title='"+curHour+":"+curMin+" - "+cSr+"/"+aSr+" ("+cSrb+"/"+aSrb+")'><img class='a' style='height:"+aS+"px;' src='http://senff.com/x.png' title='"+curHour+":"+curMin+" - "+cSr+"/"+aSr+" ("+cSrb+"/"+aSrb+")'></div><div class='cc "+morechat+"'><img class='c "+morechat+"' style='height:"+cSb+"px;' src='http://senff.com/x.png' title='"+curHour+":"+curMin+" - "+cSr+"/"+aSr+" ("+cSrb+"/"+aSrb+")'><img class='c "+morechat+"' style='height:"+cS+"px;' src='http://senff.com/x.png' title='"+curHour+":"+curMin+" - "+cSr+"/"+aSr+" ("+cSrb+"/"+aSrb+")'></td>\n";
        appendToStorage("report-"+curMonth+"-"+curDay, thisTime);
    }
    addToDateList(curMonth+"-"+curDay);
}

function addToDateList(theDay) {
    var dateOptions = '<option value="date">SELECT DATE</option>';
    var availableDates = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var isReport = key.startsWith('report-');
        if (isReport) {
            var thisDate = key.substring(7);
            availableDates.push(thisDate);
        }
    }
    availableDates.sort();
    var howManyDates = availableDates.length;
    for (var d = 0; d < howManyDates; d++) {
        dateOptions = dateOptions + '<option value="' + availableDates[d] + '">Report date: '+availableDates[d]+'</option>';
    }
    $('#hc-reports #selReports').html(dateOptions);
    $('#hc-reports .input-report').remove();
}

function appendToStorage(name, data){
    var old = localStorage.getItem(name);
    if(old === null) old = "<tr>\n";
    localStorage.setItem(name, old + data);
}

function fillInTheBlanks() {

	var prevHour = 0;

	for (var hh = 0; hh < 24; hh++) {

		if(hh<10) {
			hh='0'+hh;
		}

		var prevMin = 0;

		for (var mm = 0; mm < 60; mm++) {

			prevMin = mm-1;
			prevHour = hh;

			if(mm==0) {
				prevMin = 59;
				prevHour = hh-1;
				if(prevHour<10) {
					prevHour='0'+prevHour;
				}
			}

			if(prevMin<10) {
				prevMin='0'+prevMin;
			}

			if(mm<10) {
				mm='0'+mm;
			}

			if($('.hour-'+hh+'.min-'+mm).length < 1) {
				if((mm=='00')&&(hh=='00')) {
					$('#hc-reports .data table.reporting tr').prepend('<td class="hour-00 min-00 no-data"><div class="av" style="width: 1px;"><img class="a" style="background: #ffffff; height: 500px; width: 1px;" src="http://senff.com/x.png" title="00:00 - no data available"></div></td>');
				} else {
					$('#hc-reports .data table.reporting td.hour-'+prevHour+'.min-'+prevMin).after('<td class="hour-'+hh+' min-'+mm+' no-data"><div class="av" style="width: 1px;"><img class="a" style="background: #ffffff; height: 500px; width: 1px;" src="http://senff.com/x.png" title="'+hh+':'+mm+' - no data available"></div></td>');
				}
			}
		}
    }

    $('#hc-reports .data table.reporting').addClass('filled');
    $('#hc-reports .data table.reporting').after('<div class="timeline"></div>');
    $('#hc-reports .data table.reporting').css('width','1440px');
    $('#hc-reports .data .timeline').css('width','1440px');
}

window.setInterval(function(){
    getCoverage();
}, 60000);


$(document).ready(function() {
    $('body').append('<div id="hc-reports"><select id="selReports"></select><input type="text" class="input-report" placeholder="11-23"><input type="button" class="button-get" value="Show report data"><input type="button" class="button-delete" value="Delete report data"><div class="data"></div></div><div id="close-reports">X</div><div id="open-reports"></div>');
    getCoverage();
});

$('body').on('click', '#hc-reports .button-delete', function() {
    var reportdate = $('#selReports').val();
    if(reportdate != "date") {
        var delReport = confirm("This will remove the report for "+reportdate+".");
        if (delReport == true) {
            localStorage.removeItem("report-"+reportdate);
            alert("Report for "+ reportdate +" has been deleted.");
            var elementToRemove = 'option[value='+reportdate+']';
            $(elementToRemove).remove();
            $('#hc-reports .data table.report-'+reportdate).remove();
        }
    }
});

$('body').on('click', '#hc-reports .button-get', function() {
    var reportdate = $('#selReports').val();
    if(reportdate != "date") {
        var theData = localStorage.getItem("report-"+reportdate);
        var reports = '<div class="y-axis"><div class="line-100 line-hor"></div><div class="y-100">100</div><div class="line-75 line-hor"></div><div class="y-75">75</div><div class="line-50 line-hor"></div><div class="y-50">50</div><div class="line-25 line-hor"></div><div class="y-25">25</div></div><table class="reporting report-'+reportdate+'">'+theData+'</tr></table>';
        $('.data').html(reports);
        var minutes = $('body.reports .data table td').length;
        if($('.checkboxes').length < 1) {
            $('#hc-reports').append('<div class="checkboxes"><input type="checkbox" id="avail-slots" name="avail-slots" checked><label for="avail-slots">Available slots (total throttle)</label><input type="checkbox" id="filled-slots" name="filled-slots" checked><label for="filled-slots">Current chats</label><input type="checkbox" id="sh-green" name="sh-green" checked><label for="sh-green">Chats/slots of green HEs</label><input type="checkbox" id="sh-blue" name="sh-blue" checked><label for="sh-blue">Chats/slots of blue HEs</label><input type="checkbox" id="morechats" name="morechats"><label for="morechats">Highlight morechat (all green/blue HEs are filled up)</label></div>');
            $('#hc-reports').append('<div class="zooms"><a href="#" class="zoom-in">Zoom in</a> <a href="#" class="zoom-out">Zoom out</a> <a href="#" class="zoom-reset">Reset</a></div>');
        }
        $('.morechat').addClass('morechat-hide');
        $('input[type="checkbox"]').prop('checked', true);
        $('input#morechats').prop('checked', false);
        fillInTheBlanks();
    }
});

$(document).on('change', '#avail-slots', function() {
    $('.av').toggle();
});

$(document).on('change', '#filled-slots', function() {
    $('.cc').toggle();
});

$(document).on('change', '#sh-green', function() {
    $('.av img:last-child, .cc img:last-child').toggle();
});

$(document).on('change', '#sh-blue', function() {
    $('.av img:first-child, .cc img:first-child').toggle();
});

$(document).on('change', '#morechats', function() {
    $('.morechat').toggleClass('morechat-hide');
});

$('body').on('click', '.zoom-in', function() {
    var currentSetting = $('#hc-reports .data table td:first-child img.a').width();
    console.log('Current: '+currentSetting);
    var newWidth = currentSetting+1;
    console.log('New: '+newWidth);
    var cells = $('#hc-reports table td').length;
    $('#hc-reports .data table').css('width',(cells*newWidth)+'px');
    $('#hc-reports .data table.reporting td, #hc-reports .data table.reporting td .av, #hc-reports .data table.reporting .cc, #hc-reports .data table.reporting td img').css('width',newWidth+'px');
    $('#hc-reports .data .timeline').css('width',(cells*newWidth)+'px');
});

$('body').on('click', '.zoom-out', function() {
    var currentSetting = $('#hc-reports .data table td:first-child img.a').width();
    var newWidth = parseInt(currentSetting)-1;
    if (newWidth < 1) {
        newWidth = 1;
    }
    var cells = $('#hc-reports table td').length;
    $('#hc-reports .data table').css('width',(cells*newWidth)+'px');
    $('#hc-reports .data table.reporting td, #hc-reports .data table.reporting td .av, #hc-reports .data table.reporting .cc, #hc-reports .data table.reporting td img').css('width',newWidth+'px');
    $('#hc-reports .data .timeline').css('width',(cells*newWidth)+'px');
});

$('body').on('click', '.zoom-reset', function() {
    var cells = $('#hc-reports table td').length;
    $('#hc-reports .data table').css('width',(cells)+'px');
    $('#hc-reports .data table.reporting td, #hc-reports .data table.reporting td .av, #hc-reports .data table.reporting .cc, #hc-reports .data table.reporting td img').css('width','1px');
    $('#hc-reports .data .timeline').css('width',(cells)+'px');
});

$('body').on('click', '#open-reports', function() {
    $('#hc-reports, #close-reports').fadeIn(200);
    $('#open-reports').fadeToggle(200);
});

$('body').on('click', '#close-reports', function() {
    $('#hc-reports, #close-reports').fadeOut(200);
    $('#open-reports').fadeToggle(200);
});



