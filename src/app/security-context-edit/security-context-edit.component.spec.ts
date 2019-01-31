import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityContextEditComponent } from './security-context-edit.component';

describe('SecurityContextEditComponent', () => {
  let component: SecurityContextEditComponent;
  let fixture: ComponentFixture<SecurityContextEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityContextEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityContextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
