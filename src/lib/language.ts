export type Language = 'bn' | 'en';

export type HomeCopy = {
	title: string;
	description: string;
	linkText: string;
	buttonLabel: string;
};

const homeCopy: Record<Language, HomeCopy> = {
	bn: {
		title: 'SvelteKit-এ স্বাগতম',
		description: 'আপনার যাত্রা শুরু করুন।',
		linkText: 'হরাইজনটাল স্লাইডস ডেমো',
		buttonLabel: 'English'
	},
	en: {
		title: 'Welcome to SvelteKit',
		description: 'Start your journey with SvelteKit.',
		linkText: 'Horizontal slides demo',
		buttonLabel: 'বাংলা'
	}
};

export function getHomeCopy(language: Language = 'bn'): HomeCopy {
	return homeCopy[language];
}
