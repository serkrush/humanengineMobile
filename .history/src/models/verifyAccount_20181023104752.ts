import Model, { entity } from "./model";
import { action } from "../redux/actions";
import { take, fork } from "redux-saga/effects";

const VERIFY = "VERIFY";

export const verifyAccount = ({ code }) => action(VERIFY,  { code } );

@entity("verifyAccount", { idAttribute: "code" })
class VerifyAccount extends Model {

    constructor() {
        super();

        Model.addSaga(
            this.verify.bind(this),
        );
    }

    public * verify() {
        const func = this.request("/verification", {method: "POST"}).bind(this);
        while (true) {
            const { code } = yield take(VERIFY);
            yield fork(func, { code });
        }
    }
}

const verAccount = new VerifyAccount();
export default verAccount;