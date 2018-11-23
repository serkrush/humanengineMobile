import Model from "./model";
import Auth from "../auth";
import { action } from "../redux/actions";
import { take, call, fork, cancelled } from "redux-saga/effects";
import NavigationService from "../NavigationService";

const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER";
const VERIFY_ACCOUNT = "VERIFY_ACCOUNT";

export const loginUser = ( data ) => action(LOGIN_USER, data);
export const logoutUser = () => action(LOGOUT_USER, {});
export const verifyAccount = ( code ) => action(VERIFY_ACCOUNT,  { code } );

class Identity extends Model {

    constructor() {
        super("identity");

        this.authorize = this.authorize.bind(this);
        this.unauthorize = this.unauthorize.bind(this);

        Model.addSaga(
            this.watchLoginUser.bind(this),
            this.watchLogoutUser.bind(this),
            this.watchVerifyAccount.bind(this),
        );
    }

    public * watchVerifyAccount() {
        const func = this.request("/auth/verify", {method: "POST"}).bind(this);
        while (true) {
            const code = yield take(VERIFY_ACCOUNT);
            yield fork(func, { code });
        }
    }

    public * watchLoginUser() {
        while (true) {
            const data = yield take(LOGIN_USER);
            yield fork(this.authorize, data);
        }
    }

    public * authorize({ userEmail, password, timezone }) {
        console.log('authorize');
        
        try {
            const func = this.submit("login", "/auth/login", "POST").bind(this);
            const { response } = yield call(func, { userEmail, password, timezone });
            if (response && response.entities && response.entities.hasOwnProperty("identity")) {
                const user = response.entities.identity.user;
                console.log('user identity', user);
                
                if (user) {
                    yield call(Auth.init, user);
                    NavigationService.navigate("Drawer", {});
                }
            }
        } finally {
            if (yield cancelled()) {
                console.log("authorize yield cancelled");
            }
        }
    }

    public * watchLogoutUser() {
        while (true) {
            yield take(LOGOUT_USER);
            yield fork(this.unauthorize);
        }
    }

    public * unauthorize() {
        try {
            const func = this.request("/auth/logout", {method: "GET"}).bind(this);
            const { response } = yield call(func);
            if (response && response.entities && response.entities.hasOwnProperty("identity")) {
                const user = response.entities.identity.user;
                if (user) {
                    yield call(Auth.deauthenticateUser);
                    yield call(Auth.init, user);
                }
            }
        } finally {
            if (yield cancelled()) {
                console.log("authorize yield cancelled");
            }
        }
    }
}

const identity = new Identity();
export default identity;