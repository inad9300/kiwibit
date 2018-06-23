
function calculate(){ data = validate(); if( data!=false ){

	var nut = new Object() // To return

	// Body Mass Index (BMI)
	var height_m = data['height']/100
	var bmi = data['weight']/(height_m*height_m)
	var bmi_txt = ''

	if( bmi>40 )
		bmi_txt = 'Very severely obese'
	else if( bmi>35 )
		bmi_txt = 'Severely obese'
	else if( bmi>30 )
		bmi_txt = 'Moderately obese'
	else if( bmi>25 )
		bmi_txt = 'Overweight'
	else if( bmi>18.5 )
		bmi_txt = 'Healthy weight'
	else if( bmi>17 )
		bmi_txt = 'Underweight'
	else if( bmi>16 )
		bmi_txt = 'Severely underweight'
	else 
		bmi_txt = 'Very severely underweight'


	document.getElementById('bmi').getElementsByTagName('span')[0].innerHTML = bmi.toFixed(2)
	document.getElementById('bmi').getElementsByTagName('p')[0].innerHTML = bmi_txt

	// Waist-hip ratio (WHR)
	var whr = data['waist']/data['hip']
	var whr_txt = ''

	if( data['sex']=='male' ){
		if( whr>0.94 )
			whr_txt = 'Android syndrome'
		else if( whr<0.78 )
			whr_txt = 'Gynoid syndrome'
		else
			whr_txt = 'Normal value'

	} else { // data['sex']==female||infant||pregnant
		if( whr>0.84 )
			whr_txt = 'Android syndrome'
		else if( whr<0.71 )
			whr_txt = 'Gynoid syndrome'
		else
			whr_txt = 'Normal value'
	}

	document.getElementById('whr').getElementsByTagName('span')[0].innerHTML = whr.toFixed(2)
	document.getElementById('whr').getElementsByTagName('p')[0].innerHTML = whr_txt

	// Basal metabolic rate (BMR)
	if( data['sex']=='male' )
		var bmr = (10*data['weight']) + (6.25*data['height']) - (5*data['age']) + 5
	else // data['sex']==female||infant||pregnant
		var bmr = (10*data['weight']) + (6.25*data['height']) - (5*data['age']) - 161

	document.getElementById('bmr').getElementsByTagName('span')[0].innerHTML = bmr.toFixed(2)

	// Maximal Heart rate (Max. HR)
	var mhr = (210-0.5*data['age'])-(0.01*data['weight'])
	if( data['sex']=='male' )
		mhr += 4

	document.getElementById('mhr').getElementsByTagName('span')[0].innerHTML = mhr.toFixed(2)

	// Submaximal Heart rate (Submax. HR)
	var smhr = 0
	if( data['sex']=='male' )
		smhr = mhr*0.6
	else // data['sex']==female||infant||pregnant
		smhr = mhr*0.85

	document.getElementById('smhr').getElementsByTagName('span')[0].innerHTML = smhr.toFixed(2)

	// Recommended calories
	var kcal = 0
	if( data['activity']==1 )
		kcal = bmr*1.2
	else if( data['activity']==2 )
		kcal = bmr*1.375
	else if( data['activity']==3 )
		kcal = bmr*1.55
	else if( data['activity']==4 )
		kcal = bmr*1.725
	else if( data['activity']==5 )
		kcal = bmr*1.9


	// Necessary proteins
	var prot = 0
	if( data['age']<1 ){
		prot = 14
	} else if( data['age']<3 ){
		prot = 22
	} else if( data['age']<5 ){
		prot = 26
	} else if( data['age']<7 ){
		prot = 30
	} else if( data['age']<10 ){
		prot = 34
	} else if( data['sex']=='male' ){
		if( data['age']<12 )
			prot = 48
		else if( data['age']<14 )
			prot = 59
		else if( data['age']<16 )
			prot = 70
		else if( data['age']<18 )
			prot = 81
		else if( data['age']<60 )
			prot = 55
		else 
			prot = 55
	} else if( data['sex']=='female' ){
		if( data['age']<12 )
			prot = 49
		else if( data['age']<14 )
			prot = 59
		else if( data['age']<16 )
			prot = 64
		else if( data['age']<18 )
			prot = 63
		else if( data['age']<60 )
			prot = 49
		else
			prot = 49
	}

	if( data['sex']=='infant' )
		prot = 69
	else if( data['sex']=='pregnant' )
		prot = 56
	
	// Minerals and vitamins - Initialization by Widipedia
	nut['energy'] = kcal
	nut['proteins'] = prot
	nut['carbohydrates'] = 6*data['weight']
	nut['fiber'] = 30

	nut['calcium'] = 800
	nut['iron'] = 14
	nut['iodine'] = 150
	nut['magnesium'] = 375
	nut['zinc'] = 10
	nut['selenium'] = 55
	nut['sodium'] = 500
	nut['potassium'] = 2000
	nut['phosphorus'] = 700
	nut['chloride'] = 800
	nut['copper'] = 1
	nut['manganese'] = 2
	nut['fluoride'] = 3.5 * 1000 // From mg to ug
	nut['chromium'] = 40
	nut['molybdenum'] = 50
	
	nut['vit_a'] = 800
	nut['vit_b1'] = 1.1
	nut['vit_b2'] = 1.4
	nut['vit_b3'] = 16
	nut['vit_b5'] = 6
	nut['vit_b6'] = 1.4
	nut['vit_b8'] = 50
	nut['vit_b9'] = 400
	nut['vit_b12'] = 2.5
	nut['vit_c'] = 80
	nut['vit_d'] = 5
	nut['vit_e'] = 12
	nut['vit_k'] = 75

	nut['omega_3'] = 2
	nut['omega_6'] = 2


	// Other nutrients depending on some conditions
	// (...)

	// Printing nutrients values
	var oP = document.getElementById('optimalP')
	oP.getElementsByTagName('tr')[0].getElementsByTagName('td')[1].innerHTML = nut['energy'].toFixed(2) + ' kcal'
	oP.getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerHTML = nut['proteins'] 		+ ' g'
	oP.getElementsByTagName('tr')[2].getElementsByTagName('td')[1].innerHTML = nut['carbohydrates'] + ' g'
	oP.getElementsByTagName('tr')[3].getElementsByTagName('td')[1].innerHTML = nut['fiber'] 		+ ' g'

	oP.getElementsByTagName('tr')[4].getElementsByTagName('td')[1].innerHTML = nut['calcium'] 		+ ' mg'
	oP.getElementsByTagName('tr')[5].getElementsByTagName('td')[1].innerHTML = nut['iron'] 			+ ' mg'
	oP.getElementsByTagName('tr')[6].getElementsByTagName('td')[1].innerHTML = nut['iodine'] 		+ ' µg'
	oP.getElementsByTagName('tr')[7].getElementsByTagName('td')[1].innerHTML = nut['magnesium'] 	+ ' mg'
	oP.getElementsByTagName('tr')[8].getElementsByTagName('td')[1].innerHTML = nut['zinc'] 			+ ' mg'
	oP.getElementsByTagName('tr')[9].getElementsByTagName('td')[1].innerHTML = nut['selenium'] 		+ ' µg'
	oP.getElementsByTagName('tr')[10].getElementsByTagName('td')[1].innerHTML = nut['sodium'] 		+ ' mg'
	oP.getElementsByTagName('tr')[11].getElementsByTagName('td')[1].innerHTML = nut['potassium'] 	+ ' mg'
	oP.getElementsByTagName('tr')[12].getElementsByTagName('td')[1].innerHTML = nut['phosphorus'] 	+ ' mg'
	oP.getElementsByTagName('tr')[13].getElementsByTagName('td')[1].innerHTML = nut['chloride'] 	+ ' mg'
	oP.getElementsByTagName('tr')[14].getElementsByTagName('td')[1].innerHTML = nut['copper'] 		+ ' mg'
	oP.getElementsByTagName('tr')[15].getElementsByTagName('td')[1].innerHTML = nut['manganese'] 	+ ' mg'
	oP.getElementsByTagName('tr')[16].getElementsByTagName('td')[1].innerHTML = nut['fluoride'] 	+ ' mg'
	oP.getElementsByTagName('tr')[17].getElementsByTagName('td')[1].innerHTML = nut['chromium'] 	+ ' µg'
	oP.getElementsByTagName('tr')[18].getElementsByTagName('td')[1].innerHTML = nut['molybdenum'] 	+ ' µg'

	oP.getElementsByTagName('tr')[19].getElementsByTagName('td')[1].innerHTML = nut['vit_a'] 		+ ' µg'
	oP.getElementsByTagName('tr')[20].getElementsByTagName('td')[1].innerHTML = nut['vit_b1'] 		+ ' mg'
	oP.getElementsByTagName('tr')[21].getElementsByTagName('td')[1].innerHTML = nut['vit_b2'] 		+ ' mg'
	oP.getElementsByTagName('tr')[22].getElementsByTagName('td')[1].innerHTML = nut['vit_b3'] 		+ ' mg'
	oP.getElementsByTagName('tr')[23].getElementsByTagName('td')[1].innerHTML = nut['vit_b5'] 		+ ' mg'
	oP.getElementsByTagName('tr')[24].getElementsByTagName('td')[1].innerHTML = nut['vit_b6'] 		+ ' mg'
	oP.getElementsByTagName('tr')[25].getElementsByTagName('td')[1].innerHTML = nut['vit_b8'] 		+ ' µg'
	oP.getElementsByTagName('tr')[26].getElementsByTagName('td')[1].innerHTML = nut['vit_b9'] 		+ ' µg'
	oP.getElementsByTagName('tr')[27].getElementsByTagName('td')[1].innerHTML = nut['vit_b12'] 		+ ' µg'
	oP.getElementsByTagName('tr')[28].getElementsByTagName('td')[1].innerHTML = nut['vit_c'] 		+ ' mg'
	oP.getElementsByTagName('tr')[29].getElementsByTagName('td')[1].innerHTML = nut['vit_d'] 		+ ' µg'
	oP.getElementsByTagName('tr')[30].getElementsByTagName('td')[1].innerHTML = nut['vit_e'] 		+ ' mg'
	oP.getElementsByTagName('tr')[31].getElementsByTagName('td')[1].innerHTML = nut['vit_k'] 		+ ' µg'
	
	oP.getElementsByTagName('tr')[32].getElementsByTagName('td')[1].innerHTML = nut['omega_3'] 		+ ' g'
	oP.getElementsByTagName('tr')[33].getElementsByTagName('td')[1].innerHTML = nut['omega_6'] 		+ ' g'

	return nut
}}