import ChildProcess from "child_process";

import Command from "../Command";
import Discord from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "request restart of dev server",
      roles: [
        "766323246144290848", // Admininistrator
        "766344436699365396", // Moderator
        "768615611449737217" // Developer
      ]
    });
  }

  async handle(message: Discord.Message, args: string[]): Promise<void> {
    await message.channel.send("STOPPING THE DEV SERVER, PLEASE STAND BY.");
    ChildProcess.execSync("/home/daniel/apps/mcp/bin/stop-dev.sh && sleep 5");
    await message.channel.send("STARTING THE DEV SERVER.");
    ChildProcess.execSync("/home/daniel/apps/mcp/bin/start-dev.sh");
    message.channel.send("THE DEV SERVER IS SYNCING TO GITLAB AND STARTING. IT WILL BE ONLINE SHORTLY. END OF LINE.");
  }
}