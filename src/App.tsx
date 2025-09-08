import Conversation from "./components/Conversation/Conversation";
import { useChat } from "./hooks/useChat";
import Bar from "./components/Bar/Bar";
import ChatInput from "./components/ChatInput/ChatInput";

import { Card } from "@/components/ui/Card/Card";
import { AI_MODEL } from "@/api/geminiService";
import { Loader } from "./components/ui/Loader/Loader";
import { detectLanguage } from "./utils/detectLanguage";

const selectedModel = AI_MODEL;

const App: React.FC = () => {

  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    file,
    handleFileSelection,
    numberOfPreviousMessagesAttached,
    setNumberOfPreviousMessagesAttached,
  } = useChat(selectedModel);

  const lastBotMsg = messages.length > 0 && messages[messages.length - 1].sender === 'bot' ? messages[messages.length - 1] : undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
     <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
      <Card className="h-full bg-white/10 border-white/20 shadow-2xl">
        <div className="flex flex-col h-full p-6 gap-6">
          <Bar
            numberOfPreviousMessagesAttached={numberOfPreviousMessagesAttached}
            setNumberOfPreviousMessagesAttached={
              setNumberOfPreviousMessagesAttached
            }
            currentLang={detectLanguage(lastBotMsg ? lastBotMsg.text : '')}
          />
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <Conversation messages={messages} />
            {isLoading && (<Loader />)}
          </div>
          <ChatInput
            sendMessage={sendMessage}
            selectedModel={selectedModel}
            clearChat={clearChat}
            isLoading={isLoading}
            handleFileSelection={handleFileSelection}
            file={file}
          />
        </div>
      </Card>
    </div>
    </div>
  );
}

export default App;
