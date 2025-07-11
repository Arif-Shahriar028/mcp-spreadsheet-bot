import OpenAI from "openai"

export interface LLMProvider {
  choiceTools(
    messages: any[],
    tools: any[],
  ): Promise<any>

  generateFinalResponse(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], onToken: (token: string) => void): Promise<string>
}