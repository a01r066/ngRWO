import { Component, OnInit } from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  showSuccess = false;

  public payPalConfig?: IPayPalConfig;

  amounts = [5, 10, 25, 50, 100, 500, 1000];
  selectedValue = 10;

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AQAN9djYVJl71fGqx2F0gfe34mhxcQswLaOfvZViTEydr4h-TMGgd35TU2QK_A623PSToxpK3uwVXcKt',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.selectedValue + '',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.selectedValue + ''
                }
              }
            },
            items: [
              {
                name: 'Donate For Hosting',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: this.selectedValue + '',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          // console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        // console.log('OnCancel', data, actions);
      },
      onError: err => {
        // console.log('OnError', err);
      },
      onClick: (data, actions) => {
        // console.log('onClick', data, actions);
      },
    };
  }

  onSelectAmount(amount: number){
    // console.log("Donate: " +amount);
    this.selectedValue = amount;
  }

  onValueChange(value: number){
    this.selectedValue = value;
  }
}
