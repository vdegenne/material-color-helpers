import {applyThemeString} from './apply-theme-string.js';

export function applyTheme(
	doc: DocumentOrShadowRoot,
	theme: {[name: string]: string},
	ssName = 'material-theme'
) {
	let styleString = ':root,:host{';
	for (const [key, value] of Object.entries(theme)) {
		styleString += `--md-sys-color-${key}:${value};`;
	}
	styleString += '}';

	applyThemeString(doc, styleString, ssName);
}
