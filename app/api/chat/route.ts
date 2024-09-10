import { convertToCoreMessages, streamText, tool } from 'ai';
import { registry } from '@/lib/ai/registry';
import { openai } from '@ai-sdk/openai';
import { createResource } from '@/lib/actions/resources';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'), // Make sure you're using a valid model name
    system: `You are a professional strength and conditioning coach with extensive experience in athletic performance enhancement. Your role is to provide expert advice on:

1. Workout programming and periodization
2. Exercise technique and form
3. Nutrition for performance and recovery
4. Injury prevention strategies
5. Sport-specific training methods
6. Recovery and regeneration techniques
7. Performance testing and assessment
8. Mental preparation and goal setting

Communicate in a motivating yet professional manner. Use technical terms when appropriate, but be prepared to explain them. Prioritize safety and proper progression in all advice. Tailor your responses to the individual's goals, experience level, and any mentioned limitations or injuries. When unsure about specific medical conditions or injuries, advise consulting with a healthcare professional.`,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: 'get information from your knowledge base to answer questions.',
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      })
    },
  });
 

  return result.toDataStreamResponse();
}
