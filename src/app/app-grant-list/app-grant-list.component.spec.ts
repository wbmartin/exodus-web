import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGrantListComponent } from './app-grant-list.component';

describe('AppGrantListComponent', () => {
  let component: AppGrantListComponent;
  let fixture: ComponentFixture<AppGrantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGrantListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGrantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
