// import md5 from "md5";
import { camelizeKeys } from "humps";
import { Store } from "redux";
import { fromJS, Map } from "immutable";
import fetch from "cross-fetch";
// import Router from "next/router";
import { normalize, Schema, schema } from "normalizr";
import { select, put, call, fork } from "redux-saga/effects";
import { startSubmit, stopSubmit, reset } from "redux-form";

import { pageFetching } from "../redux/actions";
import { sendMessage, actionRequest, entityRequest } from "../redux/actions";
import Auth from "../auth";
// import status from "../http-status";

export enum CRUD {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
}

export interface IFetchOptions {
    method: string;
    cashed?: boolean;
    crud?: CRUD;
}

export default class Model {
    protected mEntityName: string;
    protected mSchema: Schema;
    protected mIP: string;

    private static mStore: Store<any>;
    private static mSagas = [];

    /**
     * addSaga
     */
    protected static addSaga(...args: any[]) {
        args.forEach(item => {
            if (item instanceof Function)
                Model.mSagas.push(fork(item));
            },
        );
    }

    public get schema() {
        return this.mSchema ? this.mSchema : null;
    }

    /**
     * getWatchers
     */
    public static get saga() {
        return Model.mSagas;
    }

    public static get store() {
        return Model.mStore;
    }

    public get entityName() {
        return this.mEntityName;
    }

    public get IP() {
        return this.mIP;
    }

    public static set store(store: Store<any>) {
        Model.mStore = store;
    }

    constructor(name: string = null, definitions: any = {}, options:any = {}) {
        this.mEntityName = name;
        this.mIP = 'http://192.168.77.123:3030';
        this.mSchema = name && [ new schema.Entity(name, definitions, options) ];
        this.getAction = this.getAction.bind(this);
        this.callApi = this.callApi.bind(this);
        this.pageEntity =  this.pageEntity.bind(this);

    }

    protected async callApi(endpoint,  method = "GET", data = {}) {
        
        let fullUrl = endpoint;
        const params = {
            method,
            headers: {},
        };
        if (method !== "GET") {
            params["headers"]["content-type"] = "application/json";
            params["body"] = JSON.stringify(data);
        } else {
            let params = Object.entries(data).map(([key, val]) => key + "=" + val).join("&");
            fullUrl += ("?" + params);
        }
        if (await Auth.isUserAuthenticated()) {
            params["headers"]["Authorization"] = "bearer " + await Auth.getToken();
        }
        
        return fetch(this.mIP + fullUrl, params).then((response) => {
            return response.json().then((json) => ({ json, response }));
        },
        ).then(({ json, response }) => {
            if (!response.ok || !json.success) {
                json.status = response.status;
                return Promise.reject(json);
            }
            
            const entityData = json.hasOwnProperty("data") ? normalize(camelizeKeys(json.data), this.mSchema) : {};
            return  Promise.resolve({
                items: {
                    ...entityData,
                    pager: json.hasOwnProperty("pager") ? json.pager : null,
                },
                status: response.status,
                message: json.message,
            });
        }).then(
            (response) => ({
                response: response.items,
                message: {
                    type: "success",
                    code: response.status,
                    text: response.message || undefined,
                },
            }),
            (response) => ({
                message: {
                    type: "error",
                    code: response.status,
                    text: response.message || undefined,
                },
                form : {
                    ...response.errors || undefined,
                    _error: response.message || undefined,
                }}),
        );
    }

    private handleStatus(code) {
        switch (code) {
        // case status.UNAUTHORIZED: //
        //     // Router.replace("/error?code=" + code);
        //     break;

        default:
            break;
        }
    }

    protected * actionRequest(url, options: IFetchOptions, data: any = {} ) {
        const action = this.getAction(options.crud);
        yield put( action.request(data) );
        const {response, message} = yield call(this.callApi, url, options.method, data);
        if (response) {
            yield put( action.success(data, response) );
            if (message) {
                yield put ( sendMessage(message) );
            }
        } else {
            this.handleStatus(message.code);
            yield put( action.failure(data, message) );
        }
        return { response, message };
    }

    protected * submitRequest(action, apiFn, formId, data) {
        yield put( startSubmit(formId) );
        const {response, form, message } = yield call(apiFn, data);
        if (response) {
            yield put( action.success(data, response) );
            yield put( reset(formId) );
            yield put( stopSubmit(formId) );
            if (message) {
                yield put ( sendMessage(message) );
            }
        } else {
            this.handleStatus(message.code);
            yield put( action.failure(data, message) );
            yield put( stopSubmit(formId, form) );
        }
        return { response, message };
    }

    private getAction(crud: CRUD = null) {
        let action = actionRequest(this);
        switch (crud) {
            case CRUD.CREATE:
            action = entityRequest(this)["CREATE"];
            break;
            case CRUD.UPDATE:
            action = entityRequest(this)["UPDATE"];
            break;
            case CRUD.DELETE:
            action = entityRequest(this)["DELETE"];
            break;
            case CRUD.READ:
            action = entityRequest(this)["READ"];
            break;
        }
        return action;
    }

    public request(url: string, options: IFetchOptions) {
        return this.actionRequest.bind(this, url, options);
    }

    public submit(formId: string, url: string, method: string, crud: CRUD = null) {
        const action = this.getAction(crud);
        const apiCall = (data) => this.callApi(url, method, data);
        return this.submitRequest.bind(this, action, apiCall.bind(this), formId);
    }

    public getPagerItems(page: number = null) {
        if (Model.store) {
            const state = Model.store.getState();
            const pager = state.pagination;
            const entities = state.entities;
            if (pager.has(this.mEntityName) && entities.has(this.mEntityName)) {
                const pageNumber = page == undefined ? pager.getIn([this.mEntityName, "currentPage"]) : page;
                if (pager.hasIn([this.mEntityName, "pages", pageNumber, "ids"])) {
                    const users = entities.get(this.mEntityName);
                    const ids = pager.getIn([this.mEntityName, "pages", pageNumber, "ids"]);
                    return ids.map(id => users.get(id));
                }
            }
        }
        return fromJS([]);
    }

    /**
     * Override this method in case you need to have custom margin of entity with Redux store
     *
     * @param state state of redux before reducing
     * @param entities entities from the server
     */
    public merge(state: Map<string, any>, entities: any): Map<string, any> {
        return state.mergeDeep(entities);
    }

    public * pageEntity(func, params) {
        yield put(pageFetching(this.mEntityName, params.page, true, params.force));       // send event about starting page fetching

        const pagination = yield select((state: any) => state.pagination);         // check if this page already fetched
        if (!pagination.hasIn([this.mEntityName, "pages", params.page]) || params.force) {
            let count = 0;
            if (!params.force && pagination.hasIn([this.mEntityName, "count"])) {
                count = pagination.get(this.mEntityName).get("count");
            }
            yield call(func, {
                page: params.page,
                perPage: params.perPage,
                filter: params.filter,
                sort: params.sort,
                count,
            });
        }
        yield put(pageFetching(this.mEntityName, params.page, false));      // send event about ending page fetching
    }

}

export const watchers = Model.saga;
