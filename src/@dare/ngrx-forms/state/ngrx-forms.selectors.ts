import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NgrxForms } from './ngrx-forms.interfaces';

const getNgrxForms = createFeatureSelector<NgrxForms>('ngrxForms');
export const getStructure = createSelector(getNgrxForms, (state: NgrxForms) => state.structure);
export const getData = createSelector(getNgrxForms, (state: NgrxForms) => state.data);
export const isValid = createSelector(getNgrxForms, (state: NgrxForms) => state.valid);
export const getErrors = createSelector(getNgrxForms, (state: NgrxForms) => state.errors);
export const getTouchedForm = createSelector(getNgrxForms, (state: NgrxForms) => state.touched);

export const ngrxFormsQuery = {
  getStructure,
  getData,
  isValid,
  getErrors,
  getTouchedForm
};
