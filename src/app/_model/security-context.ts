export interface ISecurityContext {
  _id: string;
  shortName: string;
  longName: string;
  securityContext: string;
  note: string;
  createDate: Date;
  updateUser: string;
  updateDate: Date;
}

export class SecurityContext implements ISecurityContext {
  public _id: string;
  public shortName: string;
  public longName: string;
  public securityContext: string;
  public note: string;
  public createDate: Date;
  public updateUser: string;
  public updateDate: Date;

  constructor(shortNameNew = '') {
    this._id = '0';
    this.securityContext = 'system';
    this.shortName = shortNameNew;

  }


}
