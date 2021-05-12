import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { eventsReducer } from "./eventsReducer";
import { uiReducer } from "./uiReducer";


/**
 * Reducers in the app should be added in here.
 */
export const mainReducer = combineReducers({
    ui: uiReducer,
    events: eventsReducer,
    auth: authReducer,
});