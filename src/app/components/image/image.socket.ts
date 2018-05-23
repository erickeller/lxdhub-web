import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

import { environment } from '../../../environments/environment';

@Injectable()
export class ImageSocket extends Socket {
    constructor() {
        super({ url: `${environment.apiUrl}/image`, options: {} });
    }

    getCloneStatus(destinationRemoteId: number, operation: string, imageId: number): any {
        this.emit('clone-status', { destinationRemoteId, operation, imageId });
        return this.fromEvent('clone-status');
    }
}
