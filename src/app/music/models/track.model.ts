export class Track {
  id?: string;
  albumID?: string;
  genreID?: string;
  title?: string;
  author?: string;
  filePath: string;
  index?: number;
  tags?: string;
  duration?: string;
  played: number;

  constructor(id: string, albumID: string, genreID: string, dataObj: { title: string, author: string, filePath: string, index: number, tags: string, duration: string, played: number}) {
    this.id = id;
    this.albumID = albumID;
    this.genreID = genreID;
    this.title = dataObj.title;
    this.author = dataObj.author;
    this.filePath = dataObj.filePath;
    this.index = dataObj.index;
    this.tags = dataObj.tags;
    this.duration = dataObj.duration;
    this.played = dataObj.played;
  }
}
