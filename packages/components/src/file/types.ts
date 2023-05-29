export interface IFile extends File {
  uid: number;
}
export interface IRFile {
  url: string;
  name: string;
  size: number;
  uid: number;
  percentage: number;
  status: string; // 'ready' | 'success' |'fail'
  raw: IFile;

  response?: any;
}

export interface MtdFile extends IRFile {
  user?: string
  time?: number | string | Date
  statusMsg?: string
  thumbUrl?: string | Function
}