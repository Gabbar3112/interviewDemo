import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signIn: any = {};
  fpass: any = {};
  display = 'none';

  constructor(
    private notification: NotificationService,
    private customerService: CustomerService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onLogin() {
    console.log('res', this.signIn);
    this.customerService.userLogin(this.signIn)
      .subscribe((res) => {
        console.log('res', res.data);
        const that = this;
        this.notification.showSuccess('User Login Successfully..!', 'success');
        localStorage.setItem('token', res.data.tokens.authToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('user_id', (res.data.user.user_id));
        this.router.navigate(['/dashboard']);
      }, (err) => {
        console.log('err', err);
        this.notification.showError(err.error.message, 'error');
      });
  }

}
