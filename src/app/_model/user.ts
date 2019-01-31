export interface IUser {
  _id: string;
  securityContext: number;
  username: string;
  enabled: boolean;
  userGrants: object;
  createUser: string;
  createDate: Date;
  updateUser: string;
  updateDate: Date;
  passwd: string;
  userNotes: string;
  userGroups: Array<string>;


}

export class User implements IUser {
  public _id: string;
  public securityContext: number;
  public username: string;
  public enabled: boolean;
  public userGrants: object;
  public createUser: string;
  public createDate: Date;
  public updateUser: string;
  public updateDate: Date;
  public passwd: string;
  public userNotes: string;
  public userGroups: Array<string>

  constructor() {
    this._id = '0';
    this.userGroups = [];
  }


}
