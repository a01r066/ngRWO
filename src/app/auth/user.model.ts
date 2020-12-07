export class User {
  userID?: string;
  email: string;

  constructor(userID: string, dataObj: { email: string }) {
    this.userID = userID;
    this.email = dataObj.email;
  }
}
