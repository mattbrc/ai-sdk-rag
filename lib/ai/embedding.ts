import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const embeddingModel = openai.embedding('text-embedding-ada-002');

// experiment with different chunking techniques as best technique is dependent on the use case
// This function will take an input string and split it by periods, filtering out any empty items. 
// This will return an array of strings.
const generateChunks = (input: string) => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '')
}

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}