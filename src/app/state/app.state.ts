import { IEntityState } from '@briebug/ngrx-auto-entity';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { IRouterStateUrl } from './shared/utils';
import { customerReducer } from '../+customers/slice-of-state/customer.state';
import { Customer } from 'app/+customers/slice-of-state/customer.model';
import { AuthState } from 'app/auth/store/auth.state';
import { authReducer } from 'app/auth/store/auth.reducer';

export interface IAppState {
  router: RouterReducerState<IRouterStateUrl>;
  auth: AuthState;
  customer: IEntityState<Customer>;
}

export type AppState = IAppState;

export const appReducer: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: authReducer,
  customer: customerReducer
};

export const appMetaReducers: Array<MetaReducer<AppState>> = !environment.production ? [storeFreeze] : [];
