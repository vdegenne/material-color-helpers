import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

@customElement('color-picker')
export class ColorPicker extends LitElement {
	@property() value = '';

	@state() showColorPickerFocusRing = false;

	render() {
		return html`
			<div class="input-wrapper">
				<div class="overflow">
					<input
						type="color"
						id="colorEl"
						.value=${live(this.value)}
						@input=${this.handleInput}
						@blur=${() => {
							this.showColorPickerFocusRing = false;
						}}
					/>
				</div>
				<md-focus-ring
					for="colorEl"
					.visible=${this.showColorPickerFocusRing}
				></md-focus-ring>
			</div>
		`;
	}

	static styles = css`
		input {
			border: none;
			background: none;
			min-width: calc(var(--color-picker-size, 40px) + 30px);
			min-height: calc(var(--color-picker-size, 40px) + 30px);
		}

		.input-wrapper {
			box-sizing: border-box;
			width: var(--color-picker-size, 40px);
			height: var(--color-picker-size, 40px);
			border-radius: 9999px;
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
	`;

	private handleInput(event: InputEvent) {
		this.value = (event.target as HTMLInputElement).value;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'color-picker': ColorPicker;
	}
}
