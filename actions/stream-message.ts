"use server";

import OpenAI from "openai";
import { OpenAIStream } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export async function streamMessage(messages: ChatMessage[]): Promise<{ output: ReadableStream<string> }> {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages.map(({ role, content }) => ({ role, content })),
    stream: true,
  });

  const textStream = OpenAIStream(stream);

  return {
    output: textStream,
  };
}