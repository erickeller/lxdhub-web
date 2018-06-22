import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ImageDetailDto } from '@lxdhub/common';
import * as PrettyBytes from 'pretty-bytes';
import { Subscription } from 'rxjs';

import { ImageCloneDialogComponent } from '../image-clone-dialog/image-clone-dialog.component';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-detail',
  template: `
<section *ngIf="loaded">
  <div class="center-xs middle-xs column layout-padding layout-margin" *ngIf="error">
    <span class="layout-margin">
    {{ error }}
    </span>
  </div>
  <header class="image-detail-header col-xs-12 row middle-xs" *ngIf="!error">
    <div class="col-md-8 col-md-offset-2 col-xs-12 col-xs-offset-0 row image-detail-header-content">
      <div class="column col-xs">
        <div class="image-description light-color" *ngIf="image.operatingSystem">
          {{ image.operatingSystem.distribution }}
          {{ image.operatingSystem.release }}
          {{ image.operatingSystem.version }}
        </div>
        <div class="image-description-detail light-color" *ngIf="image.architecture">
          {{ image.architecture.humanName }}
        </div>
      </div>
      <button [disabled]="!image.cloneable"
              [disableRipple]="true"
              (click)="openCloneDialog()"
              mat-raised-button
              color="accent"
              class="clone-image">Clone Image</button>
    </div>
  </header>
  <div class="image-detail-content layout-padding
    col-lg-6
    col-lg-offest-3
    col-md-offest
    col-md-8
    col-md-offset-2
    col-sm-10
    col-sm-1
    col-xs-12
    col-xs-offset-0"
    *ngIf="!error">
    <h2 class="detail-overtitle">Detail</h2>
    <div>
      <app-image-clone-hint
        *ngIf="localClone.sourceRemote"
        [destinationRemote]="localClone.destinationRemote"
        [sourceRemote]="localClone.sourceRemote"
        [image]="image">
      </app-image-clone-hint>
    </div>
    <div>
      <span class="detail-title">Fingerprint</span> {{ image.fingerprint | slice:0:12 }}
    </div>
    <div *ngIf="image.operatingSystem">
      <span class="detail-title">Operating System</span>
      {{ image.operatingSystem.distribution }}
      {{ image.operatingSystem.release }}
      {{ image.operatingSystem.version }}
    </div>
    <div *ngIf="image.architecture">
      <span class="detail-title">Architecture</span> {{ image.architecture.humanName }} ({{image.architecture.processorName}})
    </div>
    <div>
      <span class="detail-title">Uploaded At</span> {{ image.uploadedAt }}
    </div>
    <div>
      <span class="detail-title">Created At</span> {{ image.createdAt }}
    </div>
    <div>
      <span class="detail-title">Expires At</span>{{ image.expiresAt }}
    </div>
    <div *ngIf="image.serial">
      <span class="detail-title">Serial</span> {{ image.serial }}
    </div>
    <div *ngIf="image.size">
      <span class="detail-title">Imagesize</span> {{ image.size }}
    </div>
    <div>
      <span class="detail-title">Public</span> {{ image.public }}
    </div>
    <div>
      <span class="detail-title">Auto Update</span> {{ image.autoUpdate }}
    </div>
    <div *ngIf="image.remotes.length">
      <span class="detail-title">Remotes</span>
      <ul>
        <li *ngFor="let remote of image.remotes">
          <strong>{{remote.name}}:</strong>
          <mat-icon *ngIf="!remote.available" class="remote-icon">close</mat-icon>
          <mat-icon *ngIf="remote.available" class="remote-icon">check</mat-icon>
        </li>
      </ul>
    </div>
    <div *ngIf="image.aliases.length">
      <span class="detail-title">Aliases</span>
      <ul>
        <li *ngFor="let alias of image.aliases">
          <strong>{{alias.name}}</strong>
          <span *ngIf="alias.description">: {{ alias.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</section>
  `,
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit, OnDestroy {
  idSubscriber: Subscription;
  image: ImageDetailDto;
  loaded = false;
  error: string;
  localClone: any = {};

  /**
   * Initializes the ImageList Component
   * @param imageService The service to fetch images from the API interface
   * @param route The route service provided by angular
   * @param dialog The dialog service provided by angular material
   */
  constructor(
    private imageService: ImageService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  /**
   * Subscribes to the id-Url-parameter and
   * loads the image, if it changes
   */
  ngOnInit() {
    this.idSubscriber = this.route.params
      .subscribe(params =>
        this.loadImage(params.id));
  }

  /**
   * Maps data from the database with data the UI
   * needs
   * @param image The image from the database
   */
  mapImage(image: ImageDetailDto): ImageDetailDto {
    if (image.size) {
      image.size = PrettyBytes(image.size);
    }
    return image;
  }

  /**
   * Loads the image with the given id
   * @param id The id of the image
   */
  loadImage(id) {
    // Fetch the image from the api
    return this.imageService.findOne(id)
      .subscribe(
        response => {
          // Map image and bind it to the controller
          this.image = this.mapImage(response.results);
          this.loaded = true;
          this.localClone.sourceRemote = this.image.remotes.filter(remote => remote.available)[0];
          this.localClone.destinationRemote = { name: 'local' };
        },
        () => {
          // Show error
          this.error = 'Image not found';
          this.loaded = true;
        });
  }

  /**
   * Gets called when the component gets unloaded
   * Unsubscribe from everything
   */
  ngOnDestroy() {
    this.idSubscriber.unsubscribe();
  }

  /**
   * Opens the clone dialog
   */
  openCloneDialog() {
    const dialogRef = this.dialog.open(ImageCloneDialogComponent, {
      width: '650px',
      data: this.image
    });

    dialogRef
      .afterClosed()
      .subscribe(
        // Updates the image detail
        image => {
          if (image) {
            this.image = image;
          }
        });
  }
}
