<?php include 'head.php' ?>

	<!-- Controls -->
	<section id='controls'>
		<form id='parameters' name='parameters' method='' action=''>

			<input type='text' title='Age' name='age' placeholder='Age (years)'>
			<input type='text' title='Weight' name='weight' placeholder='Weight (kg)'>
			<input type='text' title='Height' name='height' placeholder='Height (cm)'>

			<input type='text' title='Waist circumference' name='waist' placeholder='Waist (cm)'>
			<input type='text' title='Hip circumference' name='hip' placeholder='Hip (cm)'>

			<!-- male | female | infant | pregnant -->
			<div id='sex' onkeyup='keyMove(e); this.select()'>
				<div id='sexSel'></div>
				<div id='male' title='Male' onclick='moveSexSel("m")'></div>
				<div id='female' title='Female' onclick='moveSexSel("f")'></div>
				<div id='infant' title='Infant' onclick='moveSexSel("i")'></div>
				<div id='pregnant' title='Pregnant' onclick='moveSexSel("p")'></div>
			</div>

			<div id='activity' title='Physical activity level'>
				<div id='actSel'></div>
				<span onclick='moveActSel(1)'>1</span>
				<span onclick='moveActSel(2)'>2</span>
				<span onclick='moveActSel(3)'>3</span>
				<span onclick='moveActSel(4)'>4</span>
				<span onclick='moveActSel(5)'>5</span>
			</div>

			<input type='text' title='Portion' name='grams' placeholder='Portion (g)'>
			<input type='text' title='Error' name='error' placeholder='Error (%)'>

			<button type='button' id='pP' onclick='playPause()'><span id='pPspan'>Play</span></button>
			<div id='genetic' onclick='displayGen()' title='Display genetic algorithm options'></div>
			<div id='indoor_gen'>
				<input type='text' title='Population' name='population' placeholder='Population'>
				<input type='text' title='Death rate' name='deathRate' placeholder='Death rate'>
				<input type='text' title='Mutation probability' name='mutationProbability' placeholder='Mut. probability'>
				<input type='text' title='Mutation multiplier' name='mutationMultiplier' placeholder='Mut. multiplier'>
			</div>
			<div style='clear:both'></div>

		</form>
	</section>


	<!-- Results (Main section) -->
	<section>

		<div id='litPanels'>
			<!-- Body Mass Index -->
			<div id='bmi'>
				<abbr title='Body Mass Index'>BMI</abbr>
				<span>0.0</span>
				<p>-</p>

				<div class='more_info' onclick='showInfo(0)' title='Some information'><p>+</p></div>
				<p class='mini_info'>The Body Mass Index (BMI) is a measure that associates the weight and height of a person, which is something to considerate about his nutritional status.</p>
			</div>
			
			<!-- Waist-hip ratio -->
			<div id='whr'>
				<abbr title='Waist-hip ratio'>WHR</abbr>
				<span>0.0</span>
				<p>-</p>

				<div class='more_info' onclick='showInfo(1)' title='Some information'><p>+</p></div>
				<p class='mini_info'>The Waist-hip ratio (WHR) is the relation between the both circumferences. If it exceeds 1 in men or 0.9 in women, it is associated to a higher probability of developing diabetes, coronary disease and blood pressure, inter alia.</p>
			</div>

			<!-- Basal metabolic rate -->
			<div id='bmr'>
				<abbr title='Basal metabolic rate'>BMR</abbr>
				<span>0.0</span>

				<div class='more_info' onclick='showInfo(2)' title='Some information'><p>+</p></div>
				<p class='mini_info'>The Basal metabolic rate (BMR) is the minimum energy that our body needs every day to work, without making any extra activity.</p>
			</div>

			<!-- Maximal Heart rate -->
			<div id='mhr'>
				<abbr title='Maximal Heart rate'>Max. HR</abbr>
				<span>0.0</span>

				<div class='more_info' onclick='showInfo(3)' title='Some information'><p>+</p></div>
				<p class='mini_info'>The maximum heart rate (HR) is the theorical limit that you can achieve in a stress test without compromising our health.</p>
			</div>

			<!-- Submaximal Heart rate -->
			<div id='smhr'>
				<abbr title='Submaximal Heart rate'>Submax. HR</abbr>
				<span>0.0</span>

				<div class='more_info' onclick='showInfo(4)' title='Some information'><p>+</p></div>
				<p class='mini_info'>If you keep the submaximal heart rate (HR) during 30 to 40 minutes of aerobic activity, your body is forced to use preferably fat as fuel.</p>
			</div>
		</div>

		<div id='bigPanels'>
			<!-- Reference Daily Intake -->
			<div id='rdi'>
				<abbr title='Reference Daily Intake'>RDI</abbr>

				<div class='more_info' onclick='showInfo(5)' title='Some information'><p>+</p></div>
				<p class='mini_info'>The Recommended or Reference Daily Intake (RDI) is the daily amount of any nutrient that we need to be healthy. Particularly, the Daily Calorie Intake is the energy we need both for our body to work (BMR) as for other activities.</p>

				<table id='optimalP'>
					<?php propertiesInitialTable(); ?>
				</table>

				<!-- Error -->
				<div id='fError'>Error: <span id='finalError'>100 %</span></div>
			</div>
			<!-- Results -->
			<div id='results'>
				<p>Results</p>
				<table id='resultsQ'>
					<?php
						$n = getNumProperties();
						for( $i=0; $i<$n; ++$i )
							echo '<tr><td>0</td></tr>';
					?>
				</table>
			</div>			

			<!-- Food -->
			<div id='food'>
				<p>Food (g)</p>
				<table id='foodQ'>
					<?php foodInitialTable(); ?>
				</table>
			</div>
		</div>

	</section>


