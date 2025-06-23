import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'EquiSight Dev Docs',
	description: 'Developer documentation for EquiSight',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Architecture', link: '/architecture' },
			{ text: 'Frontend', link: '/frontend/' },
			{ text: 'Backend', link: '/backend/' }
		],

		sidebar: [
			{
				text: 'Project',
				items: [
					{ text: 'Introduction', link: '/project-introduction' },
					{ text: 'Architecture', link: '/architecture' },
					{ text: 'Features', link: '/features' }
				]
			},
			{
				text: 'Frontend',
				items: [{ text: 'Overview', link: '/frontend/' }]
			},
			{
				text: 'Backend',
				items: [{ text: 'API', link: '/backend/' }]
			}
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/mattcce/equisight' }]
	}
});
