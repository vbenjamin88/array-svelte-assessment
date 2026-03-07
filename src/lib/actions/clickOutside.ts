import type { Action } from 'svelte/action';

/** Svelte action: calls callback when user clicks outside the node */
export const clickOutside: Action<HTMLElement, (e: MouseEvent) => void> = (node, onOutsideClick) => {
	function handleClick(e: MouseEvent) {
		if (node && !node.contains(e.target as Node)) {
			onOutsideClick(e);
		}
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
