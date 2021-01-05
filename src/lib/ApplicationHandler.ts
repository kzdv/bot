import csvParser from "csv-parser";
import toReadableStream from "to-readable-stream";
import getStream from "get-stream";

import { googleapi, guild } from "../index";
import Log from "./Log";
import LiveEmbed from "./LiveEmbed";
import Utils from "./Utils";

class ApplicationHandler {
  config: ApplicationConfig;
  intTimer: NodeJS.Timer;

  constructor(config: ApplicationConfig) {
    this.config = config;
    this.intTimer = setInterval(() => {
      try {
        this.handle();
      } catch (err) {
        Log.error(`Error running application handle ${err}`);
      }
    }, 5 * 60 * 1000);
    this.handle();
  }

  async handle(): Promise<void> {
    let doc;
    try {
      doc = await googleapi.loadSheet(this.config.docId, this.config.sheetId);
      let streamData = toReadableStream(doc);
      let data: any = await getStream.array(streamData.pipe(csvParser({ headers: false })));
      if (data.length > 1) {
        Log.info(`New applications detected for ${this.config.type}: ${Buffer.from(JSON.stringify(doc)).toString("base64")}`);
      }
      const appquestions = [];
      data.forEach((v: string[], idx: number) => {
        if (idx === 0) {
          Object.keys(v).forEach((key) => {
            if (v[key].length > 100) {
              v[key] = v[key].substring(0, 100);
            }
            appquestions.push(v[key]);
          });
        } else {
          const channel = this.findChannel(v);
          if (channel !== null) {
            let count = 0;
            let batchNo = 1;
            let batch = [];
            let batchQuestions = [];
            Object.keys(v).forEach((index) => {
              let answer = v[index];
              count += answer.length + appquestions[index].length;
              batch.push(answer);
              batchQuestions.push(appquestions[index]);
              if (count > 5000) {
                let msg = LiveEmbed.createFromApplication(this.config.type, batchQuestions, batch);
                Utils.sendMessage(guild, channel, `${batchNo == 1 ? 'NEW APPLICATION RECEIVED' : 'APP CONTINUED'} (Part ${batchNo}):`, msg);
                batchNo += 1;
                count = 0;
                batch = [];
                batchQuestions = [];
              }
            });
            if (batch.length > 0) {
              let msg = LiveEmbed.createFromApplication(this.config.type, batchQuestions, batch);
              Utils.sendMessage(guild, channel, `${batchNo == 1 ? 'NEW APPLICATION RECEIVED' : 'APP CONTINUED (Part ' + batchNo + ')'} :`, msg);
            }
            googleapi.deleteRow(idx, this.config.docId, this.config.sheetId);
          }
        }
      });
    } catch (err) {
      Log.error(`Error loading sheet: ${err}`);
      console.trace(err);
      return;
    }
  }

  findChannel(appdata: string[]): string {
    if (typeof this.config.announce === "string") {
      return this.config.announce;
    } else if (typeof this.config.announce.values === "string") {
      return this.config.announce.values;
    } else if (typeof this.config.announce === "object") {
      let channel: string;
      Object.keys(this.config.announce.values).forEach((key) => {
        if (appdata[this.config.announce.column].toLowerCase() === key.toLowerCase()) {
          channel = this.config.announce.values[key];
        }
      });

      if (channel) {
        return channel;
      } else if (this.config.announce.values["rest"]) {
        return this.config.announce.values["rest"];
      }
    }

    return null;
  }
}

export default ApplicationHandler;
