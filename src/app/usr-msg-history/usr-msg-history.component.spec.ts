import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrMsgHistoryComponent } from './usr-msg-history.component';

describe('UsrMsgHistoryComponent', () => {
  let component: UsrMsgHistoryComponent;
  let fixture: ComponentFixture<UsrMsgHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsrMsgHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrMsgHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
