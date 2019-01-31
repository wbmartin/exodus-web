import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGrantEditComponent } from './app-grant-edit.component';

describe('AppGrantEditComponent', () => {
  let component: AppGrantEditComponent;
  let fixture: ComponentFixture<AppGrantEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGrantEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGrantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
