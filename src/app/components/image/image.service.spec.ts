import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImageDetailDto, ImageListItemDto, PaginationResponseDto, ResponseDto } from '@lxdhub/common';
import { NGXLogger, NGXLoggerMock, LoggerModule } from 'ngx-logger';

import { environment } from '../../../environments/environment';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let imageService: ImageService;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    const module = await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerModule
      ],
      providers: [
        ImageService,
        {
          provide: NGXLogger,
          useClass: NGXLoggerMock
        }
      ]
    });

    imageService = module.get(ImageService);
    httpMock = module.get(HttpTestingController);
  });
  describe('findByRemote()', () => {
    it('should request to correct apiurl with query parameters', () => {
      const data = imageService.findByRemote({ remoteId: 1, limit: 25, offset: 0 })
        .subscribe((response: PaginationResponseDto<ImageListItemDto[]>) => {
          expect(response.results[0].fingerprint).toBe('1');
        });

      const imageRequest = httpMock.expectOne(`${environment.apiUrl}/api/v1/image?limit=25&offset=0&remoteId=1`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: [{ fingerprint: '1' }] });
    });

    it('should request to correct apiurl with query parameters and a search string', () => {
      const data = imageService.findByRemote({ remoteId: 1, limit: 25, offset: 0, query: 'os=ubuntu' })
        .subscribe((response: PaginationResponseDto<ImageListItemDto[]>) => {
          expect(response.results[0].fingerprint).toBe('1');
        });

      const imageRequest = httpMock
        .expectOne(`${environment.apiUrl}/api/v1/image?limit=25&offset=0&remoteId=1&query=os=ubuntu`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: [{ fingerprint: '1' }] });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });

  describe('findOne()', () => {
    it('should request to correct apiurl', () => {
      const data = imageService.findOne(1)
        .subscribe((response: ResponseDto<ImageDetailDto>) => {
          expect(response.results.fingerprint).toBe('1');
        });

      const imageRequest = httpMock.expectOne(`${environment.apiUrl}/api/v1/image/1`);
      expect(imageRequest.request.method).toBe('GET');
      imageRequest.flush({ results: { fingerprint: '1' } });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
