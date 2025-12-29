import { useSyncExternalStore } from "react";
import { apiKeyStore } from "../store/apiKeyStore";

export const useApiKey = () => {
  const state = useSyncExternalStore(
    (listener) => apiKeyStore.subscribe(listener),
    () => apiKeyStore.getState()
  );

  return {
    apiKey: state.apiKey,
    isValidated: state.isValidated,
    validationError: state.validationError,
    selectedModel: state.selectedModel,
    setApiKey: (key: string | null) => apiKeyStore.setApiKey(key),
    setIsValidated: (validated: boolean) => apiKeyStore.setIsValidated(validated),
    setValidationError: (error: string | null) => apiKeyStore.setValidationError(error),
    setSelectedModel: (model: string) => apiKeyStore.setSelectedModel(model),
  };
};


