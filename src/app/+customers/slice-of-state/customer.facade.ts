import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { CustomerFacadeBase } from './customer.state';
import { back, getAll$ } from 'app/state/shared/EntityFacadeBase';
import { Observable } from 'rxjs';
import { Customer } from './customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerFacade extends CustomerFacadeBase {
  constructor(private store: Store<AppState>) {
    super(Customer, store);
  }

  getAll$(): Observable<Customer[]> {
    return getAll$(this)
  }

  back() {
    back(this.store)
  }

}
