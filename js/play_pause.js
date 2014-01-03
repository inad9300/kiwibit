
function stopImprovement()
{
	clearInterval(interval)
	interval = undefined
	document.getElementById('pPspan').innerHTML = 'Play'
	document.getElementById('pP').style.backgroundImage = 'url(img/play.png)'
}

// function saveIndividuals(){}

// function continueImprovement(){}

function playPause()
{
	if( typeof interval=='undefined' ){
		if( validate()!=false ){
			document.getElementById('pPspan').innerHTML = 'Stop'
			document.getElementById('pP').style.backgroundImage = 'url(img/pause.png)'
			main()
		}
	} else { stopImprovement() }
}