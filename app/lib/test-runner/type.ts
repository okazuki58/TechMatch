export interface TestResultDetail {
  testName: string;
  passed: boolean;
  message: string;
}

export interface TestResultData {
  passed: boolean;
  score: number;
  details: TestResultDetail[];
}
