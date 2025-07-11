import OpenAI from 'openai';
import { LLMProvider } from '../LLMProvider.js';
export class OpenAIProvider implements LLMProvider {

  private openai: OpenAI
  
  constructor(){
      this.openai = new OpenAI({
        baseURL: "https://models.inference.ai.azure.com",
        // baseURL: "https://api.openai.com/v1",
        // apiKey: process.env.OPEN_API_KEY,
        apiKey: process.env.GITHUB_TOKEN
      })
    }
  
  public async choiceTools(messages: any[], tools: any[]): Promise<OpenAI.ChatCompletion.Choice[]> {
    // calling llm for tools
    let response =  await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 1000,
      messages,
      tools: tools
    });

    return response.choices
  }

  public async generateFinalResponse(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], onToken: (token: string) => void): Promise<string> {
    
    const stream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 1000,
      messages,
      stream: true
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if(content){
        fullResponse += content;
        onToken(content);
      }
    }

    return fullResponse;
  }


}