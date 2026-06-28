<script lang="ts">
	import { onMount } from 'svelte';

	let targetD = 0;   // desktop horizontal target
	let currentD = 0;
	let targetM = 0;   // mobile vertical target
	let currentM = 0;
	let app: HTMLElement;
	const SEGMENTS = 4;

	onMount(() => {
		const vw = () => app.offsetWidth;
		const vh = () => window.innerHeight;
		const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const panels = {
			p2: app.querySelector<HTMLElement>('#p2')!,
			p3: app.querySelector<HTMLElement>('#p3')!,
			p4: app.querySelector<HTMLElement>('#p4')!,
			p5: app.querySelector<HTMLElement>('#p5')!
		};
		const heroText = app.querySelector<HTMLElement>('#hero-text')!;

		let isMobile = window.innerWidth < 768;

		function resetDesktopStyles() {
			Object.values(panels).forEach((p) => (p.style.transform = ''));
			heroText.style.transform = '';
			heroText.style.fontSize = '';
		}

		function resetMobileStyles() {
			Object.values(panels).forEach((p) => (p.style.transform = ''));
		}

		function checkMobile() {
			const wasMobile = isMobile;
			isMobile = window.innerWidth < 768;
			if (!isMobile && wasMobile) resetMobileStyles();
			if (isMobile && !wasMobile) resetDesktopStyles();
		}

		window.addEventListener('resize', checkMobile);

		function getFontRange() {
			const W = vw();
			return {
				startPx: clamp(W * 0.1, 28, 96),
				endPx: clamp(W * 0.075, 20, 60)
			};
		}

		function tickDesktop() {
			currentD += (targetD - currentD) * 0.1;
			const W = vw();
			const p = currentD / W;
			const prog = clamp(p, 0, 1);

			panels.p2.style.transform = `translateX(${clamp(W - p * W * 0.75, W * 0.25, W)}px)`;
			panels.p3.style.transform = `translateX(${clamp(W - (p - 1) * W * 2, -W * 0.75, W)}px)`;
			panels.p4.style.transform = `translateX(${clamp(W - (p - 2) * W, 0, W)}px)`;
			panels.p5.style.transform = `translateX(${clamp(W - (p - 3) * W, 0, W)}px)`;

			const { startPx, endPx } = getFontRange();
			heroText.style.transform = `translateX(${lerp(0, -(W * 0.375), prog)}px) rotate(${lerp(0, -90, prog)}deg)`;
			heroText.style.fontSize = `${lerp(startPx, endPx, prog)}px`;
		}

		// Mobile: vertical, same philosophy as desktop but Y axis
		// p = scroll progress in "screen units"
		// p2: নিচ থেকে উঠে, 75vh এ আটকায় (translateY: vh → vh*0.75 তে স্থির)
		//     desktop এ p2 আটকায় W*0.25 তে, তাই mobile এ vh*0.25 (top থেকে 25%)
		// p3: p2 এর নিচ থেকে উঠে, p2 কে push করে উপরে বেরিয়ে যায়
		// p4: নিচ থেকে উঠে top (0) এ আটকায়
		// p5: নিচ থেকে উঠে p4 এর উপর দিয়ে top এ আটকায়
		function tickMobile() {
			currentM += (targetM - currentM) * 0.1;
			const H = vh();
			const p = currentM / H;
			const prog = clamp(p, 0, 1);

			// Hero text: center (0) থেকে p2 এর ঠিক উপরে উঠে আটকে যাবে
			// p2 আটকায় H*0.25 এ, text এর height ~60px ধরে তার উপরে রাখি
			const textH = heroText.offsetHeight || 60;
			// শুরুতে translateY(0) = center এ, শেষে translateY(-(H*0.25 + textH/2)) = p2 এর উপরে
			// panel center থেকে target position: -(H/2 - H*0.25 - textH/2) = -(H*0.25 - textH/2)
			const mobileTextTarget = -(H * 0.35 - textH / 2);
			heroText.style.transform = `translateY(${lerp(0, mobileTextTarget, prog)}px)`;

			// p2: 0→H তে শুরু, 1 unit scroll এ H*0.25 এ আটকায় (25% from top = 75% height থেকে শুরু)
			panels.p2.style.transform = `translateY(${clamp(H - p * H * 0.75, H * 0.25, H)}px)`;

			// p3: p2 এর পিছনে (H তে), তারপর উঠে -H*0.75 পর্যন্ত যায় (মানে পুরো উপরে বেরিয়ে যায়)
			panels.p3.style.transform = `translateY(${clamp(H - (p - 1) * H * 2, -H * 0.75, H)}px)`;

			// p4: নিচ থেকে উঠে 0 (top) এ আটকায়
			panels.p4.style.transform = `translateY(${clamp(H - (p - 2) * H, 0, H)}px)`;

			// p5: নিচ থেকে উঠে 0 (top) এ আটকায়, p4 এর উপর দিয়ে
			panels.p5.style.transform = `translateY(${clamp(H - (p - 3) * H, 0, H)}px)`;
		}

		function tick() {
			if (isMobile) {
				tickMobile();
			} else {
				tickDesktop();
			}
			requestAnimationFrame(tick);
		}

		// Desktop wheel
		app.addEventListener(
			'wheel',
			(e) => {
				if (isMobile) return;
				e.preventDefault();
				targetD = clamp(targetD + e.deltaY + e.deltaX, 0, SEGMENTS * vw());
			},
			{ passive: false }
		);

		// Mobile wheel — vertical scroll event intercept করি
		// window এ listen করি কারণ app position:fixed mobile এ নেই
		const handleMobileWheel = (e: WheelEvent) => {
			if (!isMobile) return;
			e.preventDefault();
			targetM = clamp(targetM + e.deltaY, 0, SEGMENTS * vh());
		};
		window.addEventListener('wheel', handleMobileWheel, { passive: false });

		// Mobile touch — vertical swipe
		let touchStartX = 0,
			touchStartY = 0,
			lastTargetM = 0,
			lastTargetD = 0,
			isHorizontalSwipe = false,
			swipeDirectionLocked = false;

		app.addEventListener(
			'touchstart',
			(e) => {
				touchStartX = e.touches[0].clientX;
				touchStartY = e.touches[0].clientY;
				lastTargetM = targetM;
				lastTargetD = targetD;
				isHorizontalSwipe = false;
				swipeDirectionLocked = false;
			},
			{ passive: true }
		);

		app.addEventListener(
			'touchmove',
			(e) => {
				const dx = touchStartX - e.touches[0].clientX;
				const dy = touchStartY - e.touches[0].clientY;

				if (!swipeDirectionLocked && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
					isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
					swipeDirectionLocked = true;
				}
				if (!swipeDirectionLocked) return;

				if (isMobile && !isHorizontalSwipe) {
					e.preventDefault();
					targetM = clamp(lastTargetM + dy * 1.5, 0, SEGMENTS * vh());
				} else if (!isMobile && isHorizontalSwipe) {
					e.preventDefault();
					targetD = clamp(lastTargetD + dx * 1.5, 0, SEGMENTS * vw());
				}
			},
			{ passive: false }
		);

		// Keyboard
		const handleKeydown = (e: KeyboardEvent) => {
			if (isMobile) {
				const step = vh() * 0.3;
				if (e.key === 'ArrowDown') targetM = clamp(targetM + step, 0, SEGMENTS * vh());
				if (e.key === 'ArrowUp') targetM = clamp(targetM - step, 0, SEGMENTS * vh());
			} else {
				const step = vw() * 0.3;
				if (e.key === 'ArrowRight') targetD = clamp(targetD + step, 0, SEGMENTS * vw());
				if (e.key === 'ArrowLeft') targetD = clamp(targetD - step, 0, SEGMENTS * vw());
			}
		};
		window.addEventListener('keydown', handleKeydown);

		// Initial state — panel গুলো offscreen এ রাখি
		if (isMobile) {
			const H = vh();
			Object.values(panels).forEach((p) => {
				p.style.transform = `translateY(${H}px)`;
			});
		} else {
			const W = vw();
			Object.values(panels).forEach((p) => {
				p.style.transform = `translateX(${W}px)`;
			});
		}

		requestAnimationFrame(tick);

		return () => {
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('wheel', handleMobileWheel);
		};
	});
