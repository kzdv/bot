import ChildProcess from "child_process";

import Command from "../Command";
import Discord from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "REQUEST GIT PULL OF DEV SERVER",
      roles: [
        "768615611449737217" // Developer
      ]
    });
  }

  handle(message: Discord.Message, args: string[]): void {
    message.channel.send("WILL START THE GIT PULL PROCESS. STAND BY.");
    ChildProcess.execSync("/home/daniel/apps/mcp/bin/gitpull-dev.sh");
    message.channel.send("PULL COMPLETED. END OF LINE.");
  }
}