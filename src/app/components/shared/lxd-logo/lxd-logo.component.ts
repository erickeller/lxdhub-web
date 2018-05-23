import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lxd-logo',
  template: `
<a routerLink="/">
  <div class="logo row middle-xs">
    <div class="logo-text row middle-xs">
      <div class="accent-color">LXD</div>
      <div class="light-color">Hub</div>
    </div>
  </div>
</a>
  `,
  styleUrls: ['./lxd-logo.component.css']
})
export class LxdLogoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
