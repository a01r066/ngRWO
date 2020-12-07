export class Episode {
  id?: string;
  audiobookID?: string;
  cateID?: string;
  title: string;
  author?: string;
  filePath: string;
  index?: number;
  tags?: string;
  duration?: number;

  constructor(id: string, audiobookID: string, cateID: string,
              dataObj: { title: string, author: string, filePath: string, index: number, tags: string, duration: number}) {
    this.id = id;
    this.audiobookID = audiobookID;
    this.cateID = cateID;
    this.title = dataObj.title;
    this.author = dataObj.author;
    this.filePath = dataObj.filePath;
    this.index = dataObj.index;
    this.tags = dataObj.tags;
    this.duration = dataObj.duration;
  }
}
