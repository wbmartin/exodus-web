import { Component, OnInit } from '@angular/core';
import { UsrMsgHubService } from '../_service/usr-msg-hub.service';
import { JSDateFormat } from '../js-date-format.pipe';
import { SessionService } from '../_service/session.service';

@Component({
  selector: 'app-usr-msg-history',
  templateUrl: './usr-msg-history.component.html',
  styleUrls: ['./usr-msg-history.component.css']
})
export class UsrMsgHistoryComponent implements OnInit {

  constructor(
    public usrMsgHubService: UsrMsgHubService, // exposed to HTML
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.showAuthUIComponents('system');
  }

  /*
   *  Show hide UI components based on authorization
   */
  showAuthUIComponents(securityContext: string = 'DEFAULTDENY'): void {

  }

}
