import Model from "./model";
import { action } from "../redux/actions";
import { call, take, put } from "redux-saga/effects";

import { loadSettings } from "./settings";
import { fetchUsers, ITEMS_PER_PAGE } from "./user";
import User from "./user";

const LOAD_APP           = "LOAD_APP";
const LOAD_ADMIN_USERS_PAGE = "LOAD_ADMIN_USERS_PAGE";
const LOAD_PROFILE_PAGE     = "LOAD_PROFILE_PAGE";

export const loadApp = () => action(LOAD_APP, {});
export const loadAdminUsersPage = () => action(LOAD_ADMIN_USERS_PAGE, {});
export const loadProfilePage = (email, id) => action(LOAD_PROFILE_PAGE, { email, id });

class Pages extends Model {

    constructor() {
        super();

        Model.addSaga(
            this.watchLoadApp.bind(this),
            this.watchAdminUsers.bind(this),
            this.watchLoadProfile.bind(this),
        );
    }

    public * watchLoadApp() {
        while (true) {
            yield take(LOAD_APP);
            yield put(loadSettings());
        }
    }

    public * watchAdminUsers() {
        while (true) {
            yield take(LOAD_ADMIN_USERS_PAGE);
            yield put(fetchUsers({
                    page: 1,
                    perPage: ITEMS_PER_PAGE,
                }),
            );
        }
    }

    public * watchLoadProfile() {
        const getUserEmail = User.request("/api/user", {method: "GET"}).bind(this);
        while (true) {
            const { email, id } = yield take(LOAD_PROFILE_PAGE);
            let params = null;
            if (id) {
                params = { id: id };
            } else {
                params = { userEmail: email };
            }
            // get user by email
            yield call(getUserEmail, params);
            // const users = yield select(state => state.entities.get('users'));
            // const user = users.find(u => (u.get('userEmail') === email) || (u.get('id') === id));
        }
    }

}

const pages = new Pages();
export default pages;