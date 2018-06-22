import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CloneImageDto,
  ImageDetailDto,
  ImageListItemDto,
  ImageListOptions,
  PaginationResponseDto,
  ResponseDto,
} from '@lxdhub/common';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { NGXLogger } from 'ngx-logger';

/**
 * Interface to the LXDHub API for
 * Image operations.
 */
@Injectable()
export class ImageService {
  /**
   * Initializes the Image Service
   * @param http The HTTP Client
   */
  constructor(
    private http: HttpClient,
    private logger: NGXLogger) { }

  /**
   * Fetches the images with the given pagination options applied
   * @param options The pagination options which will be sent as query parameter
   */
  findByRemote(options: ImageListOptions)
    : Observable<PaginationResponseDto<ImageListItemDto[]>> {
    // Set the query parameters
    let params = new HttpParams()
      .set('limit', options.limit.toString())
      .set('offset', options.offset.toString())
      .set('remoteId', options.remoteId.toString());

    if (options.query) {
      params = params.set('query', options.query.toString());
    }

    this.logger.debug(`Find images by remote remoteId#${options.remoteId}`, options);

    // Fetch the Images
    return this.http
      .get<PaginationResponseDto<ImageListItemDto[]>>(`${environment.apiUrl}/api/v1/image`, { params });
  }

  /**
   * Fetches one image with the given id
   * @param pagination The id of the image
   */
  findOne(id: number)
    : Observable<ResponseDto<ImageDetailDto>> {
    this.logger.debug(`Find one image: imageId#${id}`);
    return this.http
      .get<ResponseDto<ImageDetailDto>>(`${environment.apiUrl}/api/v1/image/${id}`);
  }

  /**
   * Clones the image
   * @param id The id of the image
   * @param cloneImageDto The clone image dto
   */
  cloneImage(id: number, cloneImageDto: CloneImageDto)
    : Observable<ResponseDto<{ uuid: string }>> {
    this.logger.debug(`Cloning image: imageId#${id}`, cloneImageDto);
    return this.http
      .post<ResponseDto<{ uuid: string }>>(`${environment.apiUrl}/api/v1/image/${id}/clone`, cloneImageDto);
  }
}
