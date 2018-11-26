import Model, { CRUD }  from "./model";
import { action, pageFetching } from "../redux/actions";
import { call, select, put, take, fork } from "redux-saga/effects";

const LOAD_WORKOUTS_USER = "LOAD_WORKOUTS_USER";
const FETCH_WORKOUTS = "FETCH_WORKOUTS";
const FIND_BY_ID = "FIND_BY_ID";
const CHANGE_WORKOUTS = "CHANGE_WORKOUTS";

export const ITEMS_PER_PAGE = 25;

export const loadWorkoutsUser = () => action(LOAD_WORKOUTS_USER,  {} );
export const fetchWorkouts = ( params ) => action(FETCH_WORKOUTS, params );
export const findById = ( id )  => action(FIND_BY_ID, { id });
export const changeWorkout = ( data )  => action(CHANGE_WORKOUTS, data);

class Workout extends Model {
    constructor() {
        super("workouts");
        Model.addSaga(
            this.watchLoadWorkoutsUser.bind(this),
            this.whatchFetchWorkouts.bind(this),
            this.findById.bind(this),
            this.watchChangeWorkout.bind(this),
        );
    }

    public * watchChangeWorkout() {
        const func = this.request("/api/workout", {method: "PUT", crud: CRUD.UPDATE}).bind(this);
        while (true) {
            const data = yield take(CHANGE_WORKOUTS);
            yield fork(func, data);
        }
    }

    public * watchLoadWorkoutsUser() {
        const func = this.request("/workout/user", {method: "POST", crud: CRUD.READ}).bind(this);

        while (true) {
            yield take(LOAD_WORKOUTS_USER);
            console.log('LOAD_WORKOUTS_USER mobile');
            yield call(this.request("/workout/public", {method: "POST", crud: CRUD.READ}).bind(this));
            yield call(func);
        }
    }

    public * whatchFetchWorkouts() {
        const func = this.request("/api/workout", {method: "POST"}).bind(this);
        while (true) {
            const params = yield take(FETCH_WORKOUTS);
            yield put(pageFetching(this.mEntityName, params.page, true));       // send event about starting page fetching

            const pagination = yield select((state: any) => state.pagination);         // check if this page already fetched
            if (!pagination.hasIn([this.mEntityName, "pages", params.page]) || params.force) {
                yield call(func, {
                    page: params.page,
                    perPage: params.perPage,
                    filter: params.filter,
                    sort: params.sort,
                });
            }
            yield put(pageFetching(this.mEntityName, params.page, false));      // send event about ending page fetching
        }
    }

    public * findById() {
        const func = this.request("/api/workout", {method: "POST"}).bind(this);
        while (true) {
            const { id } = yield take(FIND_BY_ID);
            const entities = yield select((state: any) => state.entities);
            const workout = entities.get("workouts").find(u => u.get("id") === id);
            if (!workout) {
                yield call(func, {
                    page: 1,
                    perPage: 1,
                    filter: {
                        _id: id,
                    },
                });
            }
        }
    }

    public getOptions(workouts: any) {
        const workoutSelect = [];
        workouts.forEach((workout, id) => {
            workoutSelect.push({
                label: workout.get("name").get("common"),
                value: id,
            });
        });
        return workoutSelect;
    }

}

const workout = new Workout();
export default workout;