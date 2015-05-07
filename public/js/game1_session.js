var socket = io('ws://' + window.location.hostname + ':8000/');
var sessionId = null;
var clientId = null;
var startTime = [0, 0, 0, 0];
var clientScore = [0, 0, 0, 0];
var clientReadyEnd = [false, false, false, false];
var winner = 0;
var rotGamma = 0;
var joinedPlayers = [];
var currentPlayer = 1;

socket.on('register', function(sId, cId) {
    console.log('Received register: ' + sId + ' ' + cId);
	
    sessionId = sId;
    clientId = getClientId();
    if (clientId == 0) { // If at main screen, do work
        var element = document.getElementById('QRButton' + cId);
        if (element !== null)
            element.parentNode.removeChild(element);
    }
});


socket.on('rotGamma', function(recvClientId, data) {
    if (clientId == 0) { // If at main screen, do work
		var found = false;
		for(i=0; i<joinedPlayers.length; i++) if (joinedPlayers[i] == recvClientId) found = true;
		if (found == false) joinedPlayers.push(recvClientId);
		if (recvClientId = currentPlayer){
		   console.log('Receive id '+recvClientId+' rotGamma:' + data);
		   
		   rotGamma = data;
		   
		   if((play == true)&&(bowling_ball_thrown == false)){
			   bowling_ball[ 0 ].velocity.set( rotGamma*100, 0, 0 );
		   }
		}
    }
});

socket.on('throwMotion', function(recvClientId, fx,fy) {
    if (clientId == 0) { // If at main screen, do work
		if (recvClientId = currentPlayer){
		   console.log('Receive throwMotion: ' + 'fx:'+fx+' fy:'+fy);
		   throwBall(fx,fy);
		}
    }
});

function sendRotGamma(rotGamma) {
    console.log('Send rotGamma: ' + rotGamma);
    socket.emit('rotGamma', clientId, rotGamma);
}

function sendThrowMotion(fx,fy){

	//var fx = -4347.106480634161;
	//var fy = -169144.13881713708;
	console.log('Send throwMotion: ' + 'fx:' + fx + ' fy:'+fy);
    socket.emit('throwMotion', clientId, fx,fy);

}

function getSessionId() {
    var pageURL = document.URL;
    var n = pageURL.search(/\/session\/.*\//);
    if (n != -1) {
        return parseInt(pageURL.substring(n + 9, pageURL.length - 2));
    } else {
        return null;
    }
}

function getClientId() {
    var pageURL = document.URL;
    var clientId = parseInt(pageURL.substr(pageURL.length - 1));
	alert(clientId);
    if (isNaN(clientId))
        return null;
    else
        return clientId;
}

function registerSession() {
    var sId = getSessionId();
    var cId = getClientId();
    if (sId !== null && cId !== null) {
        socket.emit('register', sId, cId);
        console.log('Sent register message');
    } else {
        console.log('Session ID and/or client ID is null!');
    }
}

function startGame_ScreenSide() {
    clientScore = [0, 0, 0, 0];
    document.getElementById('GameButtons').setAttribute('class', 'panel-body');
    for (var i = 1; i <= NUM_OF_PLAYERS; ++i)
        for (var j = 0; j <= NUM_OF_LEVELS; ++j)
            document.getElementById('GameButton' + i + '_' + j).setAttribute('class', 'btn btn-lg btn-remote');
    for (var i = 1; i <= 4; i++) {
        var element = document.getElementById('GameResult' + i);
        element.setAttribute('class', 'btn btn-lg btn-remote hidden');
        element.textContent = ' ';
    }
    document.getElementById('QRGroup').setAttribute('class', 'hidden');
    document.getElementById('StartGroup').setAttribute('class', 'form-group hidden');
    for (var i = 0; i < NUM_OF_PLAYERS; ++i) {
        startTime[i] = Date.now();
        clientReadyEnd[i] = false;
    }
    setTimeout(showResult, 6000);
    console.log("Start game");
	var aNewBodyElement = document.createElement("body");

aNewBodyElement.id = "newBodyElement";
document.body = aNewBodyElement;
	set_system_settings_level();
}

function init() {
    sessionId = getSessionId();
    clientId = getClientId();
    registerSession();
    if (clientId != 0) {
        if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            console.log('Not supported on your device or browser.  Sorry.');
        }
    }
}

window.addEventListener('load', init);
