import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationOptionsDto, PaginationResponseDto, ResponseDto, RemoteDto } from '@lxdhub/common';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

/**
 * Interface to the LXDHub API for
 * Remote operations.
 */
@Injectable()
export class RemoteService {
  /**
   * Initializes the Remote Service
   * @param http The HTTP Client
   */
  constructor(
    private http: HttpClient,
    private logger: NGXLogger) { }

  /**
   * Fetches all remotes
   */
  findAll()
    : Observable<ResponseDto<RemoteDto[]>> {
    this.logger.debug(`Request all remotes`);
    // Fetch the remotes
    return this.http
      .get<ResponseDto<RemoteDto[]>>(`${environment.apiUrl}/api/v1/remote`);
  }
}
