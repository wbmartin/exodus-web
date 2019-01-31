import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityContextListComponent } from './security-context-admin.component';

describe('SecurityContextAdminComponent', () => {
  let component: SecurityContextAdminComponent;
  let fixture: ComponentFixture<SecurityContextAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityContextAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityContextAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
