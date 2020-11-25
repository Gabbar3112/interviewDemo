import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  api = environment.api;

  constructor(private http: HttpClient) {
  }

  userSignUp(data) {
    return this.http.post<any>(this.api + '/users/signUp', data);
  }

  userLogin(data) {
    return this.http.post<any>(this.api + '/users/login', data);
  }

  updateCart(data) {
    return this.http.post<any>(this.api + '/users/updateCart', data);
  }

  getAllItem() {
    return this.http.get<any>(this.api + '/products/getAllProducts');
  }
}
