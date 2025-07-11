import { apiFetch, apiFetchStream } from "../../utils/network.js";
import { llamaApi } from "../../utils/api.js";
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
            // console.log('chunk: ', chunk);
            // console.log('content: ', parsedChunk.message.content);
            fullResponse += parsedChunk.message.content;
            onToken(parsedChunk.message.content);
            // const lines = chunk.split('\n');
            // for (const line of lines) {
            //   if (line.trim()) {
            //     const data = JSON.parse(line);
            //     const token = data.choices?.[0]?.delta?.content;
            //     if (token) {
            //       fullResponse += token;
            //       onToken(token); // Process each token immediately
            //     }
            //   }
            // }
        }
        return fullResponse;
    }
}
