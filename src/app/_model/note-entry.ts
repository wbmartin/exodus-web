import { CloudFile } from './cloud-file';

export interface INoteEntry {
  _id: string;
  securityContext: string;
  createUser: string;
  createDate: Date;
  updateUser: string;
  updateDate: Date;
  label: string;
  body: string;
  tags: string;
  attachments: Array<CloudFile>;
}

export class NoteEntry implements INoteEntry {
  public _id: string;
  public securityContext: string;
  public createUser: string;
  public createDate: Date;
  public updateUser: string;
  public updateDate: Date;
  public label: string;
  public body: string;
  public tags: string;
  public attachments: Array<CloudFile>;


  constructor() {
    this._id = '0';
    this.attachments = [];
  }


}
