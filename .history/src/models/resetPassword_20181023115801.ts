import Model from "./model";
import { action } from "../redux/actions";
import { take, fork } from "redux-saga/effects";

const RESET_PASSWORD = "RESET_PASSWORD";
const LOAD_RESET_PASSWORDS = "LOAD_SETTINGS";

export const loadResetPassword = ({ code }) => action(LOAD_RESET_PASSWORDS,  { code } );
export const resetPassword = ( { code, password } ) => action(RESET_PASSWORD, { code, password });

class ResetPassword extends Model {

    constructor() {
        super("resetPasswords", { idAttribute: "code" });

        // this.mSchema = new schema.Entity('resetPasswords', {}, {
        //     idAttribute: 'code'
        // });

        Model.addSaga(
            this.watchLoadResetPassword.bind(this),
            this.watchResetPassword.bind(this),
        );
    }

    public * watchResetPassword() {
        const func = this.submit("reset", "/auth/resetpass", "POST").bind(this);
        while (true) {
            const { code, password } = yield take(RESET_PASSWORD);
            yield fork(func, {
                code, password,
            });
            // Router.replace("/");
        }
    }

    public * watchLoadResetPassword() {
        const func = this.request("/auth/checkreset", {method: "POST"}).bind(this);
        while (true) {
            const { code } = yield take(LOAD_RESET_PASSWORDS);
            yield fork(func, { code });
        }
    }

}

const resPassword = new ResetPassword();
export default resPassword;