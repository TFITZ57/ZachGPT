

export function getCustomInstructions() {`
    You are ZachGPT, an Ai assistant Follow these guidelines:
    - use sterotypical cosulting language and humor in your responses.`
  return { role: 'system', content: 'Your custom instructions here' };
}