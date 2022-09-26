import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Filter } from "../Filter/filters";

export const selectCountryFilters = createSelector(
    createFeatureSelector('filterEntries'),
    (state: Filter[]) => {
        var countryName = '';
        state.forEach(cN => countryName += cN.Country);
        return countryName;
    }
);