import { faBell } from '@fortawesome/free-solid-svg-icons';

export class Notification {
  title: string;
  body: string;
  icon: string;
  since: string = 'Ahora';
  bodyClass: string;

  constructor(
    body: string,
    {
      title = 'Notificación',
      icon = 'faBell',
      bodyClass = 'alert-success',
      since = 'Ahora',
    }
  ) {
    this.body = body;
    this.title = title;
    this.icon = icon;
    this.since = since;
    this.bodyClass = bodyClass;
  }

  set isError(option: boolean) {
    this.icon = 'faExclamationTriangle';
  }

  set isSucces(option: boolean) {
    this.icon = 'faCheckSquare';
  }

  set isInfo(option: boolean) {
    this.icon = 'faInfoCircle';
  }
}
