<script lang="ts">
	type CheckedChangeHandler = (checked: boolean) => void;

	let {
		checked = false,
		disabled = false,
		class: className = '',
		onCheckedChange,
		...rest
	}: {
		checked?: boolean;
		disabled?: boolean;
		class?: string;
		onCheckedChange?: CheckedChangeHandler;
		[key: string]: unknown;
	} = $props();

	const state = $derived(checked ? 'checked' : 'unchecked');

	function toggle() {
		if (disabled) return;
		onCheckedChange?.(!checked);
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	data-state={state}
	class={`switch-root ${className}`.trim()}
	{disabled}
	onclick={toggle}
	{...rest}
>
	<span class="switch-thumb" data-state={state}></span>
</button>
