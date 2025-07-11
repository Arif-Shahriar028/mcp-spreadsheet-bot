import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { McpClient } from './client/mcp_client.js';
import { LlamaProvider } from './client/llm/providers/llamaProvider.js';
import { OpenAIProvider } from './client/llm/providers/openAIProvider.js';
dotenv.config();
console.log('====>>>>> Selected model: ', process.argv[2]);
let client;
if (process.argv[2] === "llama") {
    // initializing client with llama model
    const llamaProvider = new LlamaProvider();
    client = new McpClient(llamaProvider);
    client.connectToServer();
}
else {
    // initializing client with openai's model
    const openAIProvider = new OpenAIProvider();
    client = new McpClient(openAIProvider);
    client.connectToServer();
}
const app = express();
app.use(cors());
app.use(express.json());
app.get("/chat", async (req, res) => {
    try {
        // const { prompt } = req.body;
        const prompt = req.query.prompt;
        console.log("prompt: ", prompt);
        if (!prompt) {
            res.status(400).json({ success: false, error: "bad request" });
            return;
        }
        // const response = await client.generateResponse(prompt, (token) => {
        //   console.log(" ", token);
        // });
        // res.status(200).json({success: true, data: JSON.stringify(response)});
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
        await client.generateResponse(prompt, (token) => {
            console.log('data: ', token);
            res.write(`data: ${token}\n\n`);
        });
        res.write("data: [DONE]\n\n");
        res.end();
    }
    catch (error) {
        console.log('error: ', error);
        res.status(500).json({ success: false, error });
    }
});
app.listen(3004, () => {
    console.log('server running at : 3004');
});
