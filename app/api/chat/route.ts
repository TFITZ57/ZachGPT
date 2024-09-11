import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { getCustomInstructions } from '../../utils/customInstructions';
import { getRelevantContext } from '../../utils/contextRetrieval';

export const runtime = 'edge';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OPENAI_API_KEY is not set in the environment', { status: 500 });
  }

  const { messages } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const relevantContext = await getRelevantContext(messages[messages.length - 1].content);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        getCustomInstructions(),
        { role: 'system', content: `Additional context: ${relevantContext}` },
        ...messages
      ],
      stream: true,
      // Add temperature here
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in streamMessage:', error);
    return new Response('Error processing your request', { status: 500 });
  }
}