<script lang="ts">
  import { onMount } from 'svelte';

  let container: HTMLElement | null = null;
  let activeIndex = 0;
  let isAnimating = false;

  const sections = [
    {
      title: 'Launch your horizontal story',
      label: '01 / Welcome',
      description:
        'A smooth, snap-driven scrolling experience designed for modern presentations and landing pages.',
      cta: 'Start scrolling',
    },
    {
      title: 'Beautiful feature cards',
      label: '02 / Features',
      description:
        'Showcase your core strengths with strong typography, full-screen panels, and polished side-scrolling interactions.',
      cta: 'See the details',
    },
    {
      title: 'Visual section transitions',
      label: '03 / Design',
      description:
        'Use color, layout, and motion to move users through your story without vertical navigation fatigue.',
      cta: 'View design',
    },
    {
      title: 'Ready for your next launch',
      label: '04 / ',
      description:
        'End the experience with a clear call-to-action and a fast route to conversion or discovery.',
      cta: 'Reach out',
    },
  ];

  function goToSlide(index: number, animate = true) {
    if (!container) return;
    const safeIndex = ((index % sections.length) + sections.length) % sections.length;
    const width = container.clientWidth;

    if (animate) {
      container.scrollTo({ left: safeIndex * width, behavior: 'smooth' });
    } else {
      container.scrollLeft = safeIndex * width;
    }

    activeIndex = safeIndex;
  }

  function prev() {
    goToSlide(activeIndex - 1);
  }

  function next() {
    goToSlide(activeIndex + 1);
  }

  function handleScroll() {
    if (!container || isAnimating) return;
    const nextIndex = Math.min(
      Math.max(Math.round(container.scrollLeft / container.clientWidth), 0),
      sections.length - 1,
    );
    activeIndex = nextIndex;
  }

  function handleWheel(event: WheelEvent) {
    if (!container) return;
    event.preventDefault();

    if (isAnimating) return;

    isAnimating = true;
    const direction = event.deltaY > 0 ? 1 : -1;
    goToSlide(activeIndex + direction);

    window.setTimeout(() => {
      isAnimating = false;
    }, 700);
  }

  onMount(() => {
    handleScroll();
  });
</script>

<div class="slides-page">
  <header class="slides-header">
    <div>
      <p class="eyebrow">Horizontal scroll website</p>
      <h1>Use your mouse wheel to move through the infinite slides.</h1>
    </div>
    <div class="header-actions">
      <button type="button" class="nav-btn" on:click={prev} disabled={activeIndex === 0}>
        ← Prev
      </button>
      <button
        type="button"
        class="nav-btn primary"
        on:click={next}
        disabled={activeIndex === sections.length - 1}
      >
        Next →
      </button>
    </div>
  </header>

  <main bind:this={container} class="slides-container" on:scroll={handleScroll} on:wheel={handleWheel}>
    {#each sections as section, index}
      <section class="slide slide-{index + 1}">
        <div class="slide-content">
          <span class="slide-label">{section.label}</span>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <button type="button" class="slide-cta" on:click={() => goToSlide(index + 1)}>
            {section.cta}
          </button>
        </div>
      </section>
    {/each}
  </main>

  <nav class="slides-footer" aria-label="Slide navigation">
    <ul class="dots">
      {#each sections as _, index}
        <li>
          <button
            type="button"
            class:active={index === activeIndex}
            aria-label={`Jump to slide ${index + 1}`}
            on:click={() => goToSlide(index)}
          />
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  :global(body) {
    margin: 0;
    min-height: 100vh;
    background: #051426;
    color: #f8fcff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .slides-page {
    min-height: 100vh;
    overflow: hidden;
    position: relative;
  }

  .slides-header {
    position: fixed;
    inset: 1rem 1rem auto;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: calc(100% - 2rem);
    max-width: 1280px;
  }

  .slides-header h1 {
    margin: 0.25rem 0 0;
    font-size: clamp(2rem, 3vw, 3.25rem);
    line-height: 1.05;
  }

  .eyebrow {
    margin: 0;
    color: #8fb4ff;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .nav-btn {
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.06);
    color: #eef8ff;
    padding: 0.85rem 1.2rem;
    border-radius: 999px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }

  .nav-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .primary {
    background: linear-gradient(135deg, #5b8dff, #8b4bff);
    border-color: transparent;
  }

  .slides-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow-x: auto;
    overflow-y: hidden;
    touch-action: none;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }

  .slides-container::-webkit-scrollbar {
    display: none;
  }

  .slide {
    min-width: 100vw;
    height: 100vh;
    scroll-snap-align: start;
    display: grid;
    place-items: center;
    padding: 4rem;
    box-sizing: border-box;
    position: relative;
  }

  .slide-content {
    max-width: 620px;
    width: min(100%, 640px);
    background: rgba(4, 12, 28, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 2.5rem;
    border-radius: 32px;
    backdrop-filter: blur(14px);
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.22);
  }

  .slide-label {
    display: inline-flex;
    margin-bottom: 1rem;
    color: #94b2fe;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 0.82rem;
  }

  .slide h2 {
    margin: 0;
    font-size: clamp(2.5rem, 4vw, 4.25rem);
    line-height: 1.02;
  }

  .slide p {
    margin: 1.5rem 0 0;
    font-size: 1.05rem;
    line-height: 1.9;
    color: #d7e3ff;
  }

  .slide-cta {
    margin-top: 2rem;
    border: none;
    border-radius: 999px;
    padding: 0.95rem 1.6rem;
    background: linear-gradient(135deg, #7b8dff, #b676ff);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
  }

  .slide:nth-child(1) {
    background: radial-gradient(circle at 20% 20%, rgba(106, 178, 255, 0.22), transparent 28%),
      linear-gradient(135deg, #0b1225 24%, #10203c 100%);
  }

  .slide:nth-child(2) {
    background: radial-gradient(circle at 80% 15%, rgba(149, 203, 255, 0.18), transparent 24%),
      linear-gradient(135deg, #09151d 22%, #192942 100%);
  }

  .slide:nth-child(3) {
    background: radial-gradient(circle at 10% 80%, rgba(141, 116, 255, 0.18), transparent 22%),
      linear-gradient(135deg, #0a1423 20%, #1f2b45 100%);
  }

  .slide:nth-child(4) {
    background: radial-gradient(circle at 80% 80%, rgba(98, 255, 197, 0.16), transparent 24%),
      linear-gradient(135deg, #081317 20%, #15363b 100%);
  }

  .slides-footer {
    position: fixed;
    inset: auto 1rem 1rem;
    z-index: 20;
    width: calc(100% - 2rem);
    max-width: 1280px;
    display: flex;
    justify-content: flex-end;
  }

  .dots {
    display: flex;
    gap: 0.85rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .dots button {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: transparent;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  }

  .dots button:hover {
    transform: scale(1.1);
  }

  .dots button.active {
    background: #7b8dff;
    border-color: rgba(123, 141, 255, 0.85);
  }
</style>
