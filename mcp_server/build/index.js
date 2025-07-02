import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { MCPServer } from "./server/MCPServer.js";
import dotenv from "dotenv";
dotenv.config();
const serverInstance = new MCPServer();
const server = serverInstance.getServer();
const PORT = process.env.PORT;
const app = express();
app.post("/mcp", async (req, res) => {
    console.log('------------>>>>>>> server hit');
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined
    });
    try {
        await server.connect(transport);
        await transport.handleRequest(req, res);
        // res.json(response);
    }
    catch (error) {
        console.log('ERROR: error handling mcp request');
        res.status(500).send({ error: "internal server error" });
    }
});
app.listen(PORT, () => {
    console.log('Server started at port: ', PORT);
});
