/* eslint-disable @typescript-eslint/lines-between-class-members */
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import axios from "axios";
import Log from "./log";

const GOOGLE_PATH = path.resolve(__dirname, "google");
const TOKEN_PATH = path.resolve(__dirname, "google", "token.json");
const SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];

class GoogleAPI {
  credentials: Config["googleapi"];
  jwtClient: JWT;
  jwtInterval: NodeJS.Timer;

  constructor(config: Config["googleapi"]) {
    if (fs.existsSync(GOOGLE_PATH)) {
      fs.mkdirSync(GOOGLE_PATH);
    }
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

  async loadSheet(id: string): Promise<{ [key: string]: string }[]> {
    let res;
    Log.info(
      JSON.stringify({
        access_token: this.jwtClient.credentials.access_token,
        expires: this.jwtClient.credentials.expiry_date,
      }),
    );
    try {
      res = await axios({
        method: "GET",
        url: `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`,
        headers: {
          Authorization: `Bearer ${this.jwtClient.credentials.access_token}`,
        },
      });
    } catch (err) {
      Log.error(`Error fetching application CSV for ${id}: ${err}`);
    }
    return res?.data;
  }
}

export default GoogleAPI;
