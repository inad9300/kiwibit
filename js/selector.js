
// Display the percent of each nutrient when a user modify (onkeyup) the quantity of any food

function setNutrients()
{
	var l = 0
	var perc = 0
	var quantity = 0
	var sumNutTemp = 0
	var bestNutrients = ''
	var table = document.getElementById('foodQ')

	for( i=0; i<propertiesNum; ++i )
	{
		sumNutTemp = 0

		for( j=0; j<foodNum; ++j ){
			quantity = table.getElementsByTagName('tr')[j].getElementsByTagName('td')[1].innerHTML // Quantity of each food setted by the user
			l = quantity.toString().length
			// Limit to 7 digits
			if( quantity.length>7 ){
				quantity = quantity.substring( 0, l-1 )
				if( quantity.substring( l-2, l-1 )=='.' ) // If the last character is a point, delete it
					quantity = quantity.substring( 0, l-2 )

				table.getElementsByTagName('tr')[j].getElementsByTagName('td')[1].innerHTML = quantity
				//alert('Maximum seven digits, please.');
			}
			sumNutTemp += (quantity*foodMatrix[j][i]) // Append the values of first/the best combination ([0])
		}

		perc = (sumNutTemp*100)/optimalProperties[i]
		bestNutrients += '<tr><td>'+ perc.toFixed(2) +' %</td></tr>'
	}

	document.getElementById('resultsQ').innerHTML = bestNutrients
}