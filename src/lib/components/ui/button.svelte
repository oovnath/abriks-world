<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'ghost' | 'outline';
	type Size = 'default' | 'icon';

	let {
		children,
		class: className = '',
		variant = 'default',
		size = 'default',
		type = 'button',
		href,
		...rest
	}: {
		children?: Snippet;
		class?: string;
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		[key: string]: unknown;
	} = $props();

	const baseClass =
		'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

	const variantClasses: Record<Variant, string> = {
		default: 'bg-zinc-950 text-white shadow hover:bg-zinc-800 focus-visible:ring-zinc-950',
		ghost: 'text-zinc-950 hover:bg-zinc-100 focus-visible:ring-zinc-400',
		outline:
			'border border-zinc-200 bg-white text-zinc-950 shadow-sm hover:bg-zinc-100 focus-visible:ring-zinc-400'
	};

	const sizeClasses: Record<Size, string> = {
		default: 'h-10 px-4 py-2',
		icon: 'h-12 w-12'
	};

	const buttonClass = $derived(
		`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()
	);
</script>

{#if href}
	<a class={buttonClass} {href} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button class={buttonClass} {type} {...rest}>
		{@render children?.()}
	</button>
{/if}
