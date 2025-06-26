import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import path from "path";
import { extractStructuredData } from "../utils/extract-json.js";
const __dirname = path.resolve();
const SERVICE_ACCOUNT_FILE = path.join(__dirname, "/spreadsheet-mcp-server.json");
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = '1ycG_v0y5Jqw40sHdTfZOjt9-wC3yYkNd3XgtCwtnxGg';
export const googleSheetFetcher = async () => {
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: SCOPES
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "June"
    });
    const values = res.data.values;
    const extractedValues = extractStructuredData(values);
    return extractedValues;
};
