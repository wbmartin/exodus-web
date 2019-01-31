export interface IAppGrant {
  _id: string;
  securityContext: string;
  shortName: string;
  systemOnly: string;
  longName: string;
  note: string;
  createUser: string;
  createDate: Date;
  updateUser: string;
  updateDate: Date;


}

export class AppGrant implements IAppGrant {
  public _id: string;
  public securityContext: string;
  public shortName: string;
  public systemOnly: string;
  public longName: string;
  public note: string;
  public createUser: string;
  public createDate: Date;
  public updateUser: string;
  public updateDate: Date;



  constructor() {
    this._id = '0';
  }


}
