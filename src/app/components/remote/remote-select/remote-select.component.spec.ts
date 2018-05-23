import 'rxjs/add/observable/of';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule, MatSnackBarModule } from '@angular/material';
import { RemoteDto, ResponseDto } from '@lxdhub/common';
import { Observable } from 'rxjs/Observable';

import { RemoteService } from '../remote.service';
import { RemoteSelectComponent } from './remote-select.component';

class MockRemoteService {
  findAll(): Observable<ResponseDto<RemoteDto[]>> {
    const response: ResponseDto<RemoteDto[]> = {
      results: [{
        name: '1',
        serverUrl: '1',
        readonly: false,
        public: true,
        protocol: 'lxd',
        id: 1
      }]
    };
    return Observable.of(response);
  }
}

describe('RemoteSelectComponent', () => {
  let component: RemoteSelectComponent;
  let fixture: ComponentFixture<RemoteSelectComponent>;
  let remoteService: RemoteService;

  beforeEach(async(() => {
    const testModule = TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        MatSnackBarModule
      ],
      declarations: [RemoteSelectComponent],
      providers: [{
        provide: RemoteService,
        useClass: MockRemoteService
      }]
    });
    testModule.compileComponents();
    remoteService = testModule.get(RemoteService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request remotes on init', () => {
    const spy = spyOn(remoteService, 'findAll').and.callThrough();
    component.loadRemotes();
    expect(spy).toHaveBeenCalled();
  });
});
