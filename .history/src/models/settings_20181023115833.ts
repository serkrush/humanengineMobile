import Model, { CRUD } from './model';
import { action } from '../redux/actions';
import { take, fork } from 'redux-saga/effects';

const SAVE_SETTINGS = 'SAVE_SETTINGS';
const LOAD_SETTINGS = 'LOAD_SETTINGS';

export const saveSettings = ( data ) => action(SAVE_SETTINGS,  data );
export const loadSettings = () => action(LOAD_SETTINGS,  {} );

class Settings extends Model {

    constructor() {
        super('settings');
        
        Model.addSaga(
            this.watchSaveSettings.bind(this),
            this.watchLoadSettings.bind(this)
        )
    }

    public * watchLoadSettings() {
        const func = this.request('/auth/settings', {method: 'GET', crud: CRUD.READ}).bind(this);
        while (true) {
            const data = yield take(LOAD_SETTINGS);
            yield fork(func, data);
        }
    }

    public * watchSaveSettings() {
        const func = this.submit('settings', '/api/settings', 'PUT').bind(this);
        while(true) {
            const { allowRegistration } = yield take(SAVE_SETTINGS);
            yield fork(func, {
                allowRegistration
            });
        }
    }
    
}

const settings = new Settings();
export default settings;