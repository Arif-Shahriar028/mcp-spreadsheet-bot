import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";
import { LLMProvider } from "../LLMProvider.js";
import { apiFetch, apiFetchStream } from "../../../utils/network.js";
import { llamaApi } from "../../../utils/api.js";
import OpenAI from "openai";

export class LlamaProvider implements LLMProvider {

  public async choiceTools(messages: any[], tools: any[]): Promise<OpenAI.Chat.Completions.ChatCompletion.Choice[]> {
      const response = await apiFetch(llamaApi, 'POST', {
        model: "llama3.1:latest",
        messages, 
        stream: false,
        tools
      });
      return [response] as OpenAI.Chat.Completions.ChatCompletion.Choice[];
  }

  public async generateFinalResponse(messages: ChatCompletionMessageParam[], onToken: (token: string) => void): Promise<string> {
    
    const stream = await apiFetchStream(llamaApi, 'POST', {
      model: "llama3.1:latest",
      messages,
    });

    if (!stream) {
      throw new Error('Failed to get response stream');
    }

    console.log('stream: ', stream);

    const reader = stream.getReader();

    const decoder = new TextDecoder();

    let fullResponse = "";

    while(true){
      const {done, value} = await reader.read();
      if(done) break;

      const chunk = decoder.decode(value);

      const parsedChunk =  JSON.parse(chunk);

      fullResponse += parsedChunk.message.content;

      onToken(parsedChunk.message.content);
    }

    return fullResponse;
  }
}