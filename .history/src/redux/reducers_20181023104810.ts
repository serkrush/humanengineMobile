import isObject from "lodash/isObject";
import { fromJS } from "immutable";
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import * as ActionTypes from "./actions";

const initialEntities = fromJS({
    users: {},
    settings: {},
    resetPasswords: {},
    countries: {},
});

// Updates an entity cache in response to any action with response.entities.
function entities(state = initialEntities, action) {
    if (action.hasOwnProperty("glob")) {
        const { glob : { method, entity } } = action;
        switch (method) {
        case ActionTypes.DELETE:
            {
                let list = state.get(entity.entityName);
                list = list.remove(action.data.id);
                state = state.set(entity.entityName, list);
            }
            break;
        case ActionTypes.CLEAR:
            if (state.has(entity.entityName)) {
                state = state.set(entity.entityName, {});
            }
            break;
        default:
            if (action.response && action.response.entities) {
                const { response: { entities } } = action;
                state = entity.merge(state, entities);
            }
            break;
        }
    }
    return state;
}

const initialMessage = {
    text: "",
    code: 0,
    type: "",
};

function message(state = initialMessage, action) {
    const { type, error } = action;
    if (type === ActionTypes.RESET_MESSAGE) {
        return initialMessage;
    } else if (type === ActionTypes.SEND_MESSAGE) {
        return { ...action.message };
    } else if (isObject(error) && error.hasOwnProperty("text")) {
        return { ...action.error };
    }
    return state;
}

const initialCacheState = fromJS({
    users: {},
});

function cached(state = initialCacheState, action) {
    if (action.response && action.response.cach) {
        const { response: { cach } } = action;
        if (action.hasOwnProperty("glob") && state.has(action.glob.entity.entityName)) {
            let c = state.get(action.glob.entity.entityName);
            c = c.merge({ [cach.key]: cach.ids });
            state = state.set(action.glob.entity.entityName, c);
        }
    }
    const { type, entity } = action;
    if (type === ActionTypes.CLEAR_CACHE) {
        if (state.has(entity)) {
            state = state.set(entity, fromJS({}));
        }
    }
    return state;
}

const initialPagerState = fromJS({
    users: {
        currentPage: 1,
        fetching: false,
        count: 0,
        pages: {},
    },
    countries: {
        currentPage: 1,
        fetching: false,
        count: 0,
        pages: {},
    },
});

function pagination(state = initialPagerState, action) {
    // get result for the paginator, disable fetching
    if (action.response && action.response.pager) {
        const { response: { pager } } = action;
        if (action.hasOwnProperty("glob") && state.has(action.glob.entity.entityName)) {
            let pagination = state.get(action.glob.entity.entityName);
            pagination = pagination.set("currentPage", pager.page).set("count", pager.count);
            let pages = pagination.get("pages");
            let item = fromJS({
                ids: action.response.result,
            });
            pagination = pagination.set("pages", pages.set(pager.page, item));
            state = state.set(action.glob.entity.entityName, pagination);
        }
    }
    // prepare item for the paginator, enable fetching
    const { type } = action;
    if (type === ActionTypes.PAGE_FETCHING) {
        const { entity, page, done, force } = action;
        let pagination = state.get(entity).set("currentPage", page).set("fetching", done);
        if (force) {
            pagination = pagination.set("pages", fromJS({}));
        }
        state = state.set(entity, pagination);
    }
    return state;
}

const initialFlagger = {
};

function flagger(state = initialFlagger, action) {
    const { type } = action;
    if (type === ActionTypes.SET_FLAGGER) {
        return {
            [action.key] : action.value,
        };
    }
    return state;
}

const rootReducer = combineReducers({
    entities,
    form,
    cached,
    message,
    pagination,
    flagger,
});

export default rootReducer;