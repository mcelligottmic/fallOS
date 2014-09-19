
function displayClock() {
	var d = new Date();
	var hr = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();

	function addZero(i) {
		if (i<10) {i = "0" + i};
			return i;
		}

	var s = "" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + addZero(hr) + ":" + addZero(min) + "" + ":" + addZero(sec) + "";

	document.getElementById('clockBox').innerHTML = s;
	setTimeout(function () {
		displayClock();
	}, 500);
}
$(document).ready(function(){
	displayClock();
});