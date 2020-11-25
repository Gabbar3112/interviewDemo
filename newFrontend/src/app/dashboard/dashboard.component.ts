import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
}) 
export class DashboardComponent implements OnInit {

  newArrival = [];

  constructor(private notification: NotificationService,
    private customerService: CustomerService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems() {
    // this.spinner.show();
    this.customerService.getAllItem()
      .subscribe((res) => {
        console.log('res', res);
        // this.spinner.hide();
        this.newArrival = res.data;
        console.log('newArrival', this.newArrival);
      }, (err) => {
        // this.spinner.hide();
        console.log('err', err);
      });
  }

  addToBtn(id, type) {
    const that = this;
    this.customerService.updateCart()
      .subscribe((wishListRes) => {
        console.log('updateCart res', wishListRes.data[0].whishListItems);
        this.productService.getProduct(productId)
          .subscribe((res) => {
            that.spinner.hide();
            console.log('getProduct res', res.data);
            const json = {
              product_id: res.data[0].product_id,
              name: res.data[0].name,
              images: res.data[0].images[0],
              product_price: res.data[0].productDetails[0].product_price,
              quantity: 1,
              color: res.data[0].productDetails[0].color[0],
              variant_unique_id: res.data[0].productDetails[0].unique_id,
              product_storage: res.data[0].productDetails[0].product_storage,
              total: res.data[0].productDetails[0].product_price,
            };

            if (res.data[0].productDetails[0].product_offer_price) {
              json['product_offer_price'] = res.data[0].productDetails[0].product_offer_price;
              json['total'] = res.data[0].productDetails[0].product_offer_price;
            }

            console.log('json', json);

            console.log('updateWishList res', wishListRes.data[0].whishListItems);
            const index = (wishListRes.data[0].whishListItems).findIndex((x) => x.product_id === json.product_id && x.variant_unique_id === json.variant_unique_id);
            console.log('index', index);
            if (index === -1) {
              wishListRes.data[0].whishListItems.push(json);
              console.log('updateWishList res', wishListRes.data[0].whishListItems);
              that.customerService.updateWishList({
                whishListItems: wishListRes.data[0].whishListItems,
                customer_id: localStorage.getItem('user_id')
              })
                .subscribe((res1) => {
                  that.spinner.hide();
                  console.log('updateWishList res', res1);
                  this.notification.showSuccess('Product Add Successfully..!', 'success');
                  // that.router.navigate(['/wishlist']);
                }, (err1) => {
                  that.spinner.hide();
                  console.log('updateWishList err', err1);
                  this.notification.showError('Product Not Added..!', 'error');
                  // that.router.navigate(['/wishlist']);
                });
            } else {
              // that.router.navigate(['/wishlist']);
            }

          }, (err) => {
            that.spinner.hide();
            console.log('err', err);
          });
      }, (err) => {
        console.log('err', err);
      });
  }

}
