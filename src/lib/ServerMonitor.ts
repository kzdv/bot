import axios from "axios";
import ChildProcess from "child_process";

import Log from "./Log";

export default class ServerMonitor {
  config: SMConfig;
  skip: number;

  constructor(config: SMConfig) {
    this.config = config;
Log.info(`Configuring for: ${JSON.stringify(this.config)}`);
    setInterval(this.handleCheck.bind(this), 5*60*1000);
  }

  async handleCheck(): Promise<void> {
    if (!this.config.ip || this.config.port<=0) return;
    if (this.skip > 0) {
      this.skip -= 1;
      return;
    }

    // Server is in restart period, don't health check
    if (this.config.restartTimes.includes((new Date()).getHours()) && (new Date()).getMinutes() < 3) {
      return;
    }

    try {
      await axios.get(`http://${this.config.ip}:${this.config.port}/info.json`);
    } catch(error) {
      Log.error("Live server health check failed. Restarting.");
      this.skip += 1;
      ChildProcess.exec(this.config.restartCmd, () => {
        Log.info("Command executed.");
      });
    }
  }
}
