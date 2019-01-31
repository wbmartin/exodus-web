import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSimpleGenericComponent } from './dialog-simple-generic.component';

describe('DialogSimpleGenericComponent', () => {
  let component: DialogSimpleGenericComponent;
  let fixture: ComponentFixture<DialogSimpleGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSimpleGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSimpleGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
