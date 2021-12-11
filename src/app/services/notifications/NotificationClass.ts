
export class Notification {

  title: string;
  body: string;
  icon: string = "faBell";
  since: string = "Ahora";
  bodyClass: string = "alert-success"

  constructor(title: string, body: string) {
    this.title = title;
    this.body = body
  }

  set isError(option: boolean) {
    this.icon = "faExclamationTriangle"
  }

  set isSucces(option: boolean) {
    this.icon = "faCheckSquare"
  }

  set isInfo(option: boolean) {
    this.icon = "faInfoCircle"
  }
}
