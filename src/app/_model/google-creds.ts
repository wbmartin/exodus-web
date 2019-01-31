export interface IGoogleCreds {
    idToken: string;
    clientId: string;
}

export class GoogleCreds implements IGoogleCreds {

  public idToken: string;
  public clientId: string;

  constructor(
    idToken_: string,
    clientId_: string
  ) {
    this.idToken = idToken_;
    this.clientId = clientId_;
  }
}
