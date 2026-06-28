import { addMessages, init } from 'svelte-i18n';

addMessages('bn', {
	language: {
		bangla: 'বাংলা',
		english: 'English',
		toggle: 'ভাষা বদলান'
	},
	nav: {
		brand: 'আব্রিকের পৃথিবী',
		brandHome: 'আব্রিকের পৃথিবীর প্রচ্ছদ',
		primary: 'প্রধান মেনু',
		open: 'মেনু খুলুন',
		close: 'মেনু বন্ধ করুন',
		home: 'প্রচ্ছদ',
		homeNote: 'Home',
		story: 'ওর গল্প',
		storyNote: 'Milestones',
		gallery: 'ছবি ও ভিডিও',
		galleryNote: 'Gallery',
		letters: 'চিঠিপত্র',
		lettersNote: 'Letters to Him',
		diary: 'ছোট্ট দিনপঞ্জি',
		diaryNote: 'Diary',
		moments: 'প্রিয় মুহূর্ত',
		momentsNote: 'Moments',
		blessings: 'আশীর্বাদ',
		blessingsNote: 'Blessings',
		contact: 'যোগাযোগ',
		contactNote: 'Contact',
		about: 'আব্রিকের সম্পর্কে',
		aboutNote: 'About Abrik'
	},
	home: {
		kicker: "Abrik's World",
		title: 'আমি আসছি খুব তাড়াতাড়ি',
		action: 'গল্প শুরু'
	}
});

addMessages('en', {
	language: {
		bangla: 'Bangla',
		english: 'English',
		toggle: 'Change language'
	},
	nav: {
		brand: "Abrik's World",
		brandHome: "Abrik's World home",
		primary: 'Primary menu',
		open: 'Open navigation menu',
		close: 'Close navigation menu',
		home: 'Home',
		homeNote: 'Latest posts and photos',
		story: 'His Story',
		storyNote: 'Milestones',
		gallery: 'Photos & Videos',
		galleryNote: 'Gallery',
		letters: 'Letters to Him',
		lettersNote: 'Blessings and notes',
		diary: 'Little Diary',
		diaryNote: 'Diary',
		moments: 'Favorite Moments',
		momentsNote: 'Moments',
		blessings: 'Blessings',
		blessingsNote: 'Blessings',
		contact: 'Contact',
		contactNote: 'Contact',
		about: 'About',
		aboutNote: 'About Abrik'
	},
	home: {
		kicker: "Abrik's World",
		title: 'I am coming very soon',
		action: 'Start the story'
	}
});

init({
	fallbackLocale: 'bn',
	initialLocale: 'bn'
});
