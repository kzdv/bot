/* eslint-disable @typescript-eslint/lines-between-class-members */
import { JWT } from "google-auth-library";
import axios from "axios";
import Log from "./Log";

const SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];

class GoogleAPI {
  credentials: Config["googleapi"];
  jwtClient: JWT;
  jwtInterval: NodeJS.Timer;

  constructor(config: Config["googleapi"]) {
    this.credentials = config;
  }

  async authentication(): Promise<void> {
    this.jwtClient = new JWT({
      email: this.credentials.client_email,
      key: this.credentials.private_key,
      scopes: SCOPE,
      subject: null,
    });
    await this.renewJwtAuth();
    if (!this.jwtInterval) {
      this.jwtInterval = setInterval(() => this.checkRefresh(), 60 * 1000);
    }
  }

  async checkRefresh(): Promise<void> {
    if (
      !this.jwtClient.credentials.expiry_date ||
      this.jwtClient.credentials.expiry_date - 5 * 60 * 1000 < new Date().getTime()
    ) {
      await this.jwtClient.authorize();
    }
  }

  async renewJwtAuth(): Promise<void> {
    await this.jwtClient.authorize();
  }

  async loadSheet(id: string, sheet?: string): Promise<string> {
    let res;
    try {
      res = await axios({
        method: "GET",
        url: `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv${ sheet ? `&sheet=${sheet}` : "" }`,
        headers: {
          Authorization: `Bearer ${this.jwtClient.credentials.access_token}`,
        },
      });
    } catch (err) {
      Log.error(`Error fetching application CSV for ${id}: ${err} - ${JSON.stringify(err.response.data)}`);
    }
    return res?.data;
  }

  async deleteRow(id: number, docId: string, sheet: string): Promise<void> {
    try {
      await axios({
        method: "POST",
        url: `https://sheets.googleapis.com/v4/spreadsheets/${docId}:batchUpdate`,
        headers: {
          Authorization: `Bearer ${this.jwtClient.credentials.access_token}`,
        },
        data: {
          requests: [
            {
              "deleteDimension": {
                "range": {
                  "sheetId": sheet,
                  "dimension": "ROWS",
                  "startIndex": id,
                  "endIndex": id+1
                }
              }
            }
          ]
        }
      });
    } catch (err: any) {
      Log.error(`Error deleting row ${id} from ${docId}: ${err} - ${JSON.stringify(err.response.data)}`);
      Log.error(err.stack);
    }
  }
}

export default GoogleAPI;
