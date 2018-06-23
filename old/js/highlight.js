
function highligthP( n )
{
	var t = document.getElementById('ftable');
	var max = 0;
	var maxi = 0;
	var foodNumL = t.getElementsByTagName('tr').length-1;
	for( var i=1; i<=foodNumL; ++i ){
		var v = parseInt(t.getElementsByTagName('tr')[i].getElementsByTagName('td')[n].innerHTML);
		if( v>max ){
			max = v;
			maxi = i;
		}
	}
	t.getElementsByTagName('tr')[maxi].getElementsByTagName('td')[n].style.backgroundColor = 'rgba(255,155,0,.4)';
}

function highligthPOut( n )
{
	if(typeof clickHighligth=='undefined'){ clickHighligth = []; }

	if( (typeof clickHighligth[n])=='undefined' || clickHighligth[n]==false ){
		var t = document.getElementById('ftable');
		var foodNumL = t.getElementsByTagName('tr').length-1;
		for( var i=1; i<=foodNumL; ++i ){
			if( n%2==0 ){
				t.getElementsByTagName('tr')[i].getElementsByTagName('td')[n].style.backgroundColor = 'transparent';
			} else {
				t.getElementsByTagName('tr')[i].getElementsByTagName('td')[n].style.backgroundColor = 'rgba(0,0,0,.05)';
			}
		}
	}
}

function highlightFixed( n )
{
	var t = document.getElementById('ftable');
	var foodNumL = t.getElementsByTagName('tr').length-1;

	if(typeof clickHighligth=='undefined'){ clickHighligth = []; }

	if( (typeof clickHighligth[n])=='undefined' || clickHighligth[n]==false ){
		highligthP( n );
		clickHighligth[n] = true; // Global variable
	} else {
		highligthPOut( n );
		clickHighligth[n] = false;
	}
}