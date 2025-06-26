import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { google } from "googleapis";
import {GoogleAuth} from "google-auth-library"
import path from "path";
import { z } from "zod";
import { extractStructuredData } from "../utils/extract-json.js";
import { googleSheetFetcher } from "../tools/spreadSheetTool.js";

export class MCPServer {
  private server: McpServer;

  constructor(){
    this.server = new McpServer({
      name: "meal-mcp-server",
      version: "1.0.0"
    })

    this.initializeTools()
  }

  initializeTools(){
    this.server.tool("google-spread-sheet-for-meal-management", "get spreadsheet data of meal entry and bazar or shopping management", {},  
      async ()=> {
        const data = googleSheetFetcher()
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }
    )
  }

  getServer(): McpServer{
    return this.server
  }
}