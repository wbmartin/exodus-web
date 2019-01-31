export interface IPasswordResetRequest {
  passwd: string;
  confirmPasswd: string;
  resetToken: string;
}

export class PasswordResetRequest implements IPasswordResetRequest {
  public passwd: string;
  public confirmPasswd: string;
  public resetToken: string;

  constructor(

  ) {
    this.passwd = '';
    this.confirmPasswd = '';
    this.confirmPasswd = '';
  }
}
