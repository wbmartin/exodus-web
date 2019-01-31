import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMsgComponent } from './usr-msg.component';

describe('UsrMsgComponent', () => {
  let component: UsrMsgComponent;
  let fixture: ComponentFixture<UsrMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsrMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
