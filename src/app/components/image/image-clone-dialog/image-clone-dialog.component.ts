import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { ImageDetailComponent } from '../image-detail/image-detail.component';
import { ImageService } from '../image.service';
import { ImageSocket } from '../image.socket';

@Component({
  selector: 'app-image-clone-dialog',
  template: `
<h2>Clone Image</h2>
<div *ngIf="image && selectedDestination && selectedSource">
  Clone manually:
  <app-image-clone-hint
    [sourceRemote]="selectedSource"
    [destinationRemote]="selectedDestination"
    [image]="image"
    ></app-image-clone-hint>
</div>

<!-- Source Remote Select -->
<span>Source:</span>
<mat-select [disabled]="isFormLocked" [(ngModel)]="selectedSource" placeholder="Select Remote" class="layout-margin">
  <mat-option *ngFor="let remote of sourceRemotes" [value]="remote">
    {{ remote.name }}:
  </mat-option>
</mat-select>

<!-- Destination Remote Select -->
<span>Destination:</span>
<mat-select [disabled]="isFormLocked" [(ngModel)]="selectedDestination" placeholder="Select Remote" class="layout-margin">
  <mat-option *ngFor="let remote of destinationRemotes" [value]="remote">
    {{ remote.name }}:
  </mat-option>
</mat-select>

<!-- Dialog Buttons -->
<div class="row end-xs middle-xs layout-margin">
  <mat-spinner diameter="20" *ngIf="isFormLocked" class="layout-margin clone-spinner" color="primary"></mat-spinner>
  <button mat-raised-button [disabled]="isFormLocked" class="clone-button row" color="accent" (click)="onSubmit()">
    <span>Clone</span>
  </button>
  <button mat-raised-button (click)="dialogRef.close()">Close</button>
</div>
  `,
  styleUrls: ['./image-clone-dialog.component.css']
})
export class ImageCloneDialogComponent implements OnInit, OnDestroy {
  private $cloneOperation: Subscription;
  public destinationRemotes: any[];
  public sourceRemotes: any[];
  public selectedSource: any;
  public selectedDestination: any;
  public isFormLocked: boolean;

  /**
   * Initializes the component
   */
  constructor(
    public dialogRef: MatDialogRef<ImageDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public image: any,
    private imageService: ImageService,
    private imageSocket: ImageSocket,
    private snackBarRef: MatSnackBar
  ) { }


  /**
   * Initializes the component
   * and filters the given remotes
   * for only usable options.
   */
  ngOnInit() {
    this.destinationRemotes = this.image.remotes
      .filter(remote => remote.cloneable);
    this.sourceRemotes = this.image.remotes
      .filter(remote => remote.available);
  }

  /**
   * Gets called when the user submits the
   * dialog
   *
   * Clones the image with the bound data
   */
  onSubmit() {
    if (!this.selectedDestination || !this.selectedSource) {
      return;
    }
    this.snackBarRef.open('Started cloning operation', 'Dismiss', { duration: 3000 });
    this.isFormLocked = true;

    // Clones the image
    this.imageService
      .cloneImage(this.image.id,
        {
          destinationRemoteId: this.selectedDestination.id,
          sourceRemoteId: this.selectedSource.id
        })
      .subscribe(
        // Subscribe to clone operation
        result => {
          this.waitForCloneOperation(result.results.uuid);
        },
        error => {
          this.snackBarRef.open(`Failed: ${error.message}`, 'Dismiss', { duration: 20000 });
          this.isFormLocked = false;
        });
  }

  /**
   * Subscribe to the clone operation
   */
  waitForCloneOperation(operation) {
    this.$cloneOperation = this.imageSocket
      .getCloneStatus(this.selectedDestination.id, operation, this.image.id)
      .subscribe(
        result => {
          this.isFormLocked = false;
          this.snackBarRef.open('Image cloned', 'Dismiss', { duration: 3000 });
          this.closeDialog(result.results);
        },
        err => this.snackBarRef.open(`Failed: ${err.message}`));

    return this.$cloneOperation;
  }

  /**
   * Closes the dialog
   */
  closeDialog(response?: any) {
    this.dialogRef.close(response);
  }

  /**
   * Unsubscribes to all subscriptions
   */
  ngOnDestroy(): void {
    if (this.$cloneOperation) {
      this.$cloneOperation.unsubscribe();
    }
  }
}
