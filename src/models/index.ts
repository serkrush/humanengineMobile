import { all } from "redux-saga/effects";

import Model from "./model";

import pages from  "./pages";
import user from "./user";
import identity from "./identity";
import settings from "./settings";
import country from "./country";

const saga = function* root() {
    yield all( Model.saga );
};

export {
    pages,
    user,
    identity,
    settings,
    country,
    saga,
};

