import { apiFetch, apiFetchStream } from "../../../utils/network.js";
import { llamaApi } from "../../../utils/api.js";
export class LlamaProvider {
    async choiceTools(messages, tools) {
        const response = await apiFetch(llamaApi, 'POST', {
            model: "llama3.1:latest",
            messages,
            stream: false,
            tools
        });
        return [response];
    }
    async generateFinalResponse(messages, onToken) {
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
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value);
            const parsedChunk = JSON.parse(chunk);
            fullResponse += parsedChunk.message.content;
            onToken(parsedChunk.message.content);
        }
        return fullResponse;
    }
}
