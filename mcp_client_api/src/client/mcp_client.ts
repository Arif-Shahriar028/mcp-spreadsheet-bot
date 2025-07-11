
import { LLMProvider } from "./llm/LLMProvider.js"; 
import z from "zod";
import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

export class McpClient {
  private client: Client;
  private transport: Transport;
  private llm: LLMProvider;

  constructor(llm: LLMProvider) {
    this.llm = llm;

    this.client = new Client(
      {
        name: "example-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          prompts: {},
          resouces: {},
          tools: {}
        }
      }
    )

    this.transport = new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_ENDPOINT as string));
  }

  async connectToServer(){
    await this.client.connect(this.transport);
    // this.run();
    console.error('MCPClient started on http transport');
  }

  async generateResponse(prompt: string, onToken: (token: string) => void) {
    console.log('Asking server for available tools');

    // listing tools 
    const availableTools = await this.client.listTools();

    // list server capabilities in a format that llm understands
    const tools = (availableTools).tools.map((tool)=>{
      return this.llmToolAdapter({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema
      });
    });
    
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: prompt
      }
    ]

    const selectedTools: OpenAI.Chat.Completions.ChatCompletion.Choice[] = await this.llm.choiceTools(messages, tools);
    console.log('---->>>> selected tools: ', JSON.stringify(selectedTools));

    await Promise.all(
      selectedTools.map(async (choice: {message: any}) => {
        const message = choice.message;
        console.log('---->>>>> message choice: ', JSON.stringify(message));
        if(message.tool_calls){
          console.log("----->>>>> Making tool calls");
          const toolResults = await this.callTools(message.tool_calls);

          messages.push(message);

          for (const result of toolResults){
            messages.push({
              role: "tool",
              content: JSON.stringify(result.content.content),
              tool_call_id: result.toolCallId as string
            });
          }
        }
      })
    );

    console.log('-------->>>>>>> Mesages: ', JSON.stringify(messages));

    const finalResponse = await this.llm.generateFinalResponse(messages, onToken);

    return finalResponse
  }

  llmToolAdapter(tool : {
      name: string;
      description?: string;
      input_schema: any;
    }){
      const schema = z.object(tool.input_schema);
  
      return {
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: "object",
            properties: tool.input_schema.properties,
            required: tool.input_schema.required,
          }
        }
      }
    }

  async callTools(
      tool_calls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    ){
  
      const result = [];
  
      for (const tool_call of tool_calls){
        const toolName = tool_call.function.name;
        const args = tool_call.function.arguments;
        const toolCallId = tool_call.id;

        console.log('------>>>> toolcalls :', JSON.stringify(tool_call));
  
        console.log(`Calling tool ${toolName} with args ${JSON.stringify(args)}`);
  
        // console.log('------>>>> parsing: ', JSON.parse(args));
        try{
          const toolResult = await this.client.callTool({
            name: toolName,
            arguments: {},
          })

          console.log('\n------->>>> toolResult: ', JSON.stringify(toolResult));
  
          result.push({
            content: toolResult,
            toolCallId
          });
        }catch(error){
          console.log('ERROR: ', error);
        }
      }
  
      return result
    }
}