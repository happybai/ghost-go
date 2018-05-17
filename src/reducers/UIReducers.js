// import reduceReducers from 'reduce-reducers';
import Auth from '../common/Auth';

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

const uiReducers = createReducer({
  auth: new Auth(),
  sidebar: { collpased: false },
  puzzleFilter: { open: false },
  kifuFilter: { open: false },
  dashboardFilter: { open: false },
}, {
  TOGGLE_SIDEBAR: state => ({ ...state, sidebar: { collpased: !state.sidebar.collpased } }),
  OPEN_SIDEBAR: state => ({ ...state, sidebar: { collpased: false } }),
  CLOSE_SIDEBAR: state => ({ ...state, sidebar: { collpased: true } }),
  TOGGLE_PUZZLE_FILTER: state => ({ ...state, puzzleFilter: { open: !state.puzzleFilter.open } }),
  OPEN_PUZZLE_FILTER: state => ({ ...state, puzzleFilter: { open: true } }),
  CLOSE_PUZZLE_FILTER: state => ({ ...state, puzzleFilter: { open: false } }),
  TOGGLE_KIFU_FILTER: state => ({ ...state, kifuFilter: { open: !state.kifuFilter.open } }),
  OPEN_KIFU_FILTER: state => ({ ...state, kifuFilter: { open: true } }),
  CLOSE_KIFU_FILTER: state => ({ ...state, kifuFilter: { open: false } }),
  TOGGLE_DASHBOARD_FILTER: state => (
    { ...state, dashboardFilter: { open: !state.dashboardFilter.open } }),
  OPEN_DASHBOARD_FILTER: state => ({ ...state, dashboardFilter: { open: true } }),
  CLOSE_DASHBOARD_FILTER: state => ({ ...state, dashboardFilter: { open: false } }),
});

// const uiReducers = reduceReducers(sidebarCollpase);

export default uiReducers;
