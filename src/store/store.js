import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import { mainReducer } from "../reducers/mainReducer";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

/**
 * store receives just one reducer, so a combineReducer is the best choice.
 */
export const store = createStore(
    mainReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