</script>

<div id="app" bind:this={app}>
	<div class="panel bg-red-500" id="p1">
		<span
			id="hero-text"
			class="font-bold text-white"
			style="transform-origin:center center; white-space:nowrap; font-family:Georgia,serif;"
		>
			Abrik's World
		</span>
	</div>
	<div class="panel bg-blue-500" id="p2">Travel</div>
	<div class="panel bg-green-500" id="p3">City</div>
	<div class="panel bg-yellow-500" id="p4">Memory</div>
	<div class="panel bg-purple-500" id="p5">CTA</div>
</div>

<style>
	#app {
		position: fixed;
		inset: 0;
		overflow: hidden;
		cursor: grab;
		touch-action: none;
	}
	#app:active {
		cursor: grabbing;
	}

	.panel {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		will-change: transform;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: clamp(2rem, 8vw, 4.5rem);
		font-weight: 800;
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}

	#p1 { z-index: 1; }
	#p2 { z-index: 2; }
	#p3 { z-index: 3; }
	#p4 { z-index: 4; color: #1c1714; text-shadow: none; }
	#p5 { z-index: 5; }

	/* Mobile — layout same, animation JS দিয়ে চলে */
	@media (max-width: 767px) {
		#app {
			touch-action: none; /* JS touch handle করছে */
			cursor: default;
		}
		#app:active {
			cursor: default;
		}
	}
</style>