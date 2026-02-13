export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface UseGeminiOptions {
  temperature?: number;
  maxTokens?: number;
  onSuccess?: (response: string) => void;
  onError?: (error: string) => void;
}

export interface UseGeminiReturn {
  response: string | null;
  loading: boolean;
  error: string | null;
  generateText: (prompt: string) => Promise<void>;
  reset: () => void;
}