"use strict";
window.addEventListener("load", () => {
	const loader = document.querySelector(".loader");
	loader.style.opacity = "0";
	window.addEventListener("transitionend", () => {
		loader.remove();
	});
});

window.addEventListener("beforeunload", function (event) {
	document.body.innerHTML = `
	<dialog class="loader">
			<div class="ring"></div>
			<div class="ring"></div>
			<div class="ring"></div>
			<span class="text">Loading...</span>
			<div class="function">Are you sure you want to leave this page?
			<button>Yes</button></div>
		</dialog>`;
	document.title = "Reload Again...";
	document.querySelector(".function").addEventListener("click", () => {
		event.returnValue = "Are you sure you want to leave this page?";
		location.reload();
	});
	// event.returnValue = "Are you sure you want to leave this page?";
});

const disabledKeys = ["u", "I"];
const toastContainer = document.getElementById("toast-container");
let toastCount = 0;
const maxToastCount = 5;
const toastHeight = 35;

function createToast(e, toastIcon, toastHead, toastMsg) {
	e.preventDefault();
	if (toastCount >= maxToastCount) {
		const oldestToast = toastContainer.firstChild;
		toastRemove(oldestToast);
	}
	const toastDiv = document.createElement("div");
	toastDiv.className = "toast";
	const contentDiv = document.createElement("div");
	contentDiv.className = "toast_content";
	const iconElement = document.createElement("i");
	iconElement.className = `uil uil-${toastIcon} toast_icon`;
	const messageDiv = document.createElement("div");
	messageDiv.className = "message";
	const text1Span = document.createElement("span");
	text1Span.className = "text text1";
	text1Span.textContent = toastHead;
	const text2Span = document.createElement("span");
	text2Span.className = "text text2";
	text2Span.textContent = toastMsg;
	const closeIcon = document.createElement("i");
	closeIcon.className = "uil uil-times close";
	const progressDiv = document.createElement("div");
	progressDiv.className = "progress";
	messageDiv.appendChild(text1Span);
	messageDiv.appendChild(text2Span);
	contentDiv.appendChild(iconElement);
	contentDiv.appendChild(messageDiv);
	toastDiv.appendChild(contentDiv);
	toastDiv.appendChild(closeIcon);
	toastDiv.appendChild(progressDiv);
	document.getElementById("toast-container").appendChild(toastDiv);

	const bottomPosition = toastCount * toastHeight;
	toastDiv.style.bottom = `${bottomPosition}px`;
	toastCount++;

	// Show and manage the toast
	setTimeout(() => {
		toastDiv.setAttribute("active", "");
		progressDiv.setAttribute("active", "");
		closeIcon.addEventListener("click", () => {
			toastRemove(toastDiv);
		});
		progressDiv.addEventListener("animationend", () => {
			setTimeout(() => {
				closeIcon.click();
			}, 1);
		});
	}, 10);

	function toastRemove(removedToast) {
		removedToast.setAttribute("deactive", "");
		removedToast.removeAttribute("active");
		removedToast.addEventListener("animationend", () => {
			let nextToast = removedToast.nextElementSibling;
			while (nextToast) {
				const bottomPosition = parseInt(nextToast.style.bottom || 0);
				nextToast.style.bottom = `${bottomPosition - toastHeight}px`;
				nextToast = nextToast.nextElementSibling;
			}
			removedToast.remove();
			toastCount--;
		});
	}
}

// Handle context menu event
document.addEventListener("contextmenu", (e) => {
	createToast(
		e,
		"exclamation",
		"Warning",
		"Sorry, you can't view or copy source codes this way!"
	);
});

// Handle key events
window.addEventListener("keyup", function (e) {
	if (e.key === "PrintScreen") {
		navigator.clipboard.writeText("");
		createToast(
			e,
			"exclamation",
			"Warning",
			"Screenshots are disabled for this page."
		);
	}
});

document.addEventListener("keyup", (e) => {
	if ((e.ctrlKey && disabledKeys.includes(e.key)) || e.key === "F12") {
		createToast(
			e,
			"exclamation",
			"Warning",
			"Sorry, you can't view or copy source codes this way!"
		);
	}
});

