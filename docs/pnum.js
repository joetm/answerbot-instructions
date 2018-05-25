//https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
function findGetParameter(parameterName) {
	var result = null,
	    tmp = [];
	var items = location.search.substr(1).split("&");
	for (var index = 0; index < items.length; index++) {
	    tmp = items[index].split("=");
	    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	}
	return result;
}
$(function() {
	var pnum = findGetParameter('p');
	if (pnum) {
		$('#number #pnum').text(pnum);
		// attach get parameter to links
		$('#navlink').attr('href', $('#navlink').attr('href') + '?p=' + pnum);
	}
});
