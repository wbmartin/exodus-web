import { Component, OnInit } from '@angular/core';
import { SessionService } from '../_service/session.service';
import { Log4ngService } from '../_service/log4ng.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private logger: Log4ngService,

  ) { }

  /*
   *
   */
  ngOnInit() {
    // this.userMsgs = this.sessionService.userMsgQueue.getMessages();
    this.logger.debug('footer.component', 'ngOnInit running');
  }

}
