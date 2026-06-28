<script lang="ts">
    import { onMount } from 'svelte';

    let target = 0;
    let current = 0;
    let app: HTMLElement;
    const SEGMENTS = 4;

    onMount(() => {
        const vw = () => app.offsetWidth;
        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
        const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;

        const panels = {
            p2: app.querySelector<HTMLElement>('#p2')!,
            p3: app.querySelector<HTMLElement>('#p3')!,
            p4: app.querySelector<HTMLElement>('#p4')!,
            p5: app.querySelector<HTMLElement>('#p5')!
        };
        const heroText = app.querySelector<HTMLElement>('#hero-text')!;

        // font size — mobile ছোট, desktop বড়
        function getFontRange() {
            const W = vw();
            return {
                startPx: clamp(W * 0.10, 28, 96),
                endPx:   clamp(W * 0.075, 20, 60)
            };
        }

        function tick() {
            current += (target - current) * 0.1;
            const W    = vw();
            const p    = current / W;
            const prog = clamp(p, 0, 1);

            // Panels
            panels.p2.style.transform = `translateX(${clamp(W - p*W*0.75,    W*0.25, W)}px)`;
            panels.p3.style.transform = `translateX(${clamp(W - (p-1)*W*2, -W*0.75, W)}px)`;
            panels.p4.style.transform = `translateX(${clamp(W - (p-2)*W,        0,  W)}px)`;
            panels.p5.style.transform = `translateX(${clamp(W - (p-3)*W,        0,  W)}px)`;

            // Hero text
            const { startPx, endPx } = getFontRange();
            heroText.style.transform = `translateX(${lerp(0, -(W * 0.375), prog)}px) rotate(${lerp(0, -90, prog)}deg)`;
            heroText.style.fontSize  = `${lerp(startPx, endPx, prog)}px`;

            requestAnimationFrame(tick);
        }

        // Wheel — desktop
        app.addEventListener('wheel', (e) => {
            e.preventDefault();
            target = clamp(target + e.deltaY + e.deltaX, 0, SEGMENTS * vw());
        }, { passive: false });

        // Touch — mobile
        let touchStartX = 0, touchStartY = 0, lastTarget = 0;

        app.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            lastTarget  = target;
        }, { passive: true });

        app.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const dx = touchStartX - e.touches[0].clientX;
            const dy = touchStartY - e.touches[0].clientY;
            if (Math.abs(dx) > Math.abs(dy) * 0.5) {
                target = clamp(lastTarget + dx * 1.5, 0, SEGMENTS * vw());
            }
        }, { passive: false });

        // Keyboard — accessibility
        window.addEventListener('keydown', (e) => {
            const step = vw() * 0.3;
            if (e.key === 'ArrowRight') target = clamp(target + step, 0, SEGMENTS * vw());
            if (e.key === 'ArrowLeft')  target = clamp(target - step, 0, SEGMENTS * vw());
        });

        const W = vw();
        Object.values(panels).forEach((p) => {
            p.style.transform = `translateX(${W}px)`;
        });
        requestAnimationFrame(tick);
    });
</script>

<div id="app" bind:this={app}>
    <div class="panel bg-red-500" id="p1">
        <span id="hero-text" class="font-bold text-white"
              style="transform-origin:center center; white-space:nowrap; font-family:Georgia,serif;">
            Abrik's World
        </span>
    </div>
    <div class="panel bg-blue-500"   id="p2">Travel</div>
    <div class="panel bg-green-500"  id="p3">City</div>
    <div class="panel bg-yellow-500" id="p4">Memory</div>
    <div class="panel bg-purple-500" id="p5">CTA</div>
</div>

<style>
    #app {
        position: fixed;
        inset: 0;
        overflow: hidden;
        cursor: grab;
        touch-action: none; /* ← mobile scroll hijack এর জন্য জরুরি */
    }
    #app:active { cursor: grabbing; }

    .panel {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        will-change: transform;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #p1 { z-index: 1; }
    #p2 { z-index: 2; }
    #p3 { z-index: 3; }
    #p4 { z-index: 4; }
    #p5 { z-index: 5; }
</style>