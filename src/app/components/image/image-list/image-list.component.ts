import { Component } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ImageListItemDto, ImageListOptions, PaginationResponseDto, RemoteDto } from '@lxdhub/common';

import { ImageService } from '../image.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-image-list',
  template: `
<section class="layout-padding
  col-lg-8
  col-lg-offset-2
  col-md-10
  col-md-offset-1
  col-sm-10
  col-sm-offset-1
  col-xs-12
  col-xs-offset-0">
  <div class="center-xs middle-xs column layout-padding layout-margin" *ngIf="error">
    <span class="layout-margin">
    {{ error }}
    </span>
  </div>
  <div class="row" [ngClass]="{ 'search-bar': !!imageResponse }">
    <div class="col-xs-12 col-md-2">
      <app-remote-select (selected)="onRemoteChange($event)"></app-remote-select>
    </div>
    <div class="col-xs-12 col-md-10">
      <app-image-search  *ngIf="imageResponse" [invalid]="invalidSearchQuery" (valueChange)="onQueryChange($event)"></app-image-search>
    </div>
  </div>
  <app-remote-hint [remote]="remote"></app-remote-hint>
  <table class="image-list" *ngIf="imageResponse">
    <thead>
      <tr>
        <th class="image-column">Image</th>
        <th>Fingerprint</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let image of imageResponse.results" [routerLink]="['/image', image.id]">
        <td class="image-column">{{ image.description }}</td>
        <td>{{ image.fingerprint | slice:0:12 }}</td>
        <td>{{ image.uploadedAt }}</td>
      </tr>
    </tbody>
  </table>
  <mat-paginator *ngIf="imageResponse"
  (page)="onPaginationChange($event)"
  [length]="imageResponse.total"
  [pageSize]="limit"
  [pageSizeOptions]="[5, 10, 25, 100]">
</mat-paginator>
</section>
  `,
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent {

  /**
   * Initializes the ImageList Component
   * @param imageService The service to fetch images from the API interface
   * @param loger The logger
   */
  constructor(
    private imageService: ImageService) { }
  imageResponse: PaginationResponseDto<ImageListItemDto[]>;
  error: string;
  remote: RemoteDto;
  limit = 25;
  offset = 0;
  query = '';
  invalidSearchQuery = false;

  /**
   * Gets called when a remote changes.
   * Binds the remote to the controller, resets the bound
   * `offset` to 0 and reloads loads the page
   * @param remote The remote, which got changed
   */
  onRemoteChange(remote: RemoteDto) {
    this.remote = remote;
    this.offset = 0;
    this.loadPage();
  }
  /**
   * Gets called when the pagination options change.
   * Sets the pagination options, depending on the given mat-paginatior event.
   * Then reloads the images.
   * @param event The material paginator event
   */
  onPaginationChange(event: PageEvent) {
    this.offset = event.pageSize * event.pageIndex;
    this.limit = event.pageSize;
    this.loadPage();
  }

  /**
   * Gets called when the search query changes.
   * Reloadds the images
   * @param query The query string
   */
  onQueryChange(query: string) {
    this.query = query;
    this.offset = 0;
    this.loadPage();
  }


  /**
   * Loads the page with the bound
   * options
   */
  loadPage() {
    console.log(this.remote);
    return this.loadImages({
      limit: this.limit,
      offset: this.offset,
      remoteId: this.remote.id,
      query: this.query
    });
  }

  /**
   * Loads images with the given pagintaion options applied
   * @param pagination The pagination options which will be sent as query parameter to the server
   */
  private loadImages(pagination: ImageListOptions) {
    return this.imageService.findByRemote(pagination)
      .subscribe(
        data => {
          this.imageResponse = data;
          this.invalidSearchQuery = false;
        },
        err => {
          if (err.status === 400) {
            this.invalidSearchQuery = true;
          } else {
            this.error = 'Server is not reachable. Contact a server administrator.';
          }
        });
  }
}
