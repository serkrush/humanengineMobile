import Model, { CRUD }  from "./model";
import { action } from "../redux/actions";
import { take, call } from "redux-saga/effects";

const LOAD_TRAINING = "LOAD_TRAINING";

export const loadTraining = () => action(LOAD_TRAINING,  {} );

class Training extends Model {
    constructor() {
        super("training");
        Model.addSaga(
            this.watchLoadTraining.bind(this),
        );
    }

    public * watchLoadTraining() {
        const func = this.request("/training", {method: "POST", crud: CRUD.READ}).bind(this);

        while (true) {
            yield take(LOAD_TRAINING);
            console.log('call training');
            
            yield call(func);
        }
    }


//     fetch('https://mywebsite.com/endpoint/', {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     firstParam: 'yourValue',
//     secondParam: 'yourOtherValue',
//   }),
// });


    // public * authorize({ userEmail, password, timezone }) {
    //     console.log('authorize');
        
    //     try {
    //         const func = this.submit("login", "/auth/login", "POST").bind(this);
    //         const { response } = yield call(func, { userEmail, password, timezone });
    //         if (response && response.entities && response.entities.hasOwnProperty("identity")) {
    //             const user = response.entities.identity.user;
    //             if (user) {
    //                 yield call(Auth.init, user);
    //                 NavigationService.navigate("Drawer", {});
    //             }
    //         }
    //     } finally {
    //         if (yield cancelled()) {
    //             console.log("authorize yield cancelled");
    //         }
    //     }
    // }

}

const training = new Training();
export default training;