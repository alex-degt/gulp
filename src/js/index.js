// Переключение "состояния" кнопки
function buttonStateOnClick() {
	let state = $(this).attr("data-clicked");
	let that = $(this);
	if (state === "false") {
		that.attr("data-clicked", true);
	} else {
		that.attr("data-clicked", false);
	}
}

// Хедер - фоновый цвет и тень при скролле
function fillHeader() {
	let height = $(window).scrollTop();
	let header = $("#header");
	if (height > 100) {
		$(header).addClass("header--scrolled");
	} else {
		$(header).removeClass("header--scrolled");
	}
}

$(document).ready(function () {
	$(window).scroll(fillHeader);
	fillHeader();

	// При клике на .popup--open - открыть попап
	$(".popup--open").each(function () {
		let popup = document.getElementById($(this).data("target"));

		// Показать
		$(this).click(function () {
			$(popup).show();
		});

		// Закрытие при нажатии ESC
		$(document).keydown(function (e) {
			if (e.which == 27) {
				$(popup).hide();
			}
		});

		// Закрытие при клике вне области попапа
		$(document).mouseup(function (e) {
			if (!$(popup).children().is(e.target) && $(popup).children().has(e.target).length === 0) {
				$(popup).hide();
			}
		});
	});

	// При клике на кнопку "Добавить в корзину/избранное" - изменить её внешний вид
	$(".button-add-to-favorites").click(buttonStateOnClick);
	$(".button-add-to-cart").click(buttonStateOnClick);
});
