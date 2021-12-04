import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { Modal } from 'bootstrap'

@Component({
  selector: 'app-connection-error',
  templateUrl: './connection-error.component.html',
  styleUrls: ['./connection-error.component.css']
})
export class ConnectionErrorComponent {

  _errorMessage = ""

  @ViewChild("modalError") modalError!: ElementRef;

  @Input() set errorMessage(value: string) {
    this._errorMessage = value;
    //show the modal window
    if (this.modalError) {
      const modal = new Modal(this.modalError.nativeElement);
      modal.show()
    }
  }
  get errorMessage() {
    return this._errorMessage
  }

}
