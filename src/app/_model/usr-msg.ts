export class UsrMsg {
  private title: string;
  private details: string;
  private severity: string;
  private ts: number;

  constructor(title: string, details: string = '', severity: string = 'INFO', timestamp: number) {
    this.title = title;
    this.details = details;
    this.severity = severity;
    this.ts = timestamp;
  }
}
