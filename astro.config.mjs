// @ts-check
import { defineConfig,passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

if (isDev) {
  console.log('当前是开发环境');
} else if (isProd) {
  console.log('当前是生产环境');
} else {
  console.log('当前是其他环境');
}

let devConfig = {image: {
        service: passthroughImageService()
}}
if(isProd){
    devConfig = {}
}
// https://astro.build/config
export default defineConfig({
  ...devConfig,
	server: {
		host: '0.0.0.0',
		port: 3000,
	},
	integrations: [
		starlight({
			title: 'My Docs',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        }
      },
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: '指南',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: '参考',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
