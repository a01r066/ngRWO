export class Album{
  id?: string;
  genreID?: string;
  trendID?: string;
  title: string;
  author?: string;
  imagePath: string;
  tags?: string;
  filePath?: string;

  constructor(id: string, genreID: string, trendID: string, dataObj: { title: string, author: string, imagePath: string, tags: string, filePath: string }) {
    this.id = id;
    this.genreID = genreID;
    this.trendID = trendID;
    this.title = dataObj.title;
    this.author = dataObj.author;
    this.imagePath = dataObj.imagePath;
    this.tags = dataObj.tags;
    this.filePath = dataObj.filePath;
  }
}
