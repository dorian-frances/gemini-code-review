import { execSync } from "node:child_process";

const GIT_REPO_PATH = "/Users/dorianfrances/Projects/gemini-code-review";

export function runGitCommand(command: string): string {
  try {
    return execSync(command, {
      cwd: GIT_REPO_PATH, // Ensure all commands run in this repo
      stdio: "pipe",
    })
      .toString()
      .trim();
  } catch (error) {
    return `❌ Error executing Git command: ${command}`;
  }
}

export function getBranches(): string[] {
  return runGitCommand("git branch --format='%(refname:short)'").split("\n");
}

export function getGitDiff(currentBranch: string, targetBranch: string): string {
  return runGitCommand(`git diff ${targetBranch}..${currentBranch}`);
}