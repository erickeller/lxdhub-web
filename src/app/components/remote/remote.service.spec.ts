import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RemoteDto, ResponseDto } from '@lxdhub/common';

import { environment } from '../../../environments/environment';
import { RemoteService } from './remote.service';
import { NGXLoggerMock, NGXLogger } from 'ngx-logger';

describe('RemoteService', () => {
  let remoteService: RemoteService;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    const module = await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RemoteService,
        {
          provide: NGXLogger,
          useClass: NGXLoggerMock
        }
      ]
    });

    remoteService = module.get(RemoteService);
    httpMock = module.get(HttpTestingController);
  });
  describe('findAll()', () => {
    it('should request to correct apiurl', () => {
      const data = remoteService.findAll()
        .subscribe((response: ResponseDto<RemoteDto[]>) => {
          expect(response.results[0].name).toBe('1');
        });

      const remoteRequest = httpMock.expectOne(`${environment.apiUrl}/api/v1/remote`);
      expect(remoteRequest.request.method).toBe('GET');
      remoteRequest.flush({ results: [{ name: '1' }] });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
