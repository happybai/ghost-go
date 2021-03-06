import {RootState} from 'slices';
import {buildGenericReducer} from 'utils/reducers';

export const {asyncThunk: fetchKifus, slice: kifusSlice} =
  buildGenericReducer<any>({
    name: 'kifus/fetchKifus',
    endpoint: '/kifus',
  });

export const {
  asyncThunk: fetchKifuIds,
  slice: kifuIdsSlice,
  request: kifuIdsRequest,
} = buildGenericReducer<any>({
  name: 'kifus/fetchkifuIds',
  endpoint: '/kifus/ids',
});

export const {
  asyncThunk: fetchKifu,
  slice: kifuSlice,
  request: kifuRequest,
} = buildGenericReducer<any>({
  name: 'kifus/fetchKifu',
  endpoint: '/kifus/:id',
});

export const selectKifus = (state: RootState) => state.kifus;
export const selectKifu = (state: RootState) => state.kifu;
