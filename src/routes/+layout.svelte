<script lang="ts">
	import './layout.css';
	import '$lib/i18n';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button.svelte';
	import Switch from '$lib/components/ui/switch.svelte';
	import { Menu, X } from '@lucide/svelte';
	import { locale, t } from 'svelte-i18n';

	let { children } = $props();

	let menuOpen = $state(false);
	const isEnglish = $derived($locale === 'en');

	const menuItems = [
		{ label: 'nav.home', note: 'nav.homeNote', href: '/' },
		{ label: 'nav.story', note: 'nav.storyNote', href: '/story' },
		{ label: 'nav.gallery', note: 'nav.galleryNote', href: '/gallery' },
		{ label: 'nav.letters', note: 'nav.lettersNote', href: '/letters' },
		{ label: 'nav.diary', note: 'nav.diaryNote', href: '/diary' },
		{ label: 'nav.moments', note: 'nav.momentsNote', href: '/moments' },
		{ label: 'nav.blessings', note: 'nav.blessingsNote', href: '/blessings' },
		{ label: 'nav.about', note: 'nav.aboutNote', href: '/about' }
	];

	function setLanguage(checked: boolean) {
		locale.set(checked ? 'en' : 'bn');
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="site-header">
	<a class="site-title" href="/" aria-label={$t('nav.brandHome')}>{$t('nav.brand')}</a>

	<div class="floating-menu">
		<div class="menu-actions">
			<div class="language-switch">
				<span>{$t('language.bangla')}</span>
				<Switch
					checked={isEnglish}
					aria-label={$t('language.toggle')}
					onCheckedChange={setLanguage}
				/>
				<span>{$t('language.english')}</span>
			</div>

			<Button
				class="menu-toggle"
				size="icon"
				variant="outline"
				aria-label={menuOpen ? $t('nav.close') : $t('nav.open')}
				aria-expanded={menuOpen}
				aria-controls="primary-menu"
				onclick={() => {
					menuOpen = !menuOpen;
				}}
			>
				{#if menuOpen}
					<X size={22} aria-hidden="true" />
				{:else}
					<Menu size={22} aria-hidden="true" />
				{/if}
			</Button>
		</div>

		{#if menuOpen}
			<nav id="primary-menu" class="menu-panel" aria-label={$t('nav.primary')}>
				{#each menuItems as item }
					<a
						href={item.href}
						onclick={() => {
							menuOpen = false;
						}}
					>
						<span>{$t(item.label)}</span>
						<small>{$t(item.note)}</small>
					</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>

<main class="site-main">
	{@render children()}
</main>
