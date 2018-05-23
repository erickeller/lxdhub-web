import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteHintComponent } from './remote-hint.component';

describe('RemoteHintComponent', () => {
  let component: RemoteHintComponent;
  let fixture: ComponentFixture<RemoteHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteHintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('generateHint', () => {
    it('should generate a private hint', () => {
      const hint = component.generateHint({
        serverUrl: 'https://myserver.com',
        name: 'images',
        readonly: false,
        public: false
      });
      expect(hint).toBe('lxc remote add images https://myserver.com --accept-certificate --password=<ask>');
    });

    it('should generate a public hint', () => {
      const hint = component.generateHint({
        serverUrl: 'https://myserver.com',
        name: 'images',
        readonly: true,
        public: true
      });
      expect(hint).toBe('lxc remote add images https://myserver.com --accept-certificate --public');
    });

    it('should generate a public, not readonly hint', () => {
      const hint = component.generateHint({
        serverUrl: 'https://myserver.com',
        name: 'images',
        readonly: false,
        public: true
      });
      expect(hint).toBe('lxc remote add images https://myserver.com --accept-certificate --password=<ask> --public');
    });
  });
});
