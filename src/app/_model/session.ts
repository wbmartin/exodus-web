export interface ISession {
  id: number;
  username: string;
  csrf: string;
  grants: object;
  est_ses_exp: number;
}

export class Session implements ISession {
  public id: number;
  public username: string;
  public csrf: string;
  public grants: object;
  public est_ses_exp: number;
  /*
  constructor(
  public id: number,
  public username: string,
  public csrf: string,
  public grants: object,
  public est_ses_exp: number,
  ){}
  */

}
