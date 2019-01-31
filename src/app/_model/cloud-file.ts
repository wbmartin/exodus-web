export interface ICloudFile {
  _id: string;
  fileName: string;
  fileSize: string;
  tags: string;
  contentType: string;
  logicalPath: string;
  createDate: Date;
  createUser: string;
  updateDate: Date;
  updateUser: string;
  securityContext: Date;
  cloudId: string;




}

export class CloudFile implements ICloudFile {
  public _id: string;
  public fileName: string;
  public fileSize: string;
  public tags: string;
  public contentType: string;
  public logicalPath: string;
  public createDate: Date;
  public createUser: string;
  public updateDate: Date;
  public updateUser: string;
  public securityContext: Date;
  public cloudId: string;;




  constructor() {

  }


}
