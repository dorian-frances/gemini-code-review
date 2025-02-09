import { Action, ActionPanel, Detail, List, showToast, Toast } from "@raycast/api";
import { AsyncState, useFetch } from "@raycast/utils";
import { GEMINI_API_KEY } from "./adapter/gemini-adapter";
import { GenerateContentResponse } from "@google/generative-ai";
import { useEffect, useState } from "react";
import { getBranches, getGitDiff } from "./adapter/git-command-adapter";

export default function Command() {
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [diff, setDiff] = useState<string>("Select a branch to see the diff");

  useEffect(() => {
    try {
      const branchList = getBranches();
      setBranches(branchList);
    } catch (error) {
      console.log(error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error fetching branches",
        message: "Make sure you are inside a Git repo.",
      });
    }
  }, []);

  const prompt = "Tell me something interesting about the history of AI";
  const { isLoading, data, error }: AsyncState<string> = useFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
      mapResult: (data: GenerateContentResponse) => {
        if (data !== undefined) {
          const candidateResponse = data.candidates?.at(0);
          if (candidateResponse !== undefined) {
            return { data: candidateResponse.content.parts[0].text ?? "Aucune réponse obtenue." };
          }
        }

        return {
          data: "Aucune réponse obtenue.",
        };
      },
    },
  );

  if (error) {
    showToast({ style: Toast.Style.Failure, title: "Erreur", message: error.message });
    return <Detail markdown="### ❌ Une erreur est survenue lors de la récupération des données." />;
  }

  function handleBranchSelection(branch: string) {
    const diffResult = getGitDiff(branch);
    setSelectedBranch(branch);
    setDiff(diffResult || "No changes found.");
  }

  if (selectedBranch) {
    return <Detail markdown={`## Diff for ${selectedBranch}\n\n\`\`\`diff\n${diff}\n\`\`\``} />;
  }

  return (
    <List>
      {branches.map((branch) => (
        <List.Item
          key={branch}
          title={branch}
          actions={
            <ActionPanel>
              <Action title="Show Diff" onAction={() => handleBranchSelection(branch)} />
            </ActionPanel>
          }
        ></List.Item>
      ))}
    </List>
  );
}
