export const createWorkflow = async (workflowId: string, payload: unknown): Promise<string> => {
  console.log('try to create workflow with payload', payload);
  return `https://testURL/for/${workflowId}`;
};

export const cancelWorkflow = async (workflowId: string): Promise<void> => {
  console.log('cancel workflow', workflowId);
};
