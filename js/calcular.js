function calcular() {

	var edad = parseFloat( document.f1.edad.value ); // años
	var peso = parseFloat( document.f1.peso.value ); // kg
	var altura = parseFloat( document.f1.altura.value ); // cm
	if( altura<3 ){ altura = altura*100; } // m a cm

	var cintura = parseFloat( document.f1.cintura.value ); // cm
	var cadera = parseFloat( document.f1.cadera.value ); // cm

	var sexo = 'varon'; // varon, mujer
	if( document.getElementById('sexselect').style.top == '40px' ){ sexo = 'mujer'; }


	var actividad = 'ninguna'; // ninguna, ligera, moderada, intensa, muy_intensa
	var flechitaLeft = document.getElementById('lvlactselect').style.left;
	if( flechitaLeft == '34px' ){
		actividad = 'ligera';
	} else if( flechitaLeft == '64px' ){
		actividad = 'moderada';
	} else if( flechitaLeft == '94px' ){
		actividad = 'intensa';
	} else if( flechitaLeft == '124px' ){
		actividad = 'muy_intensa';
	}

	var lactante = 'no'; // si, no
	if( document.getElementById('lacselect').style.left == '0px' ){ lactante = 'si'; }


	var embarazada = 'no'; // si, no
	if( document.getElementById('lacselect').style.left == '0px' ){ embarazada = 'si'; }

	// IMC (Índice de Masa Corporal)
	var altura_m = altura/100;
	var imc = peso/(altura_m*altura_m);
	var imc_desc = '';
	if( imc>40 ){
		imc_desc = 'Obesidad tipo III';
	} else if( imc>35 ){
		imc_desc = 'Obesidad tipo II';
	} else if( imc>30 ){
		imc_desc = 'Obesidad tipo I';
	} else if( imc>25 ){
		imc_desc = 'Sobrepeso (preobesidad)';
	} else if( imc>18.5 ){
		imc_desc = 'Peso normal';
	} else if( imc>17 ){
		imc_desc = 'Infrapeso: delgadez no muy pronunciada';
	} else if( imc>16 ){
		imc_desc = 'Infrapeso: delgadez moderada';
	} else {
		imc_desc = 'Infrapeso: delgadez severa';
	}

	document.getElementById('imc').innerHTML = imc.toFixed(2);
	document.getElementById('imc_desc').innerHTML = imc_desc;


	// TMB (Tasa de Metabolismo Basal)
	if( sexo == 'varon' ){
		var tmb = (10*peso)+(6.25*altura)-(5*edad)+5;
	} else if( sexo == 'mujer' ){
		var tmb = (10*peso)+(6.25*altura)-(5*edad)-161;
	}

	document.getElementById('tmb').innerHTML = tmb.toFixed(2);


	// Ingesta diaria de calorías recomendada
	if( actividad == 'ninguna' ){
		document.getElementById('ccd').innerHTML = (tmb*1.2).toFixed(2);
	} else if( actividad == 'ligera' ){
		document.getElementById('ccd').innerHTML = (tmb*1.375).toFixed(2);
	} else if( actividad == 'moderada' ){
		document.getElementById('ccd').innerHTML = (tmb*1.55).toFixed(2);
	} else if( actividad == 'intensa' ){
		document.getElementById('ccd').innerHTML = (tmb*1.725).toFixed(2);
	} else if( actividad == 'muy_intensa' ){
		document.getElementById('ccd').innerHTML = (tmb*1.9).toFixed(2);
	}


	// ICC (Índice Cintura-Cadera)
	var icc = cintura/cadera;
	var icc_desc = '';

	if( sexo=='varon' ){
		if( icc>0.94 ){
			icc_desc = 'Síndrome androide (cuerpo de manzana)';
		} else if( icc<0.78 ){
			icc_desc = 'Síndrome ginecoide (cuerpo de pera)';
		} else {
			icc_desc = 'Valor normal';
		}
	} else if( sexo=='mujer' ){
		if( icc>0.84 ){
			icc_desc = 'Síndrome androide (cuerpo de manzana)';
		} else if( icc<0.71 ){
			icc_desc = 'Síndrome ginecoide (cuerpo de pera)';
		} else {
			icc_desc = 'Valor normal';
		}
	}

	document.getElementById('icc').innerHTML = icc.toFixed(2);
	document.getElementById('icc_desc').innerHTML = icc_desc;


	// Frecuencia Cardíaca Máxima
	var fcm = (210-0.5*edad)-(0.01*peso);
	if( sexo=='varon' ){
		fcm += 4;
	}
	document.getElementById('fcm').innerHTML = fcm.toFixed(2);


	// Frecuencia Cardíaca Submáxima
	var fcs = 0;
	if( sexo=='varon' ){
		fcs = fcm*0.6;
	} else if( sexo=='mujer' ){
		fcs = fcm*0.85;
	}
	document.getElementById('fcs').innerHTML = fcs.toFixed(2);


	// Cálculo de proteínas necesarias
	var prot = 0;
	if( edad<1 ){
		prot = 14;
	} else if( edad<3 ){
		prot = 22;
	} else if( edad<5 ){
		prot = 26;
	} else if( edad<7 ){
		prot = 30;
	} else if( edad<10 ){
		prot = 34;
	} else if( sexo=='varon' ){
		if( edad<12 ){
			prot = 48;
		} else if( edad<14 ){
			prot = 59;
		} else if( edad<16 ){
			prot = 70;
		} else if( edad<18 ){
			prot = 81;
		} else if( edad<60 ){
			prot = 55;
		} else { prot = 55; }
	} else if( sexo=='mujer' ){
		if( edad<12 ){
			prot = 49;
		} else if( edad<14 ){
			prot = 59;
		} else if( edad<16 ){
			prot = 64;
		} else if( edad<18 ){
			prot = 63;
		} else if( edad<60 ){
			prot = 49;
		} else { prot = 49; }
	}

	if( lactante=='si' ){
		prot = 69;
	} else if( embarazada=='si' ){
		prot = 56;
	}

	document.getElementById('proteinas').innerHTML = prot + ' g';


	// Minerales y vitaminas
	document.getElementById('carbohidratos').innerHTML = 6*peso + ' g';
	document.getElementById('fibra').innerHTML = 30 + ' g';
	document.getElementById('calcio').innerHTML = 800 + ' mg';
	document.getElementById('hierro').innerHTML = 14 + ' mg';
	document.getElementById('yodo').innerHTML = 150 + ' µg';
	document.getElementById('magnesio').innerHTML = 375 + ' mg';
	document.getElementById('zinc').innerHTML = 10 + ' mg';
	document.getElementById('selenio').innerHTML = 55 + ' µg';
	document.getElementById('sodio').innerHTML = 500 + ' mg';
	document.getElementById('potasio').innerHTML = 2000 + ' mg';
	document.getElementById('fosforo').innerHTML = 700 + ' mg';
	document.getElementById('cloruro').innerHTML = 800 + ' mg';
	document.getElementById('cobre').innerHTML = 1 + ' mg';
	document.getElementById('manganeso').innerHTML = 2 + ' mg';
	document.getElementById('fluoruro').innerHTML = 3.5 + ' mg';
	document.getElementById('cromo').innerHTML = 40 + ' µg';
	document.getElementById('molibdeno').innerHTML = 50 + ' µg';
	document.getElementById('vit_a').innerHTML = 800 + ' µg';
	document.getElementById('vit_b1').innerHTML = 1.1 + ' mg';
	document.getElementById('vit_b2').innerHTML = 1.4 + ' mg';
	document.getElementById('vit_b3').innerHTML = 16 + ' mg';
	document.getElementById('vit_b5').innerHTML = 6 + ' mg';
	document.getElementById('vit_b6').innerHTML = 1.4 + ' mg';
	document.getElementById('vit_b8').innerHTML = 50 + ' µg';
	document.getElementById('vit_b9').innerHTML = 400 + ' µg';
	document.getElementById('vit_b12').innerHTML = 2.5 + ' µg';
	document.getElementById('vit_c').innerHTML = 80 + ' mg';
	document.getElementById('vit_d').innerHTML = 5 + ' µg';
	document.getElementById('vit_e').innerHTML = 12 + ' mg';
	document.getElementById('vit_k').innerHTML = 75 + ' µg';
	document.getElementById('omega_3').innerHTML = 2 + ' g';
	document.getElementById('omega_6').innerHTML = 2 + ' g';

}