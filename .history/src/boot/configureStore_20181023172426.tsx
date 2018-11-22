// import devTools from "remote-redux-devtools";
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from "../redux/reducers";
import { saga } from "../models";
import Model from "../models/model";

import createSagaMiddleware, { END } from "redux-saga";
import { persistStore } from "redux-persist";
// import reducer from "../reducers";

const initialState = {};
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export default function configureStore(onCompletion: () => void): any {
    const enhancer = compose(
      composeWithDevTools(applyMiddleware(...middleware))
    );

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  store["runSaga"] = sagaMiddleware.run;
  store["close"] = () => store.dispatch(END);
  store["runSaga"](saga);
  Model.store = store;

  persistStore(store, onCompletion);

  return store;
}
