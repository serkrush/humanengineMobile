import Model, { CRUD } from './model';
// import { fromJS } from 'immutable';
import { action } from '../redux/actions';
import { take, fork } from 'redux-saga/effects';
// import { Map } from 'immutable';


const LOAD_CATEGORIES = 'LOAD_CATEGORIES';

export const ITEMS_PER_PAGE = 25;

export const loadCategories = () => action(LOAD_CATEGORIES,  {} );

class Category extends Model {

    constructor() {
        super('categories');
        
        Model.addSaga(
            this.watchLoad.bind(this),
        )
    }

    public * watchLoad() {
        console.log('watchLoad');
        const func = this.request('/category', {method: 'GET', crud: CRUD.READ}).bind(this);
        while (true) {
            yield take(LOAD_CATEGORIES);
            yield fork(func);
        }
    }
    
}

const category = new Category();
export default category;