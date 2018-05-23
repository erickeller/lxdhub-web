import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCloneHintComponent } from './image-clone-hint.component';

describe('ImageCloneHintComponent', () => {
  let component: ImageCloneHintComponent;
  let fixture: ComponentFixture<ImageCloneHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageCloneHintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCloneHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the proper hint', () => {
    const hint = component.generateHint({ fingerprint: '012345678901234' }, { id: 2, name: 'images' }, { id: 1, name: 'local' });
    expect(hint).toBe('lxc image copy images:012345678901 local: --copy-aliases');
  });

  it('should set the sourceremote', () => {
    spyOn(component, 'generateHint').and.callFake(() => null);
    component.sourceRemote = 1;
    expect(component._sourceRemote).toBe(1);
    expect(component.generateHint).toHaveBeenCalled();
  });

  it('should set the sourceremote', () => {
    spyOn(component, 'generateHint').and.callFake(() => null);
    component.sourceRemote = 1;
    expect(component._sourceRemote).toBe(1);
    expect(component.generateHint).toHaveBeenCalled();
  });

  it('should set the destinationRemote', () => {
    spyOn(component, 'generateHint').and.callFake(() => null);
    component.destinationRemote = 1;
    expect(component._destinationRemote).toBe(1);
    expect(component.generateHint).toHaveBeenCalled();
  });

  it('should set the image', () => {
    spyOn(component, 'generateHint').and.callFake(() => null);
    component.image = 1;
    expect(component._image).toBe(1);
    expect(component.generateHint).toHaveBeenCalled();
  });
});
