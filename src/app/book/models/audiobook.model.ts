export class Audiobook{
  id?: string;
  cateID?: string;
  trendID?: string;
  title: string;
  author?: string;
  imagePath: string;
  tags?: string;

  constructor(id: string, cateID: string, trendID: string, dataObj: { title: string, author: string, imagePath: string, tags: string }) {
    this.id = id;
    this.cateID = cateID;
    this.trendID = trendID;
    this.title = dataObj.title;
    this.author = dataObj.author;
    this.imagePath = dataObj.imagePath;
    this.tags = dataObj.tags;
  }
}
