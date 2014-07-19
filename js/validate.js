
function validate()
{
	var data = new Object(); // To return

	// Collecting data
	var age 	= parseFloat( document.parameters.age.value )
	var weight 	= parseFloat( document.parameters.weight.value )
	var height 	= parseFloat( document.parameters.height.value )
	var waist 	= parseFloat( document.parameters.waist.value )
	var hip 	= parseFloat( document.parameters.hip.value )

	var sex
	var sexSel = document.getElementById('sexSel')
	if( sexSel.style.top=='48px' )
		sex = ( sexSel.style.left=='48px' )? 'pregnant': 'infant'
	else
		sex = ( sexSel.style.left=='48px' )? 'female': 'male'
	

	var activity
	var actSel = document.getElementById('actSel')
	if( actSel.style.left=='100px' )
		activity = 5
	else if( actSel.style.left=='76px' )
		activity = 4
	else if( actSel.style.left=='52px' )
		activity = 3
	else if( actSel.style.left=='28px' )
		activity = 2
	else
		activity = 1
	

	var grams = parseFloat( document.parameters.grams.value )
	var error = parseFloat( document.parameters.error.value )

	// Validating data
	if( isNaN(age) || age<0 || age>150 ){
		alert('Check the age field.')
		return false }

	if( isNaN(weight) || weight<0 || weight>650 ){
		alert('Check the weight field.')
		return false }

	if( isNaN(height) || height<0 || height>300 ){
		alert('Check the height field.')
		return false }

	if( waist<0 || waist>400 ){
		alert('Check the waist field.')
		return false
	} else if( isNaN(waist) ){ waist = 0 }

	if( hip<0 || hip>400 ){
		alert('Check the hip field.')
		return false
	} else if( isNaN(hip) ){ hip = 0 }

	if( grams<0 || grams>2500 ){
		alert('Check the portion field.')
		return false
	} else if( isNaN(grams) ){ grams = 1 }

	if( error<0 || error>10000 ){ // It should be able to be more than 10.000 (even "infinitum")
		alert('Check the error field.')
		return false
	} else if( error<50 && document.getElementById('pPspan').innerHTML=='Play' ){
		var r = confirm('Values under 50% could cause large time delays. Are you sure?')
		if( r==false ) return false
	} else if( isNaN(error) ){
		error = 80
	}

	// Genetic parameters - Temporary global variables
	population 		= parseInt( document.parameters.population.value )
	mutationProb 	= parseInt( document.parameters.mutationProbability.value )
	mutationMult 	= parseInt( document.parameters.mutationMultiplier.value )
	deathRate 		= parseInt( document.parameters.deathRate.value )

	if( population<0 ){
		alert('Check the population field.')
		return false
	} else if( isNaN(population) ){ population = 100 }

	if( mutationProb<0 || mutationProb>100 ){
		alert('Check the mutation probability field.')
		return false
	} else if( isNaN(mutationProb) ){ mutationProb = 50 }

	if( mutationMult<0 || mutationMult>100 ){
		alert('Check the mutation multiplier field.')
		return false
	} else if( isNaN(mutationMult) ){ mutationMult = 50 }

	if( deathRate<0 || deathRate>population ){
		alert('Check the death rate field.')
		return false
	} else if( isNaN(deathRate) ){ deathRate = (population/2)|0 }


	data['age'] = age
	data['weight'] = weight
	data['height'] = height
	data['waist'] = waist
	data['hip'] = hip
	data['sex'] = sex
	data['activity'] = activity
	data['grams'] = grams
	data['error'] = error

	return data
}
