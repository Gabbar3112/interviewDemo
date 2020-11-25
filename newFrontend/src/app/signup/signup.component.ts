import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { CustomerService } from '../service/customer.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUp: any = {};
  disable = false;
  display = 'none';
  menu = 'tc';
  diplayCondition = '';
  tc = '';
  agreementToTerms = '';
  privacyPolicy = '';
  privacyPolicy1 = '';
  returnPolicy = '';
  disclamer = '';
  invalid = false;

  constructor(
    private router: Router,
    private notification: NotificationService,
    private customerService: CustomerService,) { }

  ngOnInit(): void {
  }

  onSignUp() {
    console.log('his.signUp', this.signUp);
    console.log('password', this.signUp, this.signUp.password, this.signUp.confirmpassword);

    if (this.signUp.password !== this.signUp.confirmpassword) {
      this.invalid = true;
      // this.notification.showError('Confirm Password is not match', 'error');
    } else {
    this.customerService.userSignUp(this.signUp)
      .subscribe((res) => {
        this.notification.showSuccess('User Register Successfully..!', 'success');
        console.log('res', res);
        this.signUp = {
          role: 'customer'
        };
        this.router.navigate(['/login']);
      }, (err) => {
        this.signUp = {
          role: 'customer'
        };
        console.log('err', err);
        this.notification.showError(err.error.message, 'error');
      });
    }
  }

  onConfirmPassword() {
    console.log('password', this.signUp, this.signUp.password, this.signUp.confirmpassword);

    if (this.signUp.password !== this.signUp.confirmpassword) {
      this.invalid = true;
      // this.notification.showError('Confirm Password is not match', 'error');
    }
  }

}
