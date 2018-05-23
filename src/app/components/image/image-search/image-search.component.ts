import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-search',
  template: `
<div class="row image-search">
  <input
    class="search-field col-xs" type="search"
    placeholder="Search architecture, distribution, release..."
    (ngModelChange)="this.valueChange.emit($event)"
    [ngModel]="inputValue"
    [ngClass]="{'invalid': invalid}">
  <div class="warning row center-xs middle-xs">
    <mat-icon *ngIf="invalid">warning</mat-icon>
  </div>
</div>
  `,
  styleUrls: ['./image-search.component.css']
})
export class ImageSearchComponent {
  inputValue = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() invalid: boolean;
}
