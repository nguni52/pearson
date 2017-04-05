
// A $( document ).ready() block.
$( document ).ready(function() {

//$( document ).tooltip();

//$( document ).tooltip();

//$( document ).tooltip();
//Json loading	
$.getJSON('map_data/data.json', function(data){

//var theID = "M10_001";
//console.log( data.skills);

$.each(data.skills, function(i, v) {
 
 
 // First Parameter: number of items
	// Second Parameter: options object

	

   
$.each(v, function(key, value) {
	
//$( ".toc" ).append( "<h2 style='text-align:center'>"+ value.name +"</h2>" );

/* Note that the whole content variable is just a string */
var content = "<table cellspacing='5' cellpadding='5'>"

//content += '<tr><td><a href="' + 'index.html?name=' + value.name + '">' + value.name + '<a/></td><td><a href="' + 'index.html?name=' + value.name + '"><img src= "' + value.images.path[0].ThumbImgPath + '"><a/></td><td><a href="' + 'index.html?name=' + value.name + '">' + value.Questions + '<a/></td></tr>';

content += '<tr><td><a href="' + 'index.html?name=' + value.name + '"><img src= "' + value.images.path[0].ThumbImgPath + '"><a/></td><td><a href="' + 'index.html?name=' + value.name + '">' + value.Questions + '<a/></td></tr>';

content += "</table>"

$('.toc').append(content);

 
	
});

console.log($('.toc table').size); 

   


	 
});
$(".toc").jPaginate();
});

});



