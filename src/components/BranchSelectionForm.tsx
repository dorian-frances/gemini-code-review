import { Action, ActionPanel, Form, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

export type BranchSelection = {
  currentBranch: string;
  targetBranch: string;
}

type Props = {
  readonly onSubmit: () => void;
}

export function BranchSelectionForm({onSubmit}: Props) {
  const [branches, setBranches] = useCachedState<string[]>("local-branches", []);
  const [branchSelectionState, setBranchSelectionState] = useCachedState<BranchSelection>("branche-selection-state", {
    currentBranch: "",
    targetBranch: "main"
  })

  return <Form actions={
    <ActionPanel>
      <Action.SubmitForm title={"Submit"} onSubmit={onSubmit}/>
    </ActionPanel>
  }>
      <Form.Dropdown id={"local-branch"} title={"Current branch"} info={"The branch where lies the code you want to be reviewed"} onChange={(newValue) => {
        setBranchSelectionState({...branchSelectionState, currentBranch: newValue})
      }}>
        {branches.map((branch) => (
          <Form.Dropdown.Item key={branch} value={branch} title={branch} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id={"target-branch"} title={"Target branch"} info={"The branch on which you reviewed code would be merged"} defaultValue={branchSelectionState.targetBranch} onChange={(newValue) => {
        setBranchSelectionState({...branchSelectionState, targetBranch: newValue})
      }}>
        {branches.map((branch) => (
          <Form.Dropdown.Item key={branch} value={branch} title={branch} />
        ))}
      </Form.Dropdown>
    </Form>
}