document.addEventListener("DOMContentLoaded", () => {
	/*==================== MENU SHOW Y HIDDEN ====================*/
	const navMenu = document.getElementById("nav-menu");
	const navToggle = document.getElementById("nav-toggle");
	const navClose = document.getElementById("nav-close");
	const header = document.getElementById("header");
	var mediaQuery = window.matchMedia("(max-width: 769px)");
	var mediaQuery2 = window.matchMedia("(min-width: 769px)");

	/*===== MENU SHOW =====*/
	function bodyMenuOpen() {
		body.style.overflow = "hidden";
		body.style.userSelect = "none";
	}
	function bodyMenuClose() {
		body.style.overflow = "auto";
		body.style.userSelect = "auto";
	}
	/* Validate if constant exists */
	if (navToggle) {
		navToggle.addEventListener("click", () => {
			navMenu.classList.add("show-menu");
			bodyMenuOpen();
		});
	}

	/*===== MENU HIDDEN =====*/
	/* Validate if constant exists */
	if (navClose) {
		navClose.addEventListener("click", () => {
			navMenu.classList.remove("show-menu");
			bodyMenuClose();
		});
	}

	/*==================== REMOVE MENU MOBILE ====================*/
	const navLink = document.querySelectorAll(".nav_link");

	function linkAction() {
		navMenu.classList.remove("show-menu");
		bodyMenuClose();
	}
	navLink.forEach((n) => n.addEventListener("click", linkAction));

	/*==================== ANCHOR TAG HYPERLINK ====================*/
	document.querySelectorAll("[data-href]").forEach((elem) => {
		elem.style.cursor = "pointer";
		elem.style.userSelect = "none";
		elem.addEventListener("click", () => {
			if (elem.getAttribute("data-href") == "#") {
				return;
			}
			window.location.href = elem.getAttribute("data-href");
		});
	});

	/*==================== NAVBAR LINE OUT AFTER ANIMATION ====================*/
	function LineOut() {
		var links = document.querySelectorAll(
			".nav_link_hover:not(.active-link)"
		);
		links.forEach((link) => {
			link.addEventListener("mouseenter", () => {
				if (!link.classList.contains("active-link")) {
					link.classList.remove("unhovered");
					link.classList.add("hovered");
				}
			});

			link.addEventListener("mouseout", () => {
				link.classList.remove("hovered");
				link.classList.add("unhovered");
			});
		});
	}
	header.addEventListener("mousemove", LineOut);
	/*==================== HEADER COLOUR TOGGLE FOR ALL DEVICES ====================*/
	const aboutPar = document.querySelector(".about_description > span");
	const currentDate = new Date();
	const birthDate = new Date(2004, 6, 16);
	const ageInMilliseconds = currentDate - birthDate;
	const ageInYears = Math.floor(
		ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000)
	);
	aboutPar.innerText = `${ageInYears}-year-old`;

	/*==================== HEADER COLOUR TOGGLE FOR ALL DEVICES ====================*/
	var lastScrollTop = 0;
	var viewportHeight = window.innerHeight;
	function toggleHeaderColor(color, bgcolor, boxShadow) {
		var navElements = document.querySelectorAll(
			".nav_link, .nav_toggle, .change-theme"
		);

		header.style.backgroundColor = bgcolor;
		header.style.boxShadow = boxShadow;

		navElements.forEach(function (element) {
			element.style.color = color;
		});

		if (mediaQuery.matches) {
			document.getElementById("nav-menu").style.backgroundColor = bgcolor;
		}
	}
	document.addEventListener("scroll", function () {
		if (mediaQuery.matches) {
			var scrollTop = window.scrollY + viewportHeight - 20;
		} else {
			var scrollTop = window.scrollY + 70;
		}

		if (header) {
			if (scrollTop > viewportHeight) {
				toggleHeaderColor(
					"var(--title-color)",
					"var(--body-color)",
					"var(--header-shadow)"
				);
			} else {
				toggleHeaderColor(
					"var(--title-color-light)",
					"var(--nav-black)",
					"0 0 0 rgba(0, 0, 0, 0)"
				);
			}
		}
		lastScrollTop = scrollTop;
	});

	/*==================== RESUME SCROLL ====================*/
	const pages = document.querySelectorAll(".page");

	function resumeActive() {
		if (mediaQuery2.matches) {
			const scrollY = window.scrollY;

			pages.forEach((page) => {
				const sectionHeight = page.offsetHeight;
				const sectionTop = page.offsetTop - 130;

				let sectionId = page.getAttribute("id");
				if (
					scrollY >= sectionTop &&
					scrollY <= sectionTop + sectionHeight
				) {
					document
						.querySelectorAll(".resume_tabs a")
						.forEach((link) => {
							link.classList.remove("current");
						});
					document
						.querySelector(
							`.resume_tabs a[data-href*=${sectionId}]`
						)
						.classList.add("current");
				}
			});
		}
	}
	resumeActive();
	window.addEventListener("scroll", resumeActive);
	/*==================== RESUME SKILLS TABS ====================*/

	function runResumeLeftSkillsTab() {
		document.querySelectorAll(".skill_bar").forEach((bar) => {
			var per = 0;
			const percentage = bar
				.querySelector("small")
				.getAttribute("data-per");
			const span1 = bar.querySelector("span:nth-child(1)");
			const span2 = bar.querySelector("span:nth-child(2)");
			const intervalId = setInterval(() => {
				if (per <= percentage) {
					bar.querySelector("small").innerText = `${per}%`;
					span1.style.width = `${per}%`;
					span2.style.left = `${per - 1}%`;
					per++;
				} else {
					clearInterval(intervalId);
				}
			}, 40);
		});
	}

	function runResumeRightSkillsTab() {
		document.querySelectorAll(".circle").forEach((circle) => {
			var dots = 60;
			var marked = circle.parentNode
				.querySelector(".text p")
				.getAttribute("data-per");
			var percent = Math.round((dots * marked) / 100);
			var points = "";
			var rotate = 360 / dots;
			for (let i = 0; i < dots; i++) {
				points += `<div class="points" style="--i: ${i}; --rot: ${rotate}deg;"></div>`;
			}
			circle.innerHTML = points;

			const pointsMarked = circle.querySelectorAll(".points");
			for (let i = 0; i < percent; i++) {
				(function (index) {
					setTimeout(() => {
						circle.parentNode.querySelector(
							".text p"
						).innerText = `${Math.round((i * 100) / dots + 2)}%`;
						pointsMarked[index].style.backgroundColor =
							"var(--first-color-second)";
						pointsMarked[index].style.boxShadow =
							"0 0 8px 3px var(--drop-shadow)";
					}, 70 * (index + 1));
				})(i);
			}
		});
	}

	const skillsLeftTab = document.querySelector(".skills_left_grid");
	const skillsRightTab = document.querySelector(".skills_right_grid");

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting) {
				runResumeLeftSkillsTab();
			}
		},
		{
			rootMargin: "-100px",
		}
	);
	const observer2 = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting) {
				runResumeRightSkillsTab();
			}
		},
		{
			rootMargin: "-100px",
		}
	);

	if (skillsLeftTab) {
		observer.observe(skillsLeftTab);
	}

	if (skillsRightTab) {
		observer2.observe(skillsRightTab);
	}

	/*==================== SERVICES MODAL ====================*/

	/*==================== PORTFOLIO SWIPER  ====================*/

	/*==================== TESTIMONIAL ====================*/

	/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
	const sections = document.querySelectorAll("section[id]");

	const scrollActive = () => {
		const scrollY = window.scrollY;

		sections.forEach((current) => {
			const scrollHeight = current.offsetHeight;
			const sectionTop = current.offsetTop - 50;
			const sectionId = current.getAttribute("id");
			const navLink = document.querySelector(
				`.nav_link[data-href="#${sectionId}"]`
			);

			if (scrollY > sectionTop && scrollY <= sectionTop + scrollHeight) {
				document.querySelectorAll(".nav_link_hover").forEach((each) => {
					each.classList.remove("active-link");
				});
				navLink
					.querySelector(".nav_link_hover")
					.classList.add("active-link");
			}
		});
	};
	window.addEventListener("scroll", scrollActive);
	window.addEventListener("click", scrollActive);

	/*==================== CHANGE BACKGROUND HEADER ====================*/

	/*==================== SHOW SCROLL UP ====================*/

	/*==================== DARK LIGHT THEME ====================*/
	const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
	const themeButton = document.getElementById("theme-button");
	const body = document.body;

	function isLocalStorageSupported() {
		try {
			return "localStorage" in window && window["localStorage"] !== null;
		} catch (e) {
			return false;
		}
	}

	function browserHeader() {
		setTimeout(() => {
			var backgroundColor = window.getComputedStyle(
				document.body
			).backgroundColor;
			document
				.querySelector('meta[name="theme-color"]')
				.setAttribute("content", backgroundColor);
		}, 300);
	}

	function darkMode(mode) {
		body.setAttribute("data-theme", mode);
		browserHeader();

		if (isLocalStorageSupported() === true) {
			localStorage.setItem("data-theme", mode);
		}
	}

	themeButton.addEventListener("click", () => {
		if (body.getAttribute("data-theme") === "light") {
			darkMode("dark");
		} else {
			darkMode("light");
		}
	});

	if (isLocalStorageSupported() === true) {
		const storedTheme = localStorage.getItem("data-theme");
		const storedColor = localStorage.getItem("color");
		if (storedTheme) {
			darkMode(storedTheme);
		}
		if (storedColor) {
			document.documentElement.style.setProperty(
				"--hue-color",
				storedColor
			);
		}
	}

	if (prefersDarkMode.matches) {
		darkMode("dark");
	}

	window.addEventListener("keyup", (e) => {
		if (e.code === "Backquote" && e.key === "~" && e.shiftKey === true) {
			themeButton.click();
		}
	});

	/*==================== COLOURFUL THEME ====================*/
	const themeSetting = document.getElementById("theme-setting");
	const colorPicker = document.getElementById("color-picker");
	themeSetting.addEventListener("click", () => {
		colorPicker.style.display = "flex";
	});
	function colorPickerDisplay() {
		colorPicker.style.display = "none";
	}
	document
		.querySelectorAll("input[name='hue_color_picker']")
		.forEach((input) => {
			input.style.backgroundColor = `hsl(${input.value} ,69%, 61%)`;
			input.checked = false;
			if (localStorage.getItem("color") !== null) {
				if (input.value == localStorage.getItem("color")) {
					input.checked = true;
				}
			} else {
				document.querySelector(
					"input[name='hue_color_picker'][value='220']"
				).checked = true;
			}
			input.style.cursor = "pointer";
			input.addEventListener("click", () => {
				var colorValue = input.value;
				localStorage.setItem("color", colorValue);
				document.documentElement.style.setProperty(
					"--hue-color",
					colorValue
				);
				browserHeader();
				colorPickerDisplay();
			});
		});

	["scroll", "click", "contextmenu", "touchstart"].forEach((evt) => {
		document.addEventListener(evt, (e) => {
			if (
				!themeSetting.contains(e.target) &&
				!colorPicker.contains(e.target)
			) {
				colorPickerDisplay();
			}
		});
	});

	/*==================== BUTTONS ====================*/
	const buttons = document.querySelectorAll(".button");

	buttons.forEach((button) => {
		["mouseenter", "mouseleave", "mousemove"].forEach((evt) => {
			button.addEventListener(evt, (e) => {
				const parentOffset = button.getBoundingClientRect();
				const relX = e.clientX - parentOffset.left;
				const relY = e.clientY - parentOffset.top;

				const span = button.querySelector("span");

				if (span) {
					span.style.top = relY + "px";
					span.style.left = relX + "px";
				}
			});
		});
	});
});
