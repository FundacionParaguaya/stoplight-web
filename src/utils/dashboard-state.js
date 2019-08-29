import { useReducer } from 'react';
import { camelCase } from 'lodash';
import { SET_STATE, SET_LOADING, BEGIN_LOADING, LOADING } from './types';

export const setState = payload => ({
  type: SET_STATE,
  payload
});

export const setLoading = payload => ({
  type: SET_LOADING,
  payload
});

export const beginLoading = () => ({
  type: BEGIN_LOADING
});

// Camel case LOADING object and set to true
export const initialLoading = Object.fromEntries(
  LOADING.map(key => [camelCase(key), true])
);

export const dashboard = (state, action) => {
  switch (action.type) {
    case SET_STATE:
      // Camel case the type and assign the payload
      return { ...state, [camelCase(action.payload.key)]: action.payload.data };
    case SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [camelCase(action.payload.key)]: action.payload.loading
        }
      };
    case BEGIN_LOADING:
      return {
        ...state,
        loading: initialLoading
      };
    default:
      return state;
  }
};

const bindActionCreators = (actions, dispatch) => {
  if (Array.isArray(actions)) {
    return actions.map(a => payload => dispatch(a(payload)));
  }
  return payload => dispatch(actions(payload));
};

export const useDashboard = () => {
  const [state, dispatch] = useReducer(dashboard, { loading: initialLoading });

  return [
    state,
    ...bindActionCreators([setState, setLoading, beginLoading], dispatch)
  ];
};
