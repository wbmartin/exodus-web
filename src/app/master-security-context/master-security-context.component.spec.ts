import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSecurityContextComponent } from './master-security-context.component';

describe('MasterSecurityContextComponent', () => {
  let component: MasterSecurityContextComponent;
  let fixture: ComponentFixture<MasterSecurityContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSecurityContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSecurityContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
