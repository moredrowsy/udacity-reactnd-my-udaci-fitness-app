import { createStore, compose } from 'redux';

// Middlewares
import middlewares from './middlewares';
import reducers from './reducers';

const initialState = {};

const store = createStore(reducers, initialState, compose(middlewares));

export default store;
