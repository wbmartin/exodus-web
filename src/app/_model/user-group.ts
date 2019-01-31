export interface IUserGroup {
  _id: string;
  securityContext: string;
  groupRoleName: string;
  privilegeGrants: any;
  createUser: string;
  createDate: Date;
  updateUser: string;
  updateDate: Date;

}

export class UserGroup implements IUserGroup {
  public _id: string;
  public securityContext: string;
  public groupRoleName: string;
  public privilegeGrants: any;
  public createUser: string;
  public createDate: Date;
  public updateUser: string;
  public updateDate: Date;



  constructor() {
    this._id = '0';
  }


}
