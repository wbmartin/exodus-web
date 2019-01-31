export interface IClientConfig {
  AWS_S3_BucketName: string;
  AWS_Region: string;
  AWS_Cognito_IdentiyPoolId: string;
}

export class ClientConfig implements IClientConfig {
  public AWS_S3_BucketName: string;
  public AWS_Region: string;
  public AWS_Cognito_IdentiyPoolId: string;


  constructor() {

  }


}
