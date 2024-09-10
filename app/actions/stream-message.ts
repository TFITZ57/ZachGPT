import { StreamingTextResponse, LangChainStream } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export async function streamMessage(chatHistory: string) {
  const { stream, handlers } = LangChainStream();
  const llm = new ChatOpenAI({ streaming: true });

  const messages = JSON.parse(chatHistory).map((msg: ChatMessage) =>
    msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  );

  llm.call(messages, {}, [handlers]);

  return new StreamingTextResponse(stream);
}