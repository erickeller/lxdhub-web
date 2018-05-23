import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';

import { RemoteModule } from '../remote/remote.module';
import { ImageCloneDialogComponent } from './image-clone-dialog/image-clone-dialog.component';
import { ImageCloneHintComponent } from './image-clone-hint/image-clone-hint.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageSearchComponent } from './image-search/image-search.component';
import { ImageService } from './image.service';
import { ImageSocket } from './image.socket';

/**
 * The routes for image related stuff
 */
const appRoutes: Routes = [
  // List of all images
  { path: 'images', component: ImageListComponent },
  // Detail page of an image
  { path: 'image/:id', component: ImageDetailComponent }
];

/**
 * The module for image operations
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
    MatPaginatorModule,
    MatButtonModule,
    RemoteModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ImageService,
    ImageSocket
  ],
  exports: [RouterModule, ImageCloneDialogComponent],
  declarations: [
    ImageListComponent,
    ImageDetailComponent,
    ImageSearchComponent,
    ImageCloneDialogComponent,
    ImageCloneHintComponent
  ],
  entryComponents: [
    ImageCloneDialogComponent
  ]
})
export class ImageModule { }
