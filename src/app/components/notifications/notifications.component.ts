import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Modal, Toast } from 'bootstrap';
import { Notification } from 'src/app/services/notifications/NotificationClass';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  @ViewChild('containerEl') notifyContainer!: ElementRef;

  @ViewChild('modalError') modalError!: ElementRef;

  icons = fas;

  errorMessage = '';

  notifications: Array<Notification> = [];

  // Create an observer instance linked to the callback function
  private mutuationObserver = new MutationObserver(this.showNewNotification);

  constructor(private notifService: NotificationsService) {}

  ngOnInit() {
    // suscribe to notification service
    this.notifService.getNewNotificator$().subscribe((notification) => {
      // add the new notification to the array
      this.notifications.push(notification);
      // observe the DOM until the new element is added to
      this.mutuationObserver.observe(this.notifyContainer.nativeElement, {
        childList: true,
      });
    });

    // suscribe for error notifications
    this.notifService
      .getErrorModal$()
      .subscribe((errMessage) => this.showErrorModal(errMessage));
  }

  /**
   * call this function to show a notification trougt the notification component
   * @param errorMessage String to be displayed in modal window as error
   */
  showErrorModal(errorMessage: string): void {
    this.errorMessage = errorMessage;
    if (this.errorMessage != '') {
      // show the modal window
      const modal = new Modal(this.modalError.nativeElement);
      modal.show();
    }
  }

  /**
   * function called only by the close event in the modal window
   */
  removeErrorMessage(): void {
    this.errorMessage = '';
  }

  /**
   * Function called when the notification is closed, to remove it from de model
   * @param evt
   */
  removeNotification(evt: Event) {
    this.notifications.shift();
  }

  /**
   *
   * @param mutationsList: list of the mutations for the container of notifications,
   */
  private showNewNotification(mutationsList: any) {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach((toatEl: HTMLElement) => {
        let toast = new Toast(toatEl);
        toast?.show();
      });

      // stop observing
      this.mutuationObserver?.disconnect();
    }
  }
}