<!-- JavaScript -->
<script>
	function moveSexSel( x ){
		if( x=='m' ){ // Male
			document.getElementById('sexSel').style.top = '4px';
			document.getElementById('sexSel').style.left = '4px';
		} else if( x=='f' ){ // Female
			document.getElementById('sexSel').style.top = '4px';
			document.getElementById('sexSel').style.left = '48px';
		} else if( x=='p' ){ // Pregnant
			document.getElementById('sexSel').style.top = '48px';
			document.getElementById('sexSel').style.left = '48px';
		} else { // Infant
			document.getElementById('sexSel').style.top = '48px';
			document.getElementById('sexSel').style.left = '4px';
		}
	}

	function moveActSel( x ){
		if( x==1 ){
			document.getElementById('actSel').style.left = '4px';
		} else if( x==2 ){
			document.getElementById('actSel').style.left = '28px';
		} else if( x==3 ){
			document.getElementById('actSel').style.left = '52px';
		} else if( x==4 ){
			document.getElementById('actSel').style.left = '76px';
		} else {
			document.getElementById('actSel').style.left = '100px';
		}
	}

	function displayGen(){
		var g = document.getElementById('genetic');
		var ig = document.getElementById('indoor_gen');

		if( ig.style.width=='108px' ){
			g.style.borderRadius = '2px';
			ig.style.left = '-32px';
			ig.style.width = '8px';
		} else {
			g.style.borderRadius = '2px 0 0 2px';
			ig.style.left = '0';
			ig.style.width = '108px';
		}
	}

	function showInfo( n ){
		var p = document.getElementsByClassName('more_info')[n].getElementsByTagName('p')[0];
		if( p.style.transform != 'rotate(45deg)' ){
			p.style.webkitTransform = 'rotate(45deg)';
			p.style.mozTransform = 'rotate(45deg)';
			p.style.msTransform = 'rotate(45deg)';
			p.style.oTransform = 'rotate(45deg)';
			p.style.transform = 'rotate(45deg)';

			document.getElementsByClassName('mini_info')[n].style.visibility = 'visible';
			document.getElementsByClassName('mini_info')[n].style.filter = 'alpha(opacity=100)';
			document.getElementsByClassName('mini_info')[n].style.MozOpacity = '1';
			document.getElementsByClassName('mini_info')[n].style.opacity = '1';
		} else {			
			p.style.webkitTransform = 'rotate(0deg)';
			p.style.mozTransform = 'rotate(0deg)';
			p.style.msTransform = 'rotate(0deg)';
			p.style.oTransform = 'rotate(0deg)';
			p.style.transform = 'rotate(0deg)';

			document.getElementsByClassName('mini_info')[n].style.visibility = 'hidden';
			document.getElementsByClassName('mini_info')[n].style.filter = 'alpha(opacity=0)';
			document.getElementsByClassName('mini_info')[n].style.MozOpacity = '0';
			document.getElementsByClassName('mini_info')[n].style.opacity = '0';
		}
	}
</script>

<!-- Hidden nutrient tables (DB) -->
<table id='foods' style='display:none'>
<?php
	foodFullTableSimpleHeaders();
	foodFullTable();
?>
</table>

<!-- Google Analytics -->
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-37227227-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>

</body>
</html>