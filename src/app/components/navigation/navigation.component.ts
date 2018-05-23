import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
<nav class="app-navigation background-primary-color">
  <div class="app-navigation-container row middle-xs col-xs-10 col-xs-offset-1">
    <app-lxd-logo></app-lxd-logo>
    <!-- Spacer -->
    <div class="col-xs"></div>
    <div class="nav-items row middle-xs end-xs light-color">
      <a routerLink="/images" class="nav-item">Images</a>
      <a href="https://github.com/Roche/lxdhub-web" class="nav-item">Github</a>
    </div>
  </div>
</nav>
  `,
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
