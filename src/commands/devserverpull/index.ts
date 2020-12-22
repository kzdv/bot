import ChildProcess from "child_process";

import Command from "../Command";
import Discord from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "request git pull of dev server",
      roles: [
        "768615611449737217" // Developer
      ]
    });
  }

  async handle(message: Discord.Message, args: string[]): Promise<void> {
    await message.channel.send("WILL START THE GIT PULL PROCESS. STAND BY.");
    try {
      ChildProcess.execSync("/home/daniel/apps/mcp/bin/gitpull-dev.sh");
      message.channel.send("PULL COMPLETE.");
    } catch(err) {
      message.channel.send(`COMMAND FAILED TO EXECUTE.`)
    }
    message.channel.send("END OF LINE.");
  }
}