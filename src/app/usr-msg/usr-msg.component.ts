import { Component, OnInit } from '@angular/core';
import { UsrMsgHubService } from '../_service/usr-msg-hub.service';
import { SessionService } from '../_service/session.service';

@Component({
  selector: 'app-usr-msg',
  templateUrl: './usr-msg.component.html',
  styleUrls: ['./usr-msg.component.css']
})
export class UsrMsgComponent implements OnInit {

  constructor(
    public usrMsgHubService: UsrMsgHubService, // exposed to HTML
    private sessionService: SessionService,
  ) { }

  /*
   *
   */
  ngOnInit() {
  }

}
