<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { ArrowRight, Sparkles } from '@lucide/svelte';
	import { t } from 'svelte-i18n';
</script>

<section class="home-hero" aria-labelledby="hero-title">
	<div class="hero-visual" aria-hidden="true">
		<Sparkles size={76} strokeWidth={1.3} />
	</div>

	<div class="hero-content">
		<p class="hero-kicker">{$t('home.kicker')}</p>
		<h1 id="hero-title">{$t('home.title')}</h1>
		<Button href="/story" class="hero-action">
			<span>{$t('home.action')}</span>
			<ArrowRight size={18} aria-hidden="true" />
		</Button>
	</div>
</section>
