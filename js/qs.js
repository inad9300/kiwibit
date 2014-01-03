
// Quicksort

Array.prototype.swap = function( a, b )
{
	var tmp = this[a]
	this[a] = this[b]
	this[b] = tmp
}


function partition( array, begin, end, pivot )
{
	var piv = array[pivot]
	array.swap( pivot, end-1 )

	for( i=0; i<foodNum; ++i )
		foodPopulation[i].swap(pivot, end-1)

	var store = begin
	var ix
	for( ix=begin; ix<end-1; ++ix )
	{
		if( array[ix]<=piv ){
			array.swap( store, ix )

			for( i=0; i<foodNum; ++i )
				foodPopulation[i].swap( store, ix )

			++store
		}
	}

	array.swap( end-1, store )

	for( i=0; i<foodNum; ++i )
		foodPopulation[i].swap( end-1, store )

	return store
}


function qsort( array, begin, end )
{
	if( end-1>begin ){
		var pivot = begin+floor( random()*(end-begin) )

		pivot = partition( array, begin, end, pivot )

		qsort( array, begin, pivot )
		qsort( array, pivot+1, end )
	}
}


function quick_sort( array )
{
	qsort( array, 0, array.length )
}