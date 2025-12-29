type Listener = () => void;

interface ApiKeyState {
  apiKey: string | null;
  isValidated: boolean;
  validationError: string | null;
  selectedModel: string;
}

class ApiKeyStore {
  private state: ApiKeyState = {
    apiKey: null,
    isValidated: false,
    validationError: null,
    selectedModel: "gemini-2.5-flash",
  };

  private listeners = new Set<Listener>();

  getState(): ApiKeyState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  setApiKey(apiKey: string | null) {
    this.state = { ...this.state, apiKey };
    this.notify();
  }

  setIsValidated(isValidated: boolean) {
    this.state = { ...this.state, isValidated };
    this.notify();
  }

  setValidationError(error: string | null) {
    this.state = { ...this.state, validationError: error };
    this.notify();
  }

  setSelectedModel(model: string) {
    this.state = { ...this.state, selectedModel: model };
    this.notify();
  }
}

export const apiKeyStore = new ApiKeyStore();

