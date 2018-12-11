import { LOAD_FAMILIES } from "./actions";

export const user = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, username: action.username, token: action.token };
    default:
      return state;
  }
};

export const families = (state = [], action) => {
  switch (action.type) {
    case LOAD_FAMILIES:
      return action.payload ? action.payload: state
    default:
      return state
  }
}

