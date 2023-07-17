import {defineConfig} from 'vite';
// import {viteSingleFile} from 'vite-plugin-singlefile';
// import {minify as minifyHtml} from 'html-minifier-terser';
// import minifyLiterals from 'rollup-plugin-minify-template-literals';

const DEV_MODE = process.env.NODE_ENV == 'development';

const plugins = [];
if (!DEV_MODE) {
	try {
		plugins.push(minifyLiterals());
	} catch (e) {}
	try {
		// plugins.push(
		// 	viteSingleFile({
		// 		useRecommendedBuildConfig: false,
		// 	})
		// );
	} catch (e) {}
	plugins.push({
		name: 'minify final index',
		apply: 'build',
		transform(src, id) {
			if (/index.html$/.test(id)) {
				try {
					return {
						code: minifyHtml(src, {
							collapseWhitespace: true,
							minifyCSS: true,
							minifyJS: true,
							removeComments: true,
						}),
						map: null,
					};
				} catch (e) {}
			}
		},
	});
}

export default defineConfig({
	base: './',
	build: {
		// outDir: 'dist',
		assetsInlineLimit: 6000,
		// emptyOutDir: false,
		minify: 'terser',
		terserOptions: {
			format: {
				comments: false,
			},
		},
	},
	//   server: {
	//     hmr: false,
	//   },
	plugins: [
		...plugins,
		// terser(),
		// basicSSL(),
		// VitePWA({
		//   registerType: 'autoUpdate',
		//   injectRegister: 'inline',
		//   manifest: {
		//     name: 'name',
		//     short_name: 'short name',
		//     theme_color: '#ffffff',
		//     // background_color: '#000000',
		//     icons: [
		//       {
		//         src: './android-chrome-192x192.png',
		//         sizes: '192x192',
		//         type: 'image/png',
		//       },
		//       {
		//         src: './android-chrome-512x512.png',
		//         sizes: '512x512',
		//         type: 'image/png',
		//       },
		//     ],
		//   },
		// }),
	],
});
