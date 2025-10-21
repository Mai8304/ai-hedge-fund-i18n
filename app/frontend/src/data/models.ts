import { api } from '@/services/api';

export interface LanguageModel {
  display_name: string;
  model_name: string;
  provider: "Anthropic" | "DeepSeek" | "Google" | "Groq" | "OpenAI";
}

// Cache for models to avoid repeated API calls
let languageModels: LanguageModel[] | null = null;
let loadingPromise: Promise<LanguageModel[]> | null = null;

/**
 * Get the list of models from the backend API
 * Uses caching to avoid repeated API calls
 */
export const getModels = async (): Promise<LanguageModel[]> => {
  if (languageModels && languageModels.length > 0) {
    return languageModels;
  }

  if (!loadingPromise) {
    loadingPromise = api.getLanguageModels()
      .then((fetchedModels) => {
        if (fetchedModels.length > 0) {
          languageModels = fetchedModels;
        }
        return fetchedModels;
      })
      .catch((error) => {
        console.error('Failed to fetch models:', error);
        throw error;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
};

/**
 * Get the default model (GPT-4.1) from the models list
 */
export const getDefaultModel = async (): Promise<LanguageModel | null> => {
  try {
    const models = await getModels();
    return models.find(model => model.model_name === "gpt-4.1") || models[0] || null;
  } catch (error) {
    console.error('Failed to get default model:', error);
    return null;
  }
};
