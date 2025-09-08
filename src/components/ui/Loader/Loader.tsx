export const Loader: React.FC = () => {
  return (
    <div className="text-center text-white/80 animate-pulse flex items-center justify-center gap-2">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
    <div
      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    ></div>
    <div
      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <span className="ml-2">Bot is generating response...</span>
  </div>
  )
}
