import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { dareAnimations } from '@dare/animations';
import { Customer } from 'app/+customers/slice-of-state/customer.model';
import { CustomerFacade } from 'app/+customers/slice-of-state/customer.facade';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  animations   : dareAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CustomersComponent implements OnInit, OnDestroy {

  customers$: Observable<Customer[]>;
  filterParent: String;
  isLoading: boolean;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private customerFacade: CustomerFacade) {
    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.customerFacade.loadAll();
    this.customerFacade.isLoading$.subscribe(data => {
      this.isLoading = data
    });
    this.customers$ = this.customerFacade.getAll$();

  }

  onDelete(customer: Customer) {
    this.customerFacade.delete(customer);
  }

  onEdit(customer: Customer) {
    this.customerFacade.select(customer);
    this.router.navigate(['customers', customer.id]);
  }

  parentFilter(filter: string) {
    this.filterParent = filter;
  }

}
