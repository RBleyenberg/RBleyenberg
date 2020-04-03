import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { dareAnimations } from '@dare/animations';
import { Customer, CustomerID } from 'app/+customers/slice-of-state/customer.model';
import { CustomerFacade } from 'app/+customers/slice-of-state/customer.facade';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations   : dareAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CustomerComponent implements OnInit {
  
  customer$: Observable<Customer>;
  valid = false;

  private updatedCustomer: Customer;

  constructor(private activatedRoute: ActivatedRoute, private customerFacade: CustomerFacade) {}

  ngOnInit() {
    this.customer$ = this.activatedRoute.paramMap.pipe(
      filter(params => params.has('id')),
      map(params => +params.get('id') as CustomerID),
      tap(id => {
        this.customerFacade.selectByKey(id);
        this.hasCustomerWithIdInState(id)
        this.loadIfNotPresent(id);
      }),
      switchMap(() => this.customerFacade.current$)
    );
  }

  private loadIfNotPresent(id: CustomerID) {
    this.hasCustomerWithIdInState(id)
        .pipe(first())
        .subscribe(exists => {
            if (!exists) {
                this.customerFacade.load(id);
            }
        });
}

  hasCustomerWithIdInState(id: number): Observable<boolean> {
    return this.customerFacade.ids$.pipe(map((ids: number[]) => ids.indexOf(id) > -1));
  }

  onCustomerChange(payload: { customer: Customer; valid: boolean }) {
    this.valid = payload.valid;
    if (this.valid) {
      this.updatedCustomer = payload.customer;
    }
  }

  onSave() {
    if (!this.valid) {
      return;
    }

    if (this.updatedCustomer.id == null) {
      this.customerFacade.create(this.updatedCustomer);
    } else {
      this.customerFacade.update(this.updatedCustomer);
    }
  }

  back() {
    this.customerFacade.back()
  }

}
