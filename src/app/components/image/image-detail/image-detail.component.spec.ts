import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ImageCloneHintComponent } from '../image-clone-hint/image-clone-hint.component';
import { ImageService } from '../image.service';
import { ImageDetailComponent } from './image-detail.component';

class ImageServiceMock {
  findOne(id: number) {
    return Observable.of({ results: { id: 1, size: 123, remotes: [{ available: true }] } });
  }
}

describe('ImageDetailComponent', () => {
  let component: ImageDetailComponent;
  let fixture: ComponentFixture<ImageDetailComponent>;
  let imageService: ImageService;

  beforeEach((async () => {
    TestBed.configureTestingModule({
      declarations: [
        ImageDetailComponent,
        ImageCloneHintComponent
      ],
      providers: [
        {
          provide: ImageService,
          useClass: ImageServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) => fn({
                id: 1,
              }),
            },
          }
        }
      ],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule
      ]
    }).compileComponents();
    imageService = TestBed.get(ImageService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // describe('loadImage', () => {
  // it('should load the image with the given id', () => {
  //   spyOn(imageService, 'findOne').and.callFake(() => Observable.of({ results: { id: 1, size: 123, remotes: [{ available: true }] } }));
  //   component.loadImage(1);

  //   expect(imageService.findOne).toHaveBeenCalledWith(1);
  // });

  // });
});
