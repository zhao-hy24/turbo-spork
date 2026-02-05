
import { GoogleGenAI, Type, LiveServerMessage, Modality, Blob } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

// Text Polishing logic
export const polishExpression = async (text: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please refine the following English expression to sound more natural and native-like. Provide the improved version and a brief explanation of the changes: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          refined: { type: Type.STRING },
          explanation: { type: Type.STRING },
          difficultyLevel: { type: Type.STRING }
        },
        required: ["original", "refined", "explanation"]
      }
    }
  });
  return JSON.parse(response.text);
};

// Vocabulary Generation
export const generateVocabularyList = async (topic: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a list of 5 essential English words related to the topic: "${topic}". Include definitions, phonetic symbols, and example sentences.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING },
            phonetic: { type: Type.STRING }
          },
          required: ["term", "definition", "example", "phonetic"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

// Audio Utils for Live API
export const encodePCM = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
