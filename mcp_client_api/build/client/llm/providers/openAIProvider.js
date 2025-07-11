import OpenAI from 'openai';
export class OpenAIProvider {
    openai;
    constructor() {
        this.openai = new OpenAI({
            baseURL: "https://models.inference.ai.azure.com",
            // baseURL: "https://api.openai.com/v1",
            // apiKey: process.env.OPEN_API_KEY,
            apiKey: process.env.GITHUB_TOKEN
        });
    }
    async choiceTools(messages, tools) {
        // calling llm for tools
        let response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            max_completion_tokens: 1000,
            messages,
            tools: tools
        });
        return response.choices;
    }
    async generateFinalResponse(messages, onToken) {
        const stream = await this.openai.chat.completions.create({
            model: "gpt-4o",
            max_completion_tokens: 1000,
            messages,
            stream: true
        });
        let fullResponse = "";
        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                fullResponse += content;
                onToken(content);
            }
        }
        return fullResponse;
    }
}
