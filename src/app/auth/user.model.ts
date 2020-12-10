export class User {
  uid?: string;
  email: string;

  constructor(uid: string, dataObj: { email: string }) {
    this.uid = uid;
    this.email = dataObj.email;
  }
}
