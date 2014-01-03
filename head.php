<?php

/*

Imagen
------

- Ordenar alimentos según cierta propiedad al clicar en dicha propiedad
- Resaltar las 'carencias nutricionales', por debajo de un cierto umbral
- Botón para colocar todo a 0
- Opción de "Ocultar ceros" en el selector ("Hide 0s")
- Facilitar descubrir qué alimentos contienen más de tal nutriente (para las 'carencias')
- Images for food on tables (on name food :hover)
- 'Kiwi-Wheels' as logo/favicon
- Options to hide each module
- Opción 'solo crudo'
- Información sobre cómo tomarse medidas, advertencia "para la salud", etc.


Programación
------------

- Test/implement different grams quantities
- Save nutritional values to improve them later
- Si a un alimento se asigna una cantidad aleatoria 0 al principio, nunca podremos tener ni 1 gramo del mismo (?) -> revisar
- Resultado decente con algoritmo aleatorio >> algortimo genético
- Considerar hacer la media en la "reproducción" entre dos combinaciones
- Make functions and add comments to them and to the other code
- Optimization: X*10/100 = X*0.1 !!??
- Crear los X peores con los X mejores, en caso de que los elementos a borrar sean menos del 50%; si no, repetir con los mejores. En cualquier caso, evitar que salgan los mismos r1 y r2 muchas veces
- Perfeccionar los máximos, acotándolos, pues no es probable la cantidad máxima de la mayoría de alimentos (p. ej.: si máx>10 => máx-=5)
- Considerar no poner mín (límite inferior) = 0 en algunos alimentos (los recurrentes, los que deseemos...)
- Base de Datos con MariaDB


Nutrición
---------

- Comprobar nutrientes, en especial el flúor
- Investigar límites superiores (máximos) de vitaminas y minerales
- Riesgo cardiovascular: http://www.clinicacondado.com/riesgo_cardiovascular.html
- Betaína? antioxidantes? índice glucémico? más ácidos grasos esenciales? colina? agua?
- Cobalto, aluminio, azufre, bromo, níquel...? vitamina B15 y B13? grasas/lípidos (totales)?
- Sal (NaCl)? say yodada (+I)?


Varios
------

- En el title de los porcentajes dados como resultado, calcular en el evento onmouseover el cantidad que suponen dichos porcentajes
- Simple food form, to any user, with a textarea to put the information sources (with moderation between)
- Permitir cambiar la cantidad de cada alimento, con opción de 'continuar mejora' a partir de dichos valores
- Publicar en blog, foro y soylent forums
- Food categories
- Registrar usuarios: guardar sus valores, extraer información estadística y mostrar en un área pública, anónimamente (?)
- Controlar el sexo y la actividad física mediante las flechas del teclado


* Computación distribuida con JavaScript y AJAX (<- random approach)

	- ¿Cuántos/Qué PCs sirvo en un tiempo t? -> $_SERVER['REMOTE_ADDR'] + pulsos "estoy aquí", "estoy aquí", ...
	- Categorías de PCs (según tiempo real dedicado a ayudar o potencia)
	- Script para poner en una web, después de que cargue por completo, limitando la potencia de procesamiento para no suponer saturación
	- Porcentaje de la solución total/aportado por el usuario
	- 3 estados de la tarea: libre, ocupado (asignada) y completado

	- Counter between 0 and the number of posibilities, incrementing it in X each time (X~10.000) => a range for each user
	- Show each "part" (range) to do by the users (with web workers) as a red/green pixel ("zoomable")
	- Common Map to all users, and then use it as base of the particular genethic algorithm
	- Show CPU % load

*/

include 'functions.php';


$dir = basename($_SERVER['REQUEST_URI']);

if( strpos($dir,'tables.php')!==false ){
	$description = 'Nutrition facts of many foods for Kiwibit project';
	$keywords = 'nutritional tables, food nutritional values, nutrition facts, nutritional information';
	$title = 'Nutritional tables - Kiwibit.net';

} elseif( strpos($dir,'info.php')!==false ){
	$description = 'Information about Kiwibit application';
	$title = 'Information - Kiwibit.net';
	$keywords = 'Kiwibit information';

} elseif( strpos($dir,'help.php')!==false ){
	$description = 'Ideas to lend a hand to the Kiwibit proyect';
	$title = 'Help - Kiwibit.net';
	$keywords = 'help Kiwibit';

} else { // index.php
	$description = 'Kiwibit is an application to calculate the perfect food combination to each person';
	$keywords = 'nutrition calculator, nutrition application, food combination, calculate food nutrients';
	$title = 'Kiwibit.net - Nutrition and Health Calculator';
}

?>
<!doctype html>
<html lang='en'>
<head>
	<meta charset='utf-8'>

	<meta name='description' content=<?php echo '"' . $description . '"' ?>>
	<meta name='keywords' content=<?php echo '"' . $keywords . '"' ?>>

	<meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
	<meta name='viewport' content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;'>
	<!--[if lt IE 9]><script src='https://html5shiv.googlecode.com/svn/trunk/html5.js'></script><![endif]-->

	<title><?php echo $title ?></title>
	<link rel='license' href='http://creativecommons.org/licenses/by/3.0/'>

	<!-- Google Font -->
	<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>

	<link rel='stylesheet' type='text/css' media='screen' href='css/main.css'>
	<link rel='stylesheet' type='text/css' media='print' href='css/print.css'>

	<!-- Favicon -->
	<link rel='icon' href='img/favicon.png' type='image/png'>

	<!-- Windows 8 Tile -->
	<meta name='msapplication-TileImage' content='img/windows-icon-144-144.png'/>
	<meta name='msapplication-TileColor' content='#e63b2c'/>

	<!-- Apple Touch Icons -->
	<link rel='apple-touch-icon' href='img/touch-icon-iphone.png'><!-- 57 x 57 -->
	<link rel='apple-touch-icon' sizes='72x72' href='img/touch-icon-ipad.png'>
	<link rel='apple-touch-icon' sizes='114x114' href='img/touch-icon-iphone-retina.png'>
	<link rel='apple-touch-icon' sizes='144x144' href='img/touch-icon-ipad-retina.png'>

	<!-- JavaScript -->
	<script src='js/highlight.js'></script>
	<script src='js/validate.js'></script>
	<script src='js/calculate.js'></script>
	<script src='js/qs.js'></script>
	<script src='js/main.js'></script>
	<script src='js/selector.js'></script>
	<script src='js/play_pause.js'></script>
</head>
<body>

	<!-- Header -->
	<header id='head'>
		<div id='hgroup'>
			<h1><a href='index.php'>Kiwibit.net</a></h1><sup>Beta</sup>
			<h2>Nutrition and Health Calculator</h2>
		</div>
		<nav><ul>
			<li><a href='index.php' title='Application'>Home</a></li>
			<li><a href='tables.php' title='Nutrition facts'>Tables</a></li>
			<li><a href="http://exanu.wordpress.com/" target="_blank" title='External blog (Spanish)'>Blog</a></li>
			<li><a href='info.php' title='About Kiwibit'>Info</a></li>
			<li><a href='help.php' title='Lend a hand'>Help</a></li>
		</ul></nav>
	</header>