import { isObject, isString, isEmpty } from "lodash";
import { Map } from "immutable";
// import Router from "next/router";
import Model, { CRUD, entity } from "./model";
import { action } from "../redux/actions";

import {take, fork, select, call } from "redux-saga/effects";
// import { IOptions } from "../data";
// import { IRoles, ROLE } from "../../server/acl/types";

const REGISTER_USER = "REGISTER_USER";
const FORGOT_PASSWORD = "FORGOT_PASSWORD";
const CHECK_EMAIL = "CHECK_EMAIL";
const FETCH_USERS = "FETCH_USERS";

const SAVE_USER = "SAVE_USER";
const FIND_BY_EMAIL = "FIND_BY_EMAIL";
const CHANGE_PASSWORD = "CHANGE_PASSWORD";

export const ITEMS_PER_PAGE = 25;

export const registerUser = ( data ) => action(REGISTER_USER, data);
export const forgotPassword = ( { userEmail } ) => action(FORGOT_PASSWORD, { userEmail });
export const checkEmail = ( email ) => action(CHECK_EMAIL, { email });

export const saveUser = ( user ) => action(SAVE_USER,  user );
export const changePassword = ( user ) => action(CHANGE_PASSWORD,  user );
export const fetchUsers = ( params ) => action(FETCH_USERS, params );
export const findByEamil = ( email )  => action(FIND_BY_EMAIL, { email });

@entity("users")
class User extends Model {

    constructor() {
        super();

        Model.addSaga(
            this.watchRegisterUser.bind(this),
            this.watchForgotPassword.bind(this),
            this.watchSaveUser.bind(this),
            this.whatchCheckEmail.bind(this),
            this.whatchFetchUsers.bind(this),
            this.findByEmail.bind(this),
            this.watchChangePassword.bind(this),
        );
    }

    public avatarUrl(user: Map<string, Object>, file = "") {
        let result = "/upload/file?s=&f=&d=user.png";
        if (isString(user) && !isEmpty(user) && !isEmpty(file)) {
            result = `/upload/file?s=${user}&f=${file}&d=user.png`;
        } else if (isObject(user) && user.has("secret") && user.has("avatar")) {
            result = `/upload/file?s=${user.get("secret")}&f=${user.get("avatar")}&d=user.png`;
        }
        return result;
    }

    public displayName(user: Map<string, Object>) {
        if (user) {
            const firstName = user.get("firstName") ? user.get("firstName") : "";
            const lastName = user.get("lastName") ? user.get("lastName") : "";
            return firstName + " " + lastName;
        }
        return "";
    }

    // public find(data) {
    //     return this
    //         .fetch("/api/user", { entity: "users", method: "POST", cashed: true} , data)
    //         .then(response => {
    //             if (response.hasOwnProperty("entities") &&
    //                 response.entities.hasOwnProperty("users")) {
    //                     return Object.values(response.entities.users);
    //             } else {
    //                 return Promise.reject("no users");
    //             }
    //         });
    // }

    public * whatchFetchUsers() {
        const func = this.request("/api/user", {method: "POST"}).bind(this);
        while (true) {
            const params = yield take(FETCH_USERS);
            yield call(this.pageEntity, func, params);
        }
    }

    public * watchRegisterUser() {
        const func = this.submit("register", "/auth/register", "POST").bind(this);
        while (true) {
            const data = yield take(REGISTER_USER);
            yield fork(func, {
                userEmail: data.userEmail,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                timezone: data.timezone,
                role: data.role,
                isAdminCreate: data.isAdminCreate,
            });
            if (data.isAdminCreate) {
                // const href = `/profile?email=${data.userEmail}`;
                // Router.replace(href, href, { shallow: true });
            }
        }
    }

    public * watchForgotPassword() {
        const func = this.submit("forgot", "/auth/forgot", "POST").bind(this);
        while (true) {
            const data = yield take(FORGOT_PASSWORD);
            yield fork(func, {
                userEmail: data.userEmail,
            });
            // Router.replace("/");
        }

    }

    public * whatchCheckEmail() {
        const func = this.submit("check", "/auth/check", "POST").bind(this);
        while (true) {
            const { email } = yield take(CHECK_EMAIL);
            yield fork(func, { userEmail: email });
        }
    }

    public * watchSaveUser() {
        const func = this.request("/api/user", {method: "PUT", crud: CRUD.UPDATE}).bind(this);

        while (true) {
            const data = yield take(SAVE_USER);
            console.log("user saved", data);
            yield fork(func, data);
        }
    }

    public * watchChangePassword() {
        const func = this.submit("changePassword", "/api/password", "PUT").bind(this);

        while (true) {
            const data = yield take(CHANGE_PASSWORD);
            yield fork(func, data);
        }
    }

    public * findByEmail() {
        const func = this.request("/api/user", {method: "POST"}).bind(this);
        while (true) {
            const { email } = yield take(FIND_BY_EMAIL);
            const entities = yield select((state: any) => state.entities);
            const user = entities.get("users").find(u => u.get("userEmail") === email);

            if (!user) {
                yield call(func, {
                    page: 1,
                    perPage: 1,
                    filter: {
                        userEmail: email,
                    },
                });
            }
        }
    }
}

const user = new User();
export default user;