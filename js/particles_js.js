document.addEventListener("DOMContentLoaded", function () {
	// Initializing variables
	let max_particles = 500,
		particles = [],
		frequency = 10,
		init_num = max_particles,
		max_time = frequency * max_particles,
		time_to_recreate = false;

	const particlesContainer = document.getElementById("welcome_page"),
		tela = document.createElement("canvas");
	// Setting container dimensions
	particlesContainer.style.width = `${document.documentElement.clientWidth}px`;
	particlesContainer.style.height = `${window.innerHeight}px`;
	tela.width = document.documentElement.clientWidth;
	tela.height = window.innerHeight;
	particlesContainer.style.width = `${tela.width}px`;
	particlesContainer.style.height = `${tela.height}px`;
	particlesContainer.insertBefore(tela, particlesContainer.firstChild);

		document
			.querySelector(".welcome_page_content")
			.style.setProperty("--max-home-width", `${tela.width}px`);
		document
			.querySelector(".welcome_page_content")
			.style.setProperty("--max-home-height", `${tela.height}px`);

	const blob_target = document.getElementById("target"),
		rect = blob_target.getBoundingClientRect();
	const rectan = tela.getBoundingClientRect();
	// Calculating coordinates
	let coorX = rect.x - rectan.left,
		coorY = rect.y - rectan.top;
	// Enabling repopulation after a delay
	setTimeout(function () {
		time_to_recreate = true;
	}, max_time);

	// Populating particles
	popolate(max_particles);
	const canvas = tela.getContext("2d");
	const mouse = { x: 0, y: 0 };

	// Updating mouse position when it moves over the canvas
	tela.addEventListener("mousemove", (e) => {
		const rectan = tela.getBoundingClientRect();
		mouse.x = e.clientX - rectan.left;
		mouse.y = e.clientY - rectan.top;
	});

	tela.addEventListener("mouseleave", () => {
		mouse.x = 0;
		mouse.y = 0;
	});

	class Particle {
		constructor(canvas) {
			const random = Math.random();
			this.progress = 0;
			this.canvas = canvas;
			this.center = {
				x: window.innerWidth / 2,
				y: window.innerHeight / 2,
			};

			this.point_of_attraction = {
				// x: coorX,
				// y: coorY,
				x: window.innerWidth / 2,
				y: window.innerHeight / 2,
			};

			if (Math.random() > 0.5) {
				this.x = window.innerWidth * Math.random();
				this.y =
					Math.random() > 0.5
						? -Math.random() - 100
						: window.innerHeight + Math.random() + 100;
			} else {
				this.x =
					Math.random() > 0.5
						? -Math.random() - 100
						: window.innerWidth + Math.random() + 100;
				this.y = window.innerHeight * Math.random();
			}

			this.s = Math.random() * 2;
			this.a = 0;
			this.w = window.innerWidth;
			this.h = window.innerHeight;
			this.radius = random > 0.2 ? Math.random() * 1 : Math.random() * 3;
			this.color = random > 0.2 ? "#e217d8" : "#9B0127";
			this.radius = random > 0.8 ? Math.random() * 2.2 : this.radius;
			this.color = random > 0.6 ? "#ece935" : this.color;
			this.color = random > 0.8 ? "#3CFBFF" : this.color;
		}

		calculateDistance(v1, v2) {
			let x = Math.abs(v1.x - v2.x);
			let y = Math.abs(v1.y - v2.y);
			return Math.sqrt(x * x + y * y);
		}

		render() {
			this.canvas.beginPath();
			this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.canvas.lineWidth = 2;
			this.canvas.fillStyle = this.color;
			this.canvas.fill();
			this.canvas.closePath();
		}

		move() {
			let p1 = {
				x: this.x,
				y: this.y,
			};

			let distance = this.calculateDistance(p1, this.point_of_attraction);
			let force = Math.max(100, 1 + distance);

			let attr_x = (this.point_of_attraction.x - this.x) / force;
			let attr_y = (this.point_of_attraction.y - this.y) / force;

			this.x += Math.cos(this.a) * this.s + attr_x;
			this.y += Math.sin(this.a) * this.s + attr_y;
			this.a +=
				Math.random() > 0.5
					? Math.random() * 0.9 - 0.45
					: Math.random() * 0.4 - 0.2;

			if (distance < 30 + Math.random() * 100) {
				return false;
			}

			this.render();
			this.progress++;
			return true;
		}
		repulse() {
			const distance = this.calculateDistance(this, mouse);
			if (distance < 150) {
				const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
				const repulseForce = 150 - distance;
				this.x -= Math.cos(angle) * repulseForce;
				this.y -= Math.sin(angle) * repulseForce;
			}
		}
	}

	function popolate(num) {
		// Checking the current number of particles is already greater than or equal to the limit
		if (particles.length >= max_particles) {
			return;
		}
		const remaining = max_particles - particles.length;
		for (var i = 0; i < Math.min(num, remaining); i++) {
			setTimeout(
				(function (x) {
					return function () {
						// Adding particles
						particles.push(new Particle(canvas));
					};
				})(i),
				frequency * i
			);
		}
		return particles.length;
	}

	function clear() {
		canvas.globalAlpha = 0.08;
		canvas.fillStyle = "#180341";
		canvas.fillRect(0, 0, tela.width, tela.height);
		canvas.globalAlpha = 1;
	}

	// Function to update particles in canvas
	function update() {
		particles = particles.filter(function (p) {
			return p.move();
		});
		// Recreating particles
		if (time_to_recreate) {
			if (particles.length < init_num) {
				popolate(1);
			}
		}
		particles.forEach((particle) => {
			if (mouse.x !== 0 && mouse.y !== 0) {
				particle.repulse();
			}
			particle.move();
		});
		clear();
		requestAnimationFrame(update.bind(this));
	}
	update();
});
