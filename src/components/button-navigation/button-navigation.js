// Nav button
$(document).ready(function () {
	let navButton = $("#navigation-button");
	let navBurger = navButton.find(".navigation-button__burger");
	navButton.click(function () {
		navBurger.toggleClass("navigation-button__burger--clicked");
	});
});
