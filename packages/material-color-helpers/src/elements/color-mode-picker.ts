import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
// import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
// import '@material/web/icon/icon.js';
import type {MdOutlinedSegmentedButton} from '@material/web/labs/segmentedbutton/outlined-segmented-button.js';

export type ColorMode = 'light' | 'system' | 'dark';

@customElement('color-mode-picker')
export class ColorModePicker extends LitElement {
  @property() value: ColorMode = 'system';

  @property({type: Boolean, attribute: 'icon-only', reflect: true}) iconOnly =
    false;

  static styles = css`
    :host([icon-only]) {
      min-width: 205px;
    }
  `;

  render() {
    return html`
      <md-outlined-segmented-button-set
        @segmented-button-set-selection=${this.onColorModeSelection}
      >
        <md-outlined-segmented-button
          data-value="dark"
          title="dark"
          ?selected=${this.value === 'dark'}
          label="${this.iconOnly ? '' : 'dark'}"
        >
          <md-icon slot="icon">dark_mode</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button
          data-value="system"
          title="system"
          ?selected=${this.value === 'system'}
          label="${this.iconOnly ? '' : 'system'}"
        >
          <md-icon slot="icon">brightness_medium</md-icon>
        </md-outlined-segmented-button>

        <md-outlined-segmented-button
          data-value="light"
          title="light"
          ?selected=${this.value === 'light'}
          label="${this.iconOnly ? '' : 'light'}"
        >
          <md-icon slot="icon">light_mode</md-icon>
        </md-outlined-segmented-button>
      </md-outlined-segmented-button-set>
    `;
  }

  private onColorModeSelection(
    e: CustomEvent<{
      button: MdOutlinedSegmentedButton;
      selected: boolean;
      index: number;
    }>
  ) {
    const {button} = e.detail;
    const value = button.dataset.value as ColorMode;
    this.value = value;
    this.dispatchEvent(new Event('select'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-mode-picker': ColorModePicker;
  }
}
