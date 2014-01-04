<?php

function db_connect()
{
	$con = mysqli_connect( 'localhost', 'root', 'pass', 'kw_db' );

	if( mysqli_connect_errno() ){
		echo 'Error al conectar: ' . mysqli_connect_error(); }

	return $con;
}


function getNumProperties()
{
	$con = db_connect();

	$sql = "SELECT COUNT(*) FROM Properties";
	$result = mysqli_query($con, $sql);
	$r = mysqli_fetch_array($result);

	mysqli_close($con);

	return $r[0];
}


function getNumFood()
{
	$con = db_connect();

	$sql = "SELECT COUNT(*) FROM Food";
	$result = mysqli_query($con, $sql);
	$r = mysqli_fetch_array($result);

	mysqli_close($con);

	return $r[0];
}


function propertiesInitialTable()
{
	$con = db_connect();
	$sql = "SELECT name FROM Properties";
	$result = mysqli_query($con, $sql);

	$toret = '';

	while( ($r=mysqli_fetch_array($result)) )
		$toret .= '<tr><td>' .$r['name']. '</td><td>0</td></tr>';

	echo $toret;

	mysqli_close($con);
}


function foodInitialTable()
{
	$con = db_connect();
	$sql = "SELECT name FROM Food ORDER BY name";
	$result = mysqli_query($con, $sql);

	$toret = '<tbody>';
	$i = 0;

	while( ($r=mysqli_fetch_array($result)) )
	{		
		// Groups of 36 items
		if( $i%36==0 && $i!=0 )
			$toret .= '</tbody><tbody>';
		
		$toret .= '<tr><td>' .$r['name']. '</td><td>0</td></tr>';

		++$i;
	}

	$toret .= '</tbody>';
	echo $toret;

	mysqli_close($con);
}


function foodFullTable()
{
	$con = db_connect();
	$sql = "SELECT name, vegetarian, vegan, raw, kcal, prots, carbs, fiber, ca, fe, i, mg, zn, se, na, k, p, cl, cu, mn, f, cr, mo, vita, vitb1, vitb2, vitb3, vitb5, vitb6, vitb8, vitb9, vitb12, vitc, vitd, vite, vitk, w3, w6 FROM Food ORDER BY name";
	$result = mysqli_query($con, $sql);

	$toret = '';

	while( ($r=mysqli_fetch_array($result)) )
	{		
		$toret .= '
		<tr>
			<th>' . $r['name'] 	. '</th>
			<td>' . $r['kcal'] 	. '</td>
			<td>' . $r['prots'] . '</td>
			<td>' . $r['carbs'] . '</td>
			<td>' . $r['fiber'] . '</td>
			<td>' . $r['ca'] 	. '</td>
			<td>' . $r['fe'] 	. '</td>
			<td>' . $r['i'] 	. '</td>
			<td>' . $r['mg'] 	. '</td>
			<td>' . $r['zn'] 	. '</td>
			<td>' . $r['se'] 	. '</td>
			<td>' . $r['na'] 	. '</td>
			<td>' . $r['k'] 	. '</td>
			<td>' . $r['p'] 	. '</td>
			<td>' . $r['cl'] 	. '</td>
			<td>' . $r['cu'] 	. '</td>
			<td>' . $r['mn'] 	. '</td>
			<td>' . $r['f'] 	. '</td>
			<td>' . $r['cr'] 	. '</td>
			<td>' . $r['mo'] 	. '</td>
			<td>' . $r['vita'] 	. '</td>
			<td>' . $r['vitb1'] . '</td>
			<td>' . $r['vitb2'] . '</td>
			<td>' . $r['vitb3'] . '</td>
			<td>' . $r['vitb5'] . '</td>
			<td>' . $r['vitb6'] . '</td>
			<td>' . $r['vitb8'] . '</td>
			<td>' . $r['vitb9'] . '</td>
			<td>' . $r['vitb12']. '</td>
			<td>' . $r['vitc'] 	. '</td>
			<td>' . $r['vitd'] 	. '</td>
			<td>' . $r['vite'] 	. '</td>
			<td>' . $r['vitk'] 	. '</td>
			<td>' . $r['w3'] 	. '</td>
			<td>' . $r['w6'] 	. '</td>
		</tr>';
	}

	echo $toret;

	mysqli_close($con);
}


function foodFullTableHeaders()
{
	$con = db_connect();
	$sql = "SELECT name, abbr FROM Properties"; // ORDER BY name
	$result = mysqli_query($con, $sql);

	$toret = '<tr><th></th>';
	$i = 0;

	while( ($r=mysqli_fetch_array($result)) )
	{
		$toret .= '<th onmouseover="highligthP('.$i.')" onmouseout="highligthPOut('.$i.')" onclick="highlightFixed('.$i.')" title="'.$r['name'].'">'.$r['abbr'].'</th>';

		++$i;
	}

	$toret .= '</tr>';
	echo $toret;

	mysqli_close($con);
}


function foodFullTableSimpleHeaders()
{
	$con = db_connect();
	$sql = "SELECT name, abbr FROM Properties"; // ORDER BY name
	$result = mysqli_query($con, $sql);

	$toret = '<tr><th></th>';

	while( ($r=mysqli_fetch_array($result)) )
		$toret .= '<th>'.$r['name'].'</th>';

	$toret .= '</tr>';
	echo $toret;

	mysqli_close($con);
}
