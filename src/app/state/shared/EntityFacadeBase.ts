import { Observable } from "rxjs";
import { first, flatMap, tap } from "rxjs/operators";
import { IEntityFacade } from "@briebug/ngrx-auto-entity/lib/util";
import { Store } from "@ngrx/store";
import { Back, Forward, Go, NavigatePayload } from "../router/router.actions";
import { AppState } from "../app.state";

export const getAll$ = <T>(facade: IEntityFacade<T>): Observable<T[]> => {
    return facade.ids$.pipe(
        first(),
        tap(countries => {
            if (countries.length == 0) {
                console.log("loading loading loading");
                facade.loadAll()
            }
        }),
        flatMap(ignored => facade.all$)
    )
};

export const back = <T>(store:Store<AppState>): void => {
    store.dispatch(new Back())
};


export const forward = <T>(store:Store<AppState>): void => {
    store.dispatch(new Forward())
};

export const navigate = <T>(store:Store<AppState>, payload: NavigatePayload): void => {
    store.dispatch(new Go(payload))
};