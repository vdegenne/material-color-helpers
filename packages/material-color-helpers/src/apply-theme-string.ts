/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

type WithStyleSheet = typeof globalThis & {
	[stylesheetName: string]: CSSStyleSheet | undefined;
};

/**
 * Applies a stringified CSS theme to a document or shadowroot by creating or
 * reusing a constructable stylesheet. It also saves the themeString to
 * localstorage.
 *
 * NOTE: This function is inlined into the head of the document for performance
 * reasons as well as used by material-color-helpers which is lazily loaded. So
 * do not overload this file with slow logic since it will block render.
 *
 * @param doc Document or ShadowRoot to apply theme.
 * @param themeString Stringified CSS of a material theme to apply to the given
 *     document or shadowroot.
 * @param ssName Optional global identifier of the constructable stylesheet and
 *     used to generate the localstorage name.
 */
export function applyThemeString(
	doc: DocumentOrShadowRoot,
	themeString: string,
	ssName?: string
) {
	let sheet: CSSStyleSheet | undefined;
	if (ssName) {
		// Get constructable stylesheet
		sheet = (globalThis as WithStyleSheet)[ssName];
	}
	// Create a new sheet if it doesn't exist already and save it globally.
	if (!sheet) {
		sheet = new CSSStyleSheet();
		doc.adoptedStyleSheets.push(sheet);
		if (ssName) {
			(globalThis as WithStyleSheet)[ssName] = sheet;
		}
	}

	sheet.replaceSync(themeString);

	// Material agnostic
	if (ssName === 'material-theme') {
		// Set the color of the URL bar because we are cool like that.
		const surfaceContainer = themeString.match(
			/--md-sys-color-surface-container:(.+?);/
		)?.[1];
		if (surfaceContainer) {
			let meta = document.querySelector('meta[name="theme-color"]');
			if (!meta) {
				meta = document.createElement('meta');
				meta.setAttribute('name', 'theme-color');
				document.head.appendChild(meta);
			}
			// Weird trick because sometimes the value of themeColor in the manifest is applied after this
			// We make sure this is always the visible theme by deferring it.
			setTimeout(() => {
				meta!.setAttribute('content', surfaceContainer);
			}, 500);
		}
		// Save the style in local storage so it can be retrieved
		// early when the page reloads.
		localStorage.setItem(ssName, themeString);
	}
}
