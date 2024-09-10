import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export async function streamMessage(messages: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in the environment');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: JSON.parse(messages),
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in streamMessage:', error);
    throw error;
  }
}