﻿var MIN_ACCE = 1;
var NUM_OF_LEVELS = 12;
var NUM_OF_PLAYERS = 4;
var CALI_ROTGAMMA = 0;
var ball_throwing = false;
var rot_alpha;
var rot_beta;
var rot_gamma;
var fx0;
var fy0;
var fx1;
var fy1;
var osUse;

function showResult() {
    var localClientScore = [0,0,0,0];
    for (var i = 0; i < NUM_OF_PLAYERS; ++i)
        localClientScore[i] = clientScore[i];
    
    winner = 0;
    for (var i = 1; i <= NUM_OF_PLAYERS-1; i++)
        if (localClientScore[i] > localClientScore[winner])
            winner = i;
    setTimeout(function() {
        for (var i = 1; i <= NUM_OF_PLAYERS; i++)
            document.getElementById('GameResult' + i).setAttribute('class', 'btn btn-lg btn-remote');
        for (var i = 0; i <= NUM_OF_PLAYERS-1; i++)
            if (localClientScore[i] == localClientScore[winner]) {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-success');
                element.textContent = 'WIN';
            } else {
                var element = document.getElementById('GameResult' + (i+1));
                element.setAttribute('class', 'btn btn-lg btn-remote btn-danger');
                element.textContent = 'LOSE';
            }
        document.getElementById('StartGroup').setAttribute('class', 'form-group');
    }, 500 * (localClientScore[winner] / 6 + 1));
    console.log('Set result timeout functions');
}

function holdBall(){
	ball_throwing = true;
	fy0 = rot_alpha;
	fx0 = rot_beta;		
}

function releaseBall(){
	fy1 = rot_alpha;
	fx1 = rot_beta;

	var fx = (fx1-fx0)*-4000;
	var fy = (fy1-fy0)*-18000;
	sendThrowMotion(fx,fy);
	//alert('fx:'+fx+' fy:'+fy);
	ball_throwing = false;
}





function deviceMotionHandler(eventData) {
	rot_alpha = eventData.rotationRate.alpha;
	rot_beta = eventData.rotationRate.beta;
	rot_gamma = eventData.rotationRate.gamma;
	if (osUse == 1){
		rot_alpha *= 0.0174532925*1.2;
		rot_beta *= 0.0174532925*1.2 ;		
		rot_gamma *= 0.0174532925 ;
	}
	if ( ball_throwing == false){
		if(Math.abs(rot_gamma) > 0.2){
			console.log(rot_gamma);
			sendRotGamma(rot_gamma);
		}
	}
    var acceZ = eventData.acceleration.z;
    if (acceZ > MIN_ACCE) {
        sendSwing(acceZ);
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    osUse = 1;

  }
  else if( userAgent.match( /Android/i ) )
  {

    osUse = 2;
  }
  else
  {
    osUse = 3;
  }
}

getMobileOperatingSystem();
