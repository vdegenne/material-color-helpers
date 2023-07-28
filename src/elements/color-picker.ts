import {LitElement, html, css} from 'lit';
import {live} from 'lit/directives/live.js';
import {customElement, property, state} from 'lit/decorators.js';
// import {redispatchEvent} from '../utils.js';
import '@material/web/focus/md-focus-ring.js';

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
  `;

  private handleInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
    // redispatchEvent(this, event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-picker': ColorPicker;
  }
}
