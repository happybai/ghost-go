export interface PrevieImageData {
  x300: String;
}

export interface ProblemsData {
  problems: [ProblemData];
}

export interface TagData {
  id: string;
  name: string;
}

export interface ProblemData {
  id: string;
  rank: string;
  whofirst: string;
  previewImgR1: PrevieImageData;
  rightCount: number;
  wrongCount: number;
  steps: string;
}

export interface ProblemQueryVar {
  last: number;
  tags: string;
  level: string;
}

export interface SettingVars {
  name: string;
  value: any;
}

export interface signinUserData {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export interface authData {
  signinUser: null | signinUserData;
}

export interface dashboardData {
  right: number;
  wrong: number;
  total: number;
  mostWrongList: ProblemData;
  recentList: ProblemData;
}

export interface SigninUserTypes {
  id: number;
  name: string;
  email: string;
}
