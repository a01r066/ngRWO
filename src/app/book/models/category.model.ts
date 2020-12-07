export class Category {
  id?: string;
  title: string;
  imagePath?: string;

  constructor(id: string, dataObj: { title: string, imagePath: string }) {
    this.id = id;
    this.title = dataObj.title;
    this.imagePath = dataObj.imagePath;
  }
}
