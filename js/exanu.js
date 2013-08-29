function exanu(){

	gramosUnidad = document.f2.gramos.value; // Necesario global
	var errorTolerado = document.f2.errortolerado.value;


	// Alerta si los cálculos tardarán demasiado

	if( (gramosUnidad.length>0 && gramosUnidad!=' ' && gramosUnidad<80) || (errorTolerado.length>0 && errorTolerado!=' ' && errorTolerado<80) ){
		alert("Números pequeños en la unidad o en el error tolerado aumentarán en gran medida el tiempo de ejecución.");
	}

	var i=0; var j=0; var k=0; // Evita variables globales
	var abs = Math.abs; // Mejora el rendimiento
	var random = Math.random;

	numPropiedades = 34; // Necesario global

	var tablaAlimentos = document.getElementById('alimentos');
	numAlimentos = tablaAlimentos.getElementsByTagName('th').length - (numPropiedades + 1); // Necesario global


	// Vector que almacena los nombres de los alimentos

	nombresAlimentos = new Array(numAlimentos); // Necesaria global
	for( i=0; i<numAlimentos; ++i ){
		nombresAlimentos[i] = tablaAlimentos.getElementsByTagName('th')[numPropiedades + 1 + i].innerHTML;
	}


	// Vector que almacena los nombres de las propiedades: energía, macronutrientes, vitaminas y minerales

	nombresPropiedades = new Array(numPropiedades); // Necesario global
	for( i=0; i<numPropiedades; ++i ){
		var nP = tablaAlimentos.getElementsByTagName('th')[i+1].innerHTML;

		if( nP.length<=3 ){ // Vitamina con nombre más largo: B12
			nP = 'Vitamina ' + nP; }

		nombresPropiedades[i] = nP;
	}


	// Matriz con todos los valores nutricionales

	matrizAlimentos = new Array(numAlimentos); // Necesaria global
	for( i=0; i<numAlimentos; ++i ){
		matrizAlimentos[i] = new Array(numPropiedades);
	}

	
	// Cantidad (g) de alimento por unidad

	var divisorGramos = 1; // => 100 g

	if( gramosUnidad.length!=0 && gramosUnidad!=' ' && gramosUnidad!=0 ){
		divisorGramos = 100/parseFloat(gramosUnidad);
	}


	// Llenando 'matrizAlimentos'

	for( i=0; i<numAlimentos; ++i ){
		for( j=0; j<numPropiedades; ++j ){
			matrizAlimentos[i][j] = parseFloat( tablaAlimentos.getElementsByTagName('td')[numPropiedades * i + j].innerHTML )/divisorGramos; // Dividir entre 5 para unidades de 20 gramos, etc.
		}
	}


	cantidadesOptimasPropiedades = new Array(numPropiedades); // Necesario global


	// Recogiendo el resultado de 'calcular()'

	cantidadesOptimasPropiedades[0] = parseFloat( document.getElementById('ccd').innerHTML );
	cantidadesOptimasPropiedades[1] = parseFloat( ( document.getElementById('proteinas').innerHTML ).replace(' g','') );
	cantidadesOptimasPropiedades[2] = parseFloat( ( document.getElementById('carbohidratos').innerHTML ).replace(' g','') );
	cantidadesOptimasPropiedades[3] = parseFloat( ( document.getElementById('fibra').innerHTML ).replace(' g','') );
	cantidadesOptimasPropiedades[4] = parseFloat( ( document.getElementById('calcio').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[5] = parseFloat( ( document.getElementById('hierro').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[6] = parseFloat( ( document.getElementById('yodo').innerHTML ).replace(' µg','') ); // A pesar de que la información encontrada indice "mg", hablamos en realidad de "µg" (o "mcg")
	cantidadesOptimasPropiedades[7] = parseFloat( ( document.getElementById('magnesio').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[8] = parseFloat( ( document.getElementById('zinc').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[9] = parseFloat( ( document.getElementById('selenio').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[10] = parseFloat( ( document.getElementById('sodio').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[11] = parseFloat( ( document.getElementById('potasio').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[12] = parseFloat( ( document.getElementById('fosforo').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[13] = parseFloat( ( document.getElementById('cloruro').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[14] = parseFloat( ( document.getElementById('cobre').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[15] = parseFloat( ( document.getElementById('manganeso').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[16] = parseFloat( ( document.getElementById('fluoruro').innerHTML ).replace(' mg','')*1000 ); // De mg a µg
	cantidadesOptimasPropiedades[17] = parseFloat( ( document.getElementById('cromo').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[18] = parseFloat( ( document.getElementById('molibdeno').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[19] = parseFloat( ( document.getElementById('vit_a').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[20] = parseFloat( ( document.getElementById('vit_b1').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[21] = parseFloat( ( document.getElementById('vit_b2').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[22] = parseFloat( ( document.getElementById('vit_b3').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[23] = parseFloat( ( document.getElementById('vit_b5').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[24] = parseFloat( ( document.getElementById('vit_b6').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[25] = parseFloat( ( document.getElementById('vit_b8').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[26] = parseFloat( ( document.getElementById('vit_b9').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[27] = parseFloat( ( document.getElementById('vit_b12').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[28] = parseFloat( ( document.getElementById('vit_c').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[29] = parseFloat( ( document.getElementById('vit_d').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[30] = parseFloat( ( document.getElementById('vit_e').innerHTML ).replace(' mg','') );
	cantidadesOptimasPropiedades[31] = parseFloat( ( document.getElementById('vit_k').innerHTML ).replace(' µg','') );
	cantidadesOptimasPropiedades[32] = parseFloat( ( document.getElementById('omega_3').innerHTML ).replace(' g','') );
	cantidadesOptimasPropiedades[33] = parseFloat( ( document.getElementById('omega_6').innerHTML ).replace(' g','') );


	// Cantidades máximas de cada alimento

	var cantidadesMaxAlimentos = new Array(numAlimentos);
	for( i=0; i<numAlimentos; ++i ){
		cantidadesMaxAlimentos[i] = 0; }


	// TO-DO: susituir 'cantidadesOptimasPropiedades[j]' por 'cantidadesMaxPropiedades[j]' (la energía, proteínas, carbohidratos, omega 3 y 6 no variarán)


	var maxTemporal = 0; var maxPosible = 0;

	for( i=0; i<numAlimentos; ++i ){
		maxTemporal = 9999;
		for( j=0; j<numPropiedades; ++j ){
			if( matrizAlimentos[i][j]!=0 ){ // Evitar división por 0
				maxPosible = ( cantidadesOptimasPropiedades[j]/matrizAlimentos[i][j] )|0; // = Math.floor
			}
			if( maxPosible < maxTemporal ){
				maxTemporal = maxPosible; }
		}
		cantidadesMaxAlimentos[i] = maxTemporal;
	}



	var cantidadesOptimasAlimentos = new Array(numAlimentos);
	for( i=0; i<numAlimentos; ++i ){
		cantidadesOptimasAlimentos[i] = 0; }


	// Cálculo de las cantidades óptimas de alimentos - Función principal

	var porcentajeActual = numPropiedades*100; // Inicializamos al valor que tomará 'porcentajeTemporal' en la primera vuelta (= "todos los 100%")
	var porcentajeObjetivo = 0; // Porcentaje, en total, en que nos queremos equivocar (0 => se han conseguido el 100% de todos los nutrientes)

	if( errorTolerado.length==0 || errorTolerado==' ' ){
		porcentajeObjetivo = 90*numPropiedades; // 60 * 34 = 2040
	} else {
		porcentajeObjetivo = parseFloat(errorTolerado)*numPropiedades;
	}
	

	var porcentajeTemporal = 0; var sumaTemporal = 0;

	while( porcentajeActual > porcentajeObjetivo ){ // Suponemos alguna solución válida

		for( r=0; r<numAlimentos; ++r ){
			cantidadesOptimasAlimentos[r] = (random() * (cantidadesMaxAlimentos[r]+1))|0; // Números aleatorios enteros entre 0 y 'cantidadesMaxAlimentos' [ Math.floor(Math.random() * (max - min + 1)) + min; ]
		}

		porcentajeTemporal = 0;
		for( j=0; j<numPropiedades && porcentajeTemporal<porcentajeActual; ++j ){
			sumaTemporal = 0;
			for( k=0; k<numAlimentos; ++k ){
				sumaTemporal += matrizAlimentos[k][j] * cantidadesOptimasAlimentos[k]; // Suma de cada propiedad para todos los alimentos
			}
			porcentajeTemporal += abs( 100 - ( (sumaTemporal*100)/cantidadesOptimasPropiedades[j] ) ); // Suma de las diferencias de los porcentajes
		}

		if( porcentajeTemporal < porcentajeActual ){ porcentajeActual = porcentajeTemporal; }		
	}



	// Porcentajes de nutrientes

	document.getElementById('nutrientesObtenidosWrap').style.display = 'block';

	var tablaNutrientesObtenidos = '';

	var sumaPropiedad = 0;
	var porcentajePropiedad = 0;

	for( i=0; i<numPropiedades; ++i ){
		sumaPropiedad = 0;
		for( j=0; j<numAlimentos; ++j ){
			sumaPropiedad += matrizAlimentos[j][i] * cantidadesOptimasAlimentos[j];
		}
		porcentajePropiedad = ( (sumaPropiedad*100)/cantidadesOptimasPropiedades[i] ).toFixed(2);

		if( nombresPropiedades[i] != 'Energía' ){
			tablaNutrientesObtenidos += '<tr><td>' + nombresPropiedades[i] + '</td><td>' + porcentajePropiedad + '%';

			if( porcentajePropiedad<90 && porcentajePropiedad!=0 ){
				tablaNutrientesObtenidos += '<span style="color:#933"> *</span></td></tr>';
			} else { tablaNutrientesObtenidos += '</td></tr>'; }

		} else {
			var energiaTemp = '<tr><td>' + nombresPropiedades[i] + '</td><td>' + porcentajePropiedad + '%';

			if( porcentajePropiedad<90 && porcentajePropiedad!=0 ){
				energiaTemp += '<span style="color:#933"> *</span></td></tr>';
			} else { energiaTemp += '</td></tr>'; }
		}
	}

	tablaNutrientesObtenidos += energiaTemp; // La energía al final

	document.getElementById('nutrientesObtenidos').innerHTML = tablaNutrientesObtenidos;



	// Mostrar cantidades óptimas

	document.getElementById('alimentosSugeridosWrap').style.display = 'block';

	if( gramosUnidad.length==0 || gramosUnidad==' ' || gramosUnidad==0 ){ gramosUnidad = 100; } // Valor por defecto

	document.getElementById('alimentosSugeridosTitle').innerHTML = 'Alimentos sugeridos (unidades de ' + gramosUnidad + ' g)';


	var tablaAlimentosSugeridos = '';

	for( i=0; i<numAlimentos; ++i ){
		if( cantidadesOptimasAlimentos[i]!=0 ){ // Evitar alimentos con cantidad 0
			tablaAlimentosSugeridos += '<tr><td>' + nombresAlimentos[i] + '</td><td>' + cantidadesOptimasAlimentos[i] + '</td></tr>';
		}
	}
	document.getElementById('alimentosSugeridos').innerHTML = tablaAlimentosSugeridos;




	// Selector de alimentos
	document.getElementById('botonSelector').style.display = 'block';
	if( document.getElementById('selectorAlimentosWrap').style.display == 'block' ){
		document.getElementById('selectorAlimentosWrap').style.display = 'none';
	}

}





function mostrarSelector(){
	document.getElementById('alimentosSugeridosWrap').style.display = 'none';
	document.getElementById('selectorAlimentosWrap').style.display = 'block';

	var selectorContenido = '';
	for( i=0; i<numAlimentos; ++i ){
		selectorContenido += '<tr><td>' + nombresAlimentos[i] + '</td><td>' + '<input type="text" onkeyup="calcularPorcentaje()" />' + '</td></tr>';
	}

	document.getElementById('selectorAlimentos').innerHTML = selectorContenido;
	document.getElementById('botonSelector').style.display = 'none';
}


function calcularPorcentaje(){

	// Porcentajes de nutrientes

	var tablaNutrientesObtenidos = '';

	var sumaPropiedad = 0;
	var porcentajePropiedad = 0;


	var gU = 100;
	if( gramosUnidad.length!=0 && gramosUnidad!=' ' && gramosUnidad!=0 ){
		gU = gramosUnidad;
	}

	for( i=0; i<numPropiedades; ++i ){
		sumaPropiedad = 0;
		for( j=0; j<numAlimentos; ++j ){
			sumaPropiedad += ( matrizAlimentos[j][i] )/gU * document.getElementById('selectorAlimentos').getElementsByTagName('input')[j].value;
		}
		porcentajePropiedad = ( (sumaPropiedad*100)/cantidadesOptimasPropiedades[i] ).toFixed(2);

		if( nombresPropiedades[i] != 'Energía' ){
			tablaNutrientesObtenidos += '<tr><td>' + nombresPropiedades[i] + '</td><td>' + porcentajePropiedad + '%';

			if( porcentajePropiedad<90 && porcentajePropiedad!=0 ){
				tablaNutrientesObtenidos += '<span style="color:#933"> *</span></td></tr>';
			} else { tablaNutrientesObtenidos += '</td></tr>'; }

		} else {
			var energiaTemp = '<tr><td>' + nombresPropiedades[i] + '</td><td>' + porcentajePropiedad + '%';

			if( porcentajePropiedad<90 && porcentajePropiedad!=0 ){
				energiaTemp += '<span style="color:#933"> *</span></td></tr>';
			} else { energiaTemp += '</td></tr>'; }
		}
	}

	tablaNutrientesObtenidos += energiaTemp; // La energía al final

	document.getElementById('nutrientesObtenidos').innerHTML = tablaNutrientesObtenidos;
}