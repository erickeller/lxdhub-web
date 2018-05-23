import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-clone-hint',
  template: `
<div class="image-clone-hint background-primary-color light-color middle-xs row" *ngIf="hint">
  <span>{{ hint }}</span>
</div>
  `,
  styleUrls: ['./image-clone-hint.component.css']
})
/**
 * The image clone hint shows a hint
 * how to clone the image locally
 */
export class ImageCloneHintComponent {
  hint: string;
  _sourceRemote: any;
  _destinationRemote: any;
  _image: any;

  @Input()
  /**
   * Sets the image
   */
  set image(value) {
    this._image = value;
    this.hint = this.generateHint(this._image, this._sourceRemote, this._destinationRemote);
  }

  @Input()
  /**
   * Sets the destination remote
   */
  set destinationRemote(value) {
    this._destinationRemote = value;
    this.hint = this.generateHint(this._image, this._sourceRemote, this._destinationRemote);
  }

  @Input()
  /**
   * Sets the source remote
   */
  set sourceRemote(value) {
    this._sourceRemote = value;
    this.hint = this.generateHint(this._image, this._sourceRemote, this._destinationRemote);
  }



  /**
   * Generates the hint, to add the given image, to
   * your local lxc .
   * @param remote The remote which hint should be generated
   */
  generateHint(image, _sourceRemote, _destinationRemote): string {
    if (!image || !_sourceRemote || !_destinationRemote) {
      return;
    }

    const hint =
      `lxc image copy ${_sourceRemote.name}:` +
      `${image.fingerprint.substring(0, 12)} ${_destinationRemote.name}: --copy-aliases`;
    return hint;
  }
}
