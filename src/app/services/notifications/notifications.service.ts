import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from 'src/app/services/notifications/NotificationClass';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private errorMessage = "";

  private notificator$ = new Subject<Notification>();
  private errorMessage$ = new Subject<string>();

  showNotification(notif: Notification) {
    this.notificator$.next(notif);
  }

  getNewNotificator$(): Observable<Notification> {
    return this.notificator$.asObservable();
  }

  getErrorModal$(): Observable<string> {
    return this.errorMessage$.asObservable();
  }

  showErrorModal(message: string) {
    this.errorMessage = message;
    this.errorMessage$.next(this.errorMessage);
  }

}
