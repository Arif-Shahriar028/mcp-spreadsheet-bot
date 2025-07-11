import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import OpenAI from "openai";
import { z } from 'zod';
export class MCPClient {
    client;
    openai;
    transport;
    constructor() {
        this.openai = new OpenAI({
            // baseURL: "https://models.inference.ai.azure.com",
            baseURL: "https://api.openai.com/v1",
            apiKey: process.env.OPEN_API_KEY,
        });
        this.client = new Client({
            name: "example-client",
            version: "1.0.0",
        }, {
            capabilities: {
                prompts: {},
                resouces: {},
                tools: {}
            }
        });
        this.transport = new StreamableHTTPClientTransport(new URL(process.env.MCP_SERVER_ENDPOINT));
    }
    async connectToServer() {
        await this.client.connect(this.transport);
        // this.run();
        console.error('MCPClient started on http transport');
    }
    async generateResponse(prompt, onToken) {
        console.log('Asking server for available tools');
        // listing tools 
        const availableTools = this.client.listTools();
        // list server capabilities in a format that llm understands
        const tools = (await availableTools).tools.map((tool) => {
            return this.openAiToolAdapter({
                name: tool.name,
                description: tool.description,
                input_schema: tool.inputSchema
            });
        });
        const messages = [
            {
                role: "user",
                content: prompt
            }
        ];
        // calling llm for tools
        let response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_completion_tokens: 1000,
            messages,
            tools: tools
        });
        // tools call according to the llm response
        await Promise.all(response.choices.map(async (choice) => {
            const message = choice.message;
            if (message.tool_calls) {
                console.log("Making tool calls");
                const toolResults = await this.callTools(message.tool_calls);
                messages.push(message);
                for (const result of toolResults) {
                    messages.push({
                        role: "tool",
                        content: JSON.stringify(result.content.content),
                        tool_call_id: result.toolCallId
                    });
                }
            }
        }));
        // final response from llm:
        const stream = await this.openai.chat.completions.create({
            model: "gpt-4o",
            max_completion_tokens: 1000,
            messages,
            stream: true
        });
        // console.log(`\n\n PROMPT ## ${prompt} \n`, );
        // console.log('==>> FINAL RESPONSE: \n', finalResponses.choices[0].message.content);
        // return finalResponses.choices[0].message.content;
        let fullResponse = "";
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                fullResponse += content;
                onToken(content);
            }
        }
        console.log('responsse: ====>>> ', fullResponse);
        return fullResponse;
    }
    // call tools 
    async callTools(tool_calls) {
        const result = [];
        for (const tool_call of tool_calls) {
            const toolName = tool_call.function.name;
            const args = tool_call.function.arguments;
            const toolCallId = tool_call.id;
            console.log(`Calling tool ${toolName} with args ${JSON.stringify(args)}`);
            try {
                const toolResult = await this.client.callTool({
                    name: toolName,
                    arguments: JSON.parse(args),
                });
                result.push({
                    content: toolResult,
                    toolCallId
                });
            }
            catch (error) {
                console.log('ERROR: ', error);
            }
        }
        return result;
    }
    // adapter to return server capabilities in llm understandable format 
    openAiToolAdapter(tool) {
        const schema = z.object(tool.input_schema);
        return {
            type: "function",
            function: {
                name: tool.name,
                description: tool.description,
                parameters: {
                    type: "object",
                    properties: tool.input_schema.properties,
                    required: tool.input_schema.required,
                }
            }
        };
    }
    async availableTools() { }
    async choiceTools() { }
}
