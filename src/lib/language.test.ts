import { describe, expect, it } from 'vitest';
import { getHomeCopy } from './language';

describe('getHomeCopy', () => {
	it('returns Bengali content by default', () => {
		const copy = getHomeCopy('bn');

		expect(copy.title).toBe('SvelteKit-এ স্বাগতম');
		expect(copy.description).toContain('যাত্রা');
		expect(copy.linkText).toBe('হরাইজনটাল স্লাইডস ডেমো');
	});

	it('returns English content when requested', () => {
		const copy = getHomeCopy('en');

		expect(copy.title).toBe('Welcome to SvelteKit');
		expect(copy.description).toContain('SvelteKit');
		expect(copy.linkText).toBe('Horizontal slides demo');
	});
});
