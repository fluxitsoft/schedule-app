import { types } from "../types/types";

const initialState = {
    validating: true,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.authLogin:
            return {
                ...state,
                ...action.payload,
                validating: false,
            }

        case types.authValidated:
            return {
                ...state,
                validating: false,
            }

        case types.authLogout:
            return {
                validating: false,
            }

        default:
            return state;
    }
}