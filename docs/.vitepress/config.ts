import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'EquiSight Dev Docs',
	description: 'Developer documentation for EquiSight',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Architecture', link: '/architecture/' }
		],

		sidebar: [
			{
				text: 'Architecture',
				items: [{ text: 'Overview', link: '/architecture/' }]
			}
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/mattcce/equisight' }]
	}
});
