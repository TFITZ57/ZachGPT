import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export async function streamMessage(messages: string, speed: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: JSON.parse(messages), speed }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error in streamMessage:', error);
    throw error;
  }
}