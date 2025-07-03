import express, { Request, Response } from 'express';
import { MCPClient } from "./client/MCPClient.js";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

let client = new MCPClient();
client.connectToServer();

const app = express();

app.use(cors());
app.use(express.json());


app.post("/chat", async (req: Request, res: Response): Promise<any> => {
  try{
    const { prompt } = req.body;
    console.log("prompt: ", prompt);

    if(!prompt) res.status(400).json({success: false, error: "bad request"});

    // const response = await client.generateResponse(prompt, (token) => {
    //   console.log(" ", token);
    // });

    // res.status(200).json({success: true, data: JSON.stringify(response)});
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    await client.generateResponse(prompt, (token) => {
      res.write(`data: ${token}\n\n`);
    });

    res.write("data: [DONE]\n\n");
    res.end();
  }catch(error){
    res.status(500).json({success: false, error});
  }
});

app.listen(3004, ()=>{
  console.log('server running at : 3004');
})