import Model, { CRUD, entity } from "./model";
import { action, pageFetching } from "../redux/actions";
import { call, select, put, take, fork } from "redux-saga/effects";

const LOAD_COUNTRIES = "LOAD_COUNTRIES";
const FETCH_COUNTRIES = "FETCH_COUNTRIES";
const FIND_BY_ID = "FIND_BY_ID";
const CHANGE_COUNTRY = "CHANGE_COUNTRY";

export const ITEMS_PER_PAGE = 25;

export const loadCountries = () => action(LOAD_COUNTRIES,  {} );
export const fetchCountries = ( params ) => action(FETCH_COUNTRIES, params );
export const findById = ( id )  => action(FIND_BY_ID, { id });
export const changeCountry = ( data )  => action(CHANGE_COUNTRY, data);

@entity("countries")
class Country extends Model {
    constructor() {
        super();
        Model.addSaga(
            this.watchLoadCountries.bind(this),
            this.whatchFetchCountries.bind(this),
            this.findById.bind(this),
            this.watchChangeCountry.bind(this),
        );
    }

    public * watchChangeCountry() {
        const func = this.request("/api/country", {method: "PUT", crud: CRUD.UPDATE}).bind(this);
        while (true) {
            const data = yield take(CHANGE_COUNTRY);
            yield fork(func, data);
        }
    }

    public * watchLoadCountries() {
        const func = this.request("/api/countries", {method: "GET", crud: CRUD.READ}).bind(this);
        while (true) {
            yield take(LOAD_COUNTRIES);
            yield fork(func);
        }
    }

    public * whatchFetchCountries() {
        const func = this.request("/api/country", {method: "POST"}).bind(this);
        while (true) {
            const params = yield take(FETCH_COUNTRIES);
            yield put(pageFetching(this.mEntityName, params.page, true));       // send event about starting page fetching

            const pagination = yield select((state: any) => state.pagination);         // check if this page already fetched
            if (!pagination.hasIn([this.mEntityName, "pages", params.page]) || params.force) {
                yield call(func, {
                    page: params.page,
                    perPage: params.perPage,
                    filter: params.filter,
                    sort: params.sort,
                });
            }
            yield put(pageFetching(this.mEntityName, params.page, false));      // send event about ending page fetching
        }
    }

    public * findById() {
        const func = this.request("/api/country", {method: "POST"}).bind(this);
        while (true) {
            const { id } = yield take(FIND_BY_ID);
            const entities = yield select((state: any) => state.entities);
            const country = entities.get("countries").find(u => u.get("id") === id);
            if (!country) {
                yield call(func, {
                    page: 1,
                    perPage: 1,
                    filter: {
                        _id: id,
                    },
                });
            }
        }
    }

    public getOptions(countries: any) {
        const countrySelect = [];
        countries.forEach((country, id) => {
            countrySelect.push({
                label: country.get("name").get("common"),
                value: id,
            });
        });
        return countrySelect;
    }

}

const country = new Country();
export default country;