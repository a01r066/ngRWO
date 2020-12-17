export class User {
  uid?: string;
  name?: string;
  email: string;
  imagePath?: string;

  constructor(uid: string, dataObj: { name: string, email: string, imagePath: string }) {
    this.uid = uid;
    this.name = dataObj.name;
    this.email = dataObj.email;
    this.imagePath = dataObj.imagePath;
  }
}
