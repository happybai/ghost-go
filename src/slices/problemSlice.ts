import { RootState } from "slices";
import { buildGenericReducer } from "utils/reducers";

export const { asyncThunk: fetchProblems, slice: problemsSlice } =
  buildGenericReducer<any>({
    name: "problems/fetchProblems",
    endpoint: "/problems",
  });

export const { asyncThunk: fetchProblem, slice: problemSlice } =
  buildGenericReducer<any>({
    name: "problems/fetchProblem",
    endpoint: "/problems/:id",
  });

export const { asyncThunk: fetchProblemNext, slice: problemNextSlice } =
  buildGenericReducer<any>({
    name: "problems/fetchProblemNext",
    endpoint: "/problems/next",
  });

export const { asyncThunk: createRecord, slice: recordSlice } =
  buildGenericReducer<any>({
    name: "records/createRecord",
    endpoint: "/records",
    method: "POST",
    options: { useToken: true },
  });

export const selectProblems = (state: RootState) => state.problems;
export const selectProblem = (state: RootState) => state.problem;
