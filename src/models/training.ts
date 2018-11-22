import Model, { CRUD }  from "./model";
import { action } from "../redux/actions";
import { take, fork } from "redux-saga/effects";

const LOAD_TRAINING = "LOAD_TRAINING";

export const ITEMS_PER_PAGE = 25;

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
            yield fork(func);
        }
    }

}

const workout = new Training();
export default workout;