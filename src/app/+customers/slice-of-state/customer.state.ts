import { buildState, IEntityState } from '@briebug/ngrx-auto-entity';
import { Customer } from './customer.model';

export const { initialState, facade: CustomerFacadeBase } = buildState(Customer);
export function customerReducer(state = initialState): IEntityState<Customer> {
  return state;
}
