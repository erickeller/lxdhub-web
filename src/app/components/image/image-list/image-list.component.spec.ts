import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { async } from '@angular/core/testing';
import { ImageListItemDto, ImageListOptions, PaginationResponseDto, RemoteDto } from '@lxdhub/common';
import { Observable } from 'rxjs/Observable';

import { ImageService } from '../image.service';
import { ImageListComponent } from './image-list.component';

const images: ImageListItemDto[] = [{
  fingerprint: '1',
  description: '1',
  id: 1,
  uploadedAt: new Date()
} as ImageListItemDto];

class MockImageService {
  findByRemote(options: ImageListOptions): Observable<PaginationResponseDto<ImageListItemDto[]>> {
    const imageResponse: PaginationResponseDto<ImageListItemDto[]> = {
      results: images,
      offset: options.offset,
      limit: options.limit,
      total: 1
    };
    return Observable.of(imageResponse);
  }
}

describe('ImageListComponent', () => {
  let component: ImageListComponent;
  let imageService: MockImageService;

  beforeEach(async(() => {
    imageService = new MockImageService();
    component = new ImageListComponent(imageService as ImageService);
    component.limit = 25;
    component.offset = 0;
    component.remote = { id: 1, name: '', protocol: '', public: true, readonly: false, serverUrl: '' };
    component.query = 'os=ubuntu';
  }));


  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should get the correct page', () => {
    component.loadPage();
    const imageResponse: PaginationResponseDto<ImageListItemDto[]> = {
      results: images,
      offset: 0,
      limit: 25,
      total: 1
    };
    expect(component.imageResponse).toEqual(imageResponse);
  });

  it('should show invalid error when receiving a 400', () => {
    spyOn(imageService, 'findByRemote').and.callFake(() => Observable.throw({ status: 400 }));
    expect(component.invalidSearchQuery).toEqual(false);

    component.loadPage();
    const imageResponse: PaginationResponseDto<ImageListItemDto[]> = {
      results: images,
      offset: 0,
      limit: 25,
      total: 1
    };
    expect(component.invalidSearchQuery).toEqual(true);
  });

  it('should show error when receiving a 500', () => {
    spyOn(imageService, 'findByRemote').and.callFake(() => Observable.throw({ status: 500 }));
    expect(component.error).toBeUndefined();

    component.loadPage();
    const imageResponse: PaginationResponseDto<ImageListItemDto[]> = {
      results: images,
      offset: 0,
      limit: 25,
      total: 1
    };
    expect(component.error).toBeDefined();
  });

  it('should should bind the correct values when calling onQueryChange', () => {
    spyOn(component, 'loadPage').and.callFake(() => { });
    expect(component.query).toBe('os=ubuntu');
    component.offset = 1;

    component.onQueryChange('a');
    expect(component.loadPage).toHaveBeenCalled();
    expect(component.offset).toBe(0);
    expect(component.query).toBe('a');
  });

  it('should should bind the correct values when calling onPaginationChange', () => {
    spyOn(component, 'loadPage').and.callFake(() => { });
    expect(component.query).toBe('os=ubuntu');
    component.offset = 1;

    component.onPaginationChange({ pageSize: 20, pageIndex: 1, length: 20 });
    expect(component.loadPage).toHaveBeenCalled();
    expect(component.offset).toBe(20);
    expect(component.limit).toBe(20);
  });

  it('should should bind the correct values when calling onRemoteChange', () => {
    spyOn(component, 'loadPage').and.callFake(() => { });
    expect(component.query).toBe('os=ubuntu');
    component.offset = 1;

    const remoteDto: RemoteDto = {
      id: 1,
      name: 'images',
      protocol: 'lxd',
      public: true,
      readonly: true,
      serverUrl: 'https://server.com'
    };
    component.onRemoteChange(remoteDto);
    expect(component.loadPage).toHaveBeenCalled();
    expect(component.offset).toBe(0);
    expect(component.remote).toEqual(remoteDto);
  });
});
