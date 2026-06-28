<script lang="ts">
    import { onMount } from 'svelte';
    let target = 0;
    let current = 0;
    let app: HTMLElement;
    const SEGMENTS = 4;

    onMount(() => {
        const vw = () => app.offsetWidth;

        const panels = {
            p2: app.querySelector<HTMLElement>('#p2')!,
            p3: app.querySelector<HTMLElement>('#p3')!,
            p4: app.querySelector<HTMLElement>('#p4')!,
            p5: app.querySelector<HTMLElement>('#p5')!
        };
        const heroText = app.querySelector<HTMLElement>('#hero-text')!;

        function clamp(v: number, mn: number, mx: number) {
            return Math.max(mn, Math.min(mx, v));
        }
        function lerp(a: number, b: number, t: number) {
            return a + (b - a) * t;
        }

        function tick() {
            current += (target - current) * 0.1;
            const W = vw();
            const p = current / W;
            const prog = clamp(p, 0, 1); // শুধু phase 0→1 এর জন্য

            // Panels
            panels.p2.style.transform = `translateX(${clamp(W - p * W * 0.75, W * 0.25, W)}px)`;
            panels.p3.style.transform = `translateX(${clamp(W - (p - 1) * W * 2, -W * 0.75, W)}px)`;
            panels.p4.style.transform = `translateX(${clamp(W - (p - 2) * W, 0, W)}px)`;
            panels.p5.style.transform = `translateX(${clamp(W - (p - 3) * W, 0, W)}px)`;

            // Hero text animation
            // center(50%) → left 25% section এর center(12.5%) = 37.5% বাঁয়ে
            const tx       = lerp(0, -(W * 0.375), prog);
            const rotation = lerp(0, -90, prog);   // anti-clockwise
            const fontSize = lerp(105, 90, prog);   // 8xl(105px) → 6xl(60px)

            heroText.style.transform = `translateX(${tx}px) rotate(${rotation}deg)`;
            heroText.style.fontSize  = `${fontSize}px`;

            requestAnimationFrame(tick);
        }

        app.addEventListener(
            'wheel',
            (e) => {
                e.preventDefault();
                target = Math.max(0, Math.min(SEGMENTS * vw(), target + e.deltaY + e.deltaX));
            },
            { passive: false }
        );

        const W = vw();
        Object.values(panels).forEach((p) => {
            p.style.transform = `translateX(${W}px)`;
        });
        requestAnimationFrame(tick);
    });
</script>

<div id="app" bind:this={app}>
    <div class="panel bg-red-500" id="p1">
        <span id="hero-text" class="font-bold text-white" style="font-size:105px; transform-origin:center center; white-space:nowrap;">
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

    #hero-text { will-change: transform, font-size; }
</style>