import {LitElement, html, css, nothing} from 'lit';
import {customElement, query, queryAll, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import '@material/web/all.js';
import {
	themeFromSourceColor,
	applyTheme,
	applyThemeString,
} from '@vdegenne/material-color-helpers';
import '@vdegenne/material-color-helpers/elements/color-mode-picker.js';
import '@vdegenne/material-color-helpers/elements/color-picker.js';
import './copy-code-button.js';
import {MdRadio, MdSlider, MdSwitch} from '@material/web/all.js';

const savedTheme = localStorage.getItem('material-theme');
if (savedTheme) {
	applyThemeString(document, savedTheme, 'material-theme');
}

export type Scheme =
	| 'tonal'
	| 'vibrant'
	| 'expressive'
	| 'content'
	| 'neutral'
	| 'monochrome'
	| 'fidelity'
	| 'dynamic';

@customElement('theme-generator')
export class ThemeGenerator extends LitElement {
	@state() sourceColor = '#000000';
	@state() primaryColor = '#000000';
	@state() secondaryColor = '#000000';
	@state() tertiaryColor = '#000000';
	@state() neutralColor = '#000000';
	@state() isDark = false;
	@state() showColorPickerFocusRing = false;
	@state() outCss = '';
	@state() contrast = 0;
	@state() scheme: Scheme = 'tonal';
	@query('color-picker') inputEl!: HTMLInputElement;
	@queryAll('input[type=color]') colorEls!: HTMLInputElement;
	@query('#dark-picker md-switch') darkSwitchEl!: MdSwitch;
	@query('#scheme-picker md-switch') schemeSwitchEl!: MdSwitch;
	@query('md-slider') sliderEl!: MdSlider;

	render() {
		let warning: any = nothing;
		if (window.top !== window) {
			warning = html`<div class="warning">
				Click
				<a href=${window.location.href} target="_blank">here</a>
				to open in a new window to make copy code buttons work.
			</div>`;
		}
		return html`
			<h1>Material Web Color Picker</h1>
			${warning}
			<div style="display:flex;align-items:center;padding:24px;">
				<color-mode-picker
					value="dark"
					@select=${(e) => {
						// console.log(e.target.value);
					}}
					icon-only
				>
				</color-mode-picker>
			</div>
			<div id="color-picker" class="card">
				<h2>Color</h2>
				${this.renderColorPickers()}
			</div>
			<div id="dark-picker" class="card">
				<h2>Dark Mode</h2>
				<label>
					<md-switch @change=${this.onDarkModeInput}></md-switch>
					Dark mode:&nbsp; <code>${this.isDark}</code>
				</label>
			</div>
			<div id="scheme-picker" class="card">
				<h2>Scheme</h2>
				${this.renderSchemePicker()}
				<div>selected scheme: <code>${this.scheme}</code></div>
			</div>
			<div id="contrast-picker" class="card">
				<h2>Contrast</h2>
				${this.renderContrastPicker()}
			</div>
			<div id="pallette" class="card">
				<h2>Pallette</h2>
				${this.renderPallette()}
			</div>
			<copy-code-button>
				<pre>${this.outCss}</pre>
			</copy-code-button>
		`;
	}

	renderColorPickers() {
		if (this.scheme === 'dynamic') {
			const configs = [
				{val: this.primaryColor, text: 'Primary'},
				{val: this.secondaryColor, text: 'Secondary'},
				{val: this.tertiaryColor, text: 'Tertiary'},
				{val: this.neutralColor, text: 'Neutral'},
			];
			return repeat(
				configs,
				({text}) => text,
				(config) =>
					this.renderColorPicker(
						this.onDynamicColorInput,
						config.val,
						config.text
					)
			);
		}
		return repeat(
			[this.scheme],
			(key) => key,
			() =>
				this.renderColorPicker(this.onColorInput, this.sourceColor, 'Source')
		);
	}

	renderColorPicker(listener: Function, colorVal: string, text: string) {
		return html` <label>
			<color-picker value=${colorVal} @input=${listener}></color-picker>
			<!-- <span class="input-wrapper">
				<div class="overflow">
					<input
						type="color"
						id="colorEl"
						value=${colorVal}
						@input=${listener}
						@blur=${() => {
				this.showColorPickerFocusRing = false;
			}}
					/>
				</div>
				<md-focus-ring
					for="colorEl"
					.visible=${this.showColorPickerFocusRing}
				></md-focus-ring>
			</span> -->
			${text} color:&nbsp; <code>${colorVal}</code>
		</label>`;
	}

	renderSchemePicker() {
		return html` <div id="radio-set" @input=${this.onSchemeSelection}>
			${this.renderSchemeRadio('Tonal', 'tonal')}
			${this.renderSchemeRadio('Vibrant', 'vibrant')}
			${this.renderSchemeRadio('Expressive', 'expressive')}
			${this.renderSchemeRadio('Content', 'content')}
			${this.renderSchemeRadio('Neutral', 'neutral')}
			${this.renderSchemeRadio('Monochrome', 'monochrome')}
			${this.renderSchemeRadio('Fidelity', 'fidelity')}
			${this.renderSchemeRadio('Dynamic', 'dynamic')}
		</div>`;
	}

	renderSchemeRadio(text: string, value: Scheme) {
		return html` <label>
			<md-radio value=${value} ?checked=${this.scheme === value}> </md-radio>
			${text}
		</label>`;
	}

	renderContrastPicker() {
		return html` <label>
			<md-slider min="-100" max="100" @input=${this.onContrastInput}>
			</md-slider>
			Contrast level:&nbsp;
			<code>${this.contrast}</code>
		</label>`;
	}

	renderPallette() {
		const palletteConfig = [
			{
				text: 'Primary',
				color: '--md-sys-color-primary',
				contrast: '--md-sys-color-on-primary',
			},
			{
				text: 'Primary Container',
				color: '--md-sys-color-primary-container',
				contrast: '--md-sys-color-on-primary-container',
			},
			{
				text: 'Secondary',
				color: '--md-sys-color-secondary',
				contrast: '--md-sys-color-on-secondary',
			},
			{
				text: 'Secondary Container',
				color: '--md-sys-color-secondary-container',
				contrast: '--md-sys-color-on-secondary-container',
			},
			{
				text: 'Tertiary',
				color: '--md-sys-color-tertiary',
				contrast: '--md-sys-color-on-tertiary',
			},
			{
				text: 'Tertiary Container',
				color: '--md-sys-color-tertiary-container',
				contrast: '--md-sys-color-on-tertiary-container',
			},
			{
				text: 'Error',
				color: '--md-sys-color-error',
				contrast: '--md-sys-color-on-error',
			},
			{
				text: 'Error Container',
				color: '--md-sys-color-error-container',
				contrast: '--md-sys-color-on-error-container',
			},
			{
				text: 'Background',
				color: '--md-sys-color-background',
				contrast: '--md-sys-color-on-background',
			},
			{
				text: 'Surface Dim',
				color: '--md-sys-color-surface-dim',
				contrast: '--md-sys-color-on-surface',
			},
			{
				text: 'Surface',
				color: '--md-sys-color-surface',
				contrast: '--md-sys-color-on-surface',
			},
			{
				text: 'Surface Bright',
				color: '--md-sys-color-surface-bright',
				contrast: '--md-sys-color-on-surface',
			},
			{
				text: 'Surface Variant',
				color: '--md-sys-color-surface-variant',
				contrast: '--md-sys-color-on-surface-variant',
			},
			{
				text: 'Surface Container Lowest',
				color: '--md-sys-color-surface-container-lowest',
				contrast: '--md-sys-color-on-surface-container',
			},
			{
				text: 'Surface Container Low',
				color: '--md-sys-color-surface-container-low',
				contrast: '--md-sys-color-on-surface-container',
			},
			{
				text: 'Surface Container',
				color: '--md-sys-color-surface-container',
				contrast: '--md-sys-color-on-surface-container',
			},
			{
				text: 'Surface Container High',
				color: '--md-sys-color-surface-container-high',
				contrast: '--md-sys-color-on-surface-container',
			},
			{
				text: 'Surface Container Highest',
				color: '--md-sys-color-surface-container-highest',
				contrast: '--md-sys-color-on-surface-container',
			},
			{
				text: 'Inverse Primary',
				color: '--md-sys-color-inverse-primary',
				contrast: '--md-sys-color-inverse-on-primary',
			},
			{
				text: 'Inverse Surface',
				color: '--md-sys-color-inverse-surface',
				contrast: '--md-sys-color-inverse-on-surface',
			},
		];

		return html`<div class="wrapper">
			${repeat(
				palletteConfig,
				({text}) => text,
				({text, color, contrast}) =>
					html` <div
						class="color"
						style="color:var(${contrast});background-color:var(${color})"
					>
						${text}
					</div>`
			)}
		</div>`;
	}

	onColorInput() {
		this.sourceColor = this.inputEl.value;
		this.updateOutCss();
	}

	onDynamicColorInput() {
		const colorEls = this.colorEls;
		this.primaryColor = colorEls[0].value;
		this.secondaryColor = colorEls[1].value;
		this.tertiaryColor = colorEls[2].value;
		this.neutralColor = colorEls[3].value;
		this.updateOutCss();
	}

	onDarkModeInput() {
		this.isDark = this.darkSwitchEl.selected;
		this.updateOutCss();
	}

	onSchemeSelection(e: InputEvent) {
		const value = (e.target as MdRadio).value as Scheme;
		this.scheme = value;
		this.updateOutCss();
	}

	onContrastInput() {
		this.contrast = (this.sliderEl.value as number) / 100;

		this.updateOutCss();
	}

	updateOutCss() {
		let outCss = {};
		if (this.scheme === 'dynamic') {
			outCss = themeFromSourceColor(
				{
					primary: this.primaryColor,
					secondary: this.secondaryColor,
					tertiary: this.tertiaryColor,
					neutral: this.neutralColor,
				},
				this.isDark,
				this.scheme,
				this.contrast
			);
		} else {
			outCss = themeFromSourceColor(
				this.sourceColor,
				this.isDark,
				this.scheme,
				this.contrast
			);
		}
		applyTheme(document, outCss);
		const output: any = {};
		for (const [name, value] of Object.entries(outCss)) {
			output[`--md-sys-color-${name}`] = value;
		}
		this.outCss = JSON.stringify(output, null, 2)
			.replaceAll('"', '')
			.replaceAll(',', ';');
	}

	static styles = css`
		.card,
		pre {
			background-color: var(--md-sys-color-surface-container);
			color: var(--md-sys-color-on-surface);
			margin: 16px;
			padding: 16px;
			border-radius: 24px;
		}

		#scheme-picker div {
			margin-block-start: 8px;
		}

		#color-picker label {
			margin-block-end: 8px;
		}

		#color-picker label:last-of-type {
			margin-block-end: 0px;
		}

		#radio-set {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
		}

		pre {
			background-color: var(--md-sys-color-inverse-surface);
			color: var(--md-sys-color-inverse-on-surface);
		}

		label {
			display: flex;
			align-items: center;
		}

		md-switch,
		.input-wrapper {
			margin-inline-end: 16px;
		}

		#scheme-picker md-switch {
			margin-inline: 16px;
		}

		input {
			border: none;
			background: none;
			min-width: 200%;
			min-height: 200%;
		}

		.input-wrapper {
			box-sizing: border-box;
			width: 48px;
			height: 48px;
			border-radius: 24px;
			box-sizing: border-box;
			border: 1px solid var(--md-sys-color-on-secondary-container);
			position: relative;
			--md-focus-ring-offset: 3px;
		}

		.overflow {
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: inherit;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		pre,
		code {
			font-family: 'Roboto Mono', monospace;
		}

		code {
			background-color: var(--md-sys-color-inverse-surface);
			color: var(--md-sys-color-inverse-on-surface);
			padding: 4px 8px;
			border-radius: 16px;
		}

		h2 {
			margin-block-start: 0;
		}

		h1 {
			text-align: center;
			color: var(--md-sys-color-on-background);
		}

		#pallette .wrapper {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
		}

		#pallette .color {
			width: 100px;
			height: 100px;
			margin: 8px;
			border-radius: 24px;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			border: 1px solid var(--md-sys-color-outline);
		}

		:host {
			--catalog-copy-code-button-inset: 8px 24px auto auto;
		}
		.warning {
			background-color: var(--md-sys-color-error-container);
			color: var(--md-sys-color-on-error-container);
			padding: 16px;
			margin: 16px;
			border-radius: 16px;
			border: 1px solid var(--md-sys-color-error);
		}
		.warning a {
			color: var(--md-sys-color-error);
		}
	`;
}
