import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-remote-hint',
  template: `
<div class="remote-hint background-primary-color light-color middle-xs row" *ngIf="hint">
  <span>{{ hint }}</span>
</div>
  `,
  styleUrls: ['./remote-hint.component.css']
})
export class RemoteHintComponent {
  hint: string;

  /**
  * The remote, which hint should be displayed
  * Generates the hint and binds it.
  */
  @Input()
  set remote(remote: any) {
    this.hint = this.generateHint(remote);
  }

  /**
   * Generates the hint, to add the given remote, to
   * your local lxc remotes.
   * @param remote The remote which hint should be generated
   */
  generateHint(remote: any): string {
    if (!remote) {
      return '';
    }
    let hint = `lxc remote add ${remote.name} ${remote.serverUrl} --accept-certificate`;
    if (!remote.readonly) {
      hint += ' --password=<ask>';
    }
    if (remote.public) {
      hint += ' --public';
    }
    return hint;
  }
}
