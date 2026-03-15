export type RepoRowProps = {
  id: string;
  name: string;
  githubUrl: string;
  connectedAt: string;
  totalRuns: number;
  lastRunStatus: "passed" | "failed" | null;
  sparklineData: number[];
  onDelete: () => void;
};



export type RepoHealthCardProps = {
  id: string
  name: string
  githubUrl: string
  connectedAt: string
  totalRuns: number
  lastRunStatus: "passed" | "failed" | null;
  sparklineData: number[];
  locales: {
    country: string
    code: string
    flag: string
    coverage: number
  }[]
}

export type RepoRunProps = {
  id: string;
  name: string;
  commitSHA: string;
  githubUrl: string;
  totalLocales: number;
  totalErrors: number;
  runStatus: "passed" | "failed" | null;
  runTimeStamp: string;
  runId: string; // May actually be the same as the id
};
