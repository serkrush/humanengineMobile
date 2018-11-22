import { Action } from "redux";
import Model from "../models/model";

export const SEND_MESSAGE       = "SEND_MESSAGE";
export const RESET_MESSAGE      = "RESET_MESSAGE";
export const CLEAR_CACHE        = "CLEAR_CACHE";
export const PAGE_FETCHING      = "PAGE_FETCHING";
export const SET_FLAGGER        = "SET_FLAGGER";

export const CREATE             = "CREATE";
export const READ               = "READ";
export const UPDATE             = "UPDATE";
export const DELETE             = "DELETE";
export const CLEAR              = "CLEAR";

export const REQUEST = "REQUEST";
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";

export function action(type, payload = {}): Action {
    return {type, ...payload};
}

export function actionRequest(entity: Model) {
    const glob = { entity };
    const name = entity.entityName.toUpperCase();
    return {
        request: (data) => action(`${name}_${REQUEST}`, { glob, data } ),
        success: (data, response) => action(`${name}_${SUCCESS}`, { glob, data, response } ),
        failure: (data, error) => action(`${name}_${FAILURE}`, { glob, data, error }),
    };
}

export function entityRequest(entity: Model) {
    return [CREATE, READ, UPDATE, DELETE].reduce((acc, method) => {
        const pref = `${entity.entityName.toUpperCase()}_${method}`;
        const glob = { entity, method };
        acc[method] = {
            request: (data) => action(`${pref}_${REQUEST}`, { glob, data } ),
            success: (data, response) => action(`${pref}_${SUCCESS}`, { glob, data, response } ),
            failure: (data, error) => action(`${pref}_${FAILURE}`, { glob, data, error }),
        };
        return acc;
    }, {});
}

export const sendMessage = message => action(SEND_MESSAGE, { message } );
export const resetMessage = () => action(RESET_MESSAGE, {} );

export const pageFetching = (entity, page, done, force = false) => action(PAGE_FETCHING, { entity, page, done, force } );
export const clearCache = (entity) => action(CLEAR_CACHE, { entity });

export const setFlagger = (key, value) => action(SET_FLAGGER, {key, value} );