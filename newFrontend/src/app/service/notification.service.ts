import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService) { }

  showSuccess(msg, type) {
    this.toastr.success( msg, '', {
      closeButton: true,
      disableTimeOut: false,
      timeOut: 5000,
      toastClass: 'alert alert-' + type + ' alert-with-icon',
      positionClass: 'toast-top-center'
    });
  }
  showError(msg, type) {
    this.toastr.error(msg, '', {
      closeButton: true,
      disableTimeOut: false,
      timeOut: 5000,
      toastClass: 'alert alert-' + type + ' alert-with-icon',
      positionClass: 'toast-top-center'
    });
  }
}
