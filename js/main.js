// Number of posible combinations: 2.1748813130029267e+123

/*var mul = 1
for( var m=0; m<foodNum; ++m )
	if( maxFood[m]!=0 ) mul *= maxFood[m]

alert(mul)*/


// Quickly, theorycally
var abs = Math.abs
var floor = Math.floor
var random = Math.random // Random method explanation: floor(random() * (max - min + 1)) + min


// Auxiliar functions

function getFoodNum(){
	return document.getElementById('foods').getElementsByTagName('tr').length - 1 }

function getPropertiesNum(){
	return document.getElementById('optimalP').getElementsByTagName('tr').length }

function getFoodMatrix()
{
	var foodNum = getFoodNum()
	var propertiesNum = getPropertiesNum()

	var foodMatrix = new Array(foodNum)
	for( i=0; i<foodNum; ++i ) foodMatrix[i] = new Array(propertiesNum)

	var foodTable = document.getElementById('foods')

	for( i=0; i<foodNum; ++i ){
		for( j=0; j<propertiesNum; ++j )
			foodMatrix[i][j] = parseFloat( foodTable.getElementsByTagName('td')[propertiesNum*i + j].innerHTML )/100*1 // 1 gram (take the user value)
	}

	return foodMatrix
}

// Probability - Return true the p% of the cases
// p have to be >0, and if it's >=100, always return true (validation on form !)
function truth( p ){
	return (( (random()*(100/p))|0 )==0)? true: false }



function main()
{
	/*********************
	***   Inicialize   ***
	*********************/

	var i, j, k

	foodNum = getFoodNum()
	propertiesNum = getPropertiesNum()
	foodMatrix = getFoodMatrix()

	nut = calculate() // Collecting nutrients

	optimalProperties = new Array(propertiesNum)

	i = 0
	for( propertie in nut ) // Recorrer las propiedades sugeridas al usuario
	{
		optimalProperties[i] = nut[propertie]
		++i
	}

	// Temporary global variables (from validate.js)
	/*var population = parseInt( document.parameters.population.value )
	var mutationProb = parseInt( document.parameters.mutationProbability.value )
	var mutationMult = parseInt( document.parameters.mutationMultiplier.value )
	var deathRate = parseInt( document.parameters.deathRate.value )*/

	foodPopulation = new Array(foodNum)
	for( i=0; i<foodNum; ++i ) foodPopulation[i] = new Array(population)

	var maxFood = new Array(foodNum)
	for( i=0; i<foodNum; ++i ) maxFood[i] = 0

	var maxTemp=0, maxPosible=0

	for( i=0; i<foodNum; ++i )
	{
		maxTemp = 9999
		for( j=0; j<propertiesNum; ++j )
		{
			if( foodMatrix[i][j]!=0 ) maxPosible = ( optimalProperties[j]/foodMatrix[i][j] )|0

			if( maxPosible < maxTemp ) maxTemp = maxPosible
		}
		maxFood[i] = maxTemp
	}


	var individualValue = new Array(population)

	// Random quantity of food to start
	for( i=0; i<foodNum; ++i ){
		for( j=0; j<population; ++j )
			foodPopulation[i][j] = ( random() * (maxFood[i]+1) )|0 // The place to set the previous (saved) values
	}

	var foodTable = document.getElementById('foods')

	var foodNames = new Array(foodNum)
	for( i=0; i<foodNum; ++i )
		foodNames[i] = foodTable.getElementsByTagName('th')[propertiesNum+1 + i].innerHTML

	var propertieNames = new Array(propertiesNum)
	for( i=0; i<propertiesNum; ++i )
		propertieNames[i] = foodTable.getElementsByTagName('th')[i+1].innerHTML

	var previousBetter = 99999
	var propDif=0, propSum=0, propPercent=0

	interval = setInterval(function () {

		/*******************************
		***   Valorate Individuals   ***
		*******************************/

		for( i=0; i<population; ++i ){ // Considerer min. and max. of every nutrient (!)

			propDif=0, propSum=0, propPercent=0
			for( j=0; j<propertiesNum; ++j ){
				propSum=0; propPercent=0
				for( k=0; k<foodNum; ++k )
					propSum += foodMatrix[k][j] * foodPopulation[k][i]

				propPercent = (propSum*100)/optimalProperties[j]
				propDif += abs( 100-propPercent )
			}

			individualValue[i] = propDif
		}

		/*****************************
		***   Order Combinations   ***
		*****************************/

		quick_sort( individualValue )

		/************************
		***   Show the Best   ***
		************************/

		var finalError = ((previousBetter*100)/(foodNum*100)).toFixed(2)

		if( individualValue[0]<previousBetter ){
			previousBetter = individualValue[0]

			var bestGuy = '<tbody>'
			for( i=0; i<foodNum; ++i ){
				bestGuy += '<tr><td>'+ foodNames[i] +'</td><td contenteditable onkeyup="setNutrients()">'+ foodPopulation[i][0].toFixed(2) +'</td></tr>'
				if( (i+1)%36==0 ) bestGuy+='</tbody><tbody>'
			}
			bestGuy += '</tbody>'
			document.getElementById('foodQ').innerHTML = bestGuy

			var bestNutrients = ''
			var sumNutTemp = 0
			for( i=0; i<propertiesNum; ++i ){
				sumNutTemp = 0
				for( j=0; j<foodNum; ++j )
					sumNutTemp += (foodPopulation[j][0]*foodMatrix[j][i]) // Append the values of first/the best combination ([0])

				var perc = (sumNutTemp*100)/optimalProperties[i]
				if( perc>60 && perc<300 )
					bestNutrients += '<tr><td>'+ perc.toFixed(2) +' %</td></tr>'
				else
					bestNutrients += '<tr><td style="color:#f88">'+ perc.toFixed(2) +' %</td></tr>'
			}
			document.getElementById('resultsQ').innerHTML = bestNutrients
		}

		if( finalError>100 ) finalError = '>100'
		else finalError = '~' + finalError
		document.getElementById('finalError').innerHTML = finalError + ' %'

		// Stop condition
		var error = parseFloat( document.parameters.error.value )
		if( isNaN(error) ) error = 80

		if( finalError<=error ) stopImprovement()

		/*************************
		***   New Individual   ***
		*************************/

		var r1=0, r2=0 // Declare all variables outside the loop (and inside just assignments)
		var l = (population-deathRate) // Living Individuals

		for( i=0; i<deathRate; ++i )
		{
			// Diferent numbers from 0 to l-1
			r1 = ( random()*l )|0
			do {
				r2 = ( random()*l )|0
			} while( r1==r2 )

			for( j=0; j<foodNum; ++j ){

				// To each bad combination, we get each food from two good combinations randomly
				foodPopulation[j][l] = ( truth(50) ) ? foodPopulation[j][r1] : foodPopulation[j][r2]
	 			
	 			// Controlar que no decremente a menos de 0 (!)
				// Idea: if(foodPopulation[j][l]==0) foodPopulation[j][l]=X // X>0

				if( truth(mutationProb) ){ // mutationProb% of times the values change
					if( truth(50) ) // 50% of times the values get increased
						foodPopulation[j][l] *= ( 1+(mutationMult/100) )
					else
						foodPopulation[j][l] *= ( 1-(mutationMult/100) )
				}

				l++
			}
		}

	}, 1) // Each milisecond
}