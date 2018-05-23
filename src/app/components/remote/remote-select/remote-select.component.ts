import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectChange, MatSnackBar } from '@angular/material';
import { RemoteDto } from '@lxdhub/common';

import { RemoteService } from '../remote.service';

@Component({
  selector: 'app-remote-select',
  template: `
<mat-select *ngIf="selectedRemote" placeholder="Select Remote" [value]="selectedRemote" (selectionChange)="onSelectionChange($event)">
  <mat-option *ngFor="let remote of remotes" [value]="remote">
    {{ remote.name }}
  </mat-option>
</mat-select>
  `,
  styleUrls: ['./remote-select.component.css']
})
/**
 * The component, which displays a remote-selection.
 */
export class RemoteSelectComponent implements OnInit {

  remotes: RemoteDto[];
  selectedRemote: RemoteDto;
  /**
   * The selected remote-event. Changes when the selected
   * remote changes.
   * @example
   * <app-remote-select (selected)="onRemoteChange($event)"></app-remote-select>
   */
  @Output() selected = new EventEmitter<RemoteDto>();

  constructor(
    private remoteService: RemoteService,
    private snackbar: MatSnackBar
  ) { }

  /**
   * Initializes the component
   * and loads the remotes
   */
  ngOnInit() {
    this.loadRemotes();
  }

  /**
   * Gets called when the selection of mat-select changes.
   * Emits the selected remote to the output.
   * @param event The change-event from mat-select
   */
  onSelectionChange(event: MatSelectChange) {
    this.selected.emit(event.value);
  }

  /**
   * Loads all remotes from the API, binds them
   * to the controller and selected and emit
   * the first remote.
   */
  loadRemotes() {
    this.remoteService
      .findAll()
      .subscribe(
        remoteResponse => {
          this.remotes = remoteResponse.results;
          // Show first remote
          this.selectedRemote = this.remotes[0];
          this.selected.emit(this.selectedRemote);
        },
        () => this.onRemotesError());
  }

  /**
   * Gets called when there is an error
   * while fetching the remotes.
   */
  onRemotesError() {
    return this.snackbar
      .open('Could not fetch remotes', 'Retry')
      .onAction()
      .subscribe(() => this.loadRemotes());
  }
}
