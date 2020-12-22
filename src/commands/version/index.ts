import Command from "../Command";
import Discord from "discord.js";

export default class VersionCommand extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "request version information",
      alias: "version",
      description: "MCP Version information",
      roles: [
        "everyone"
      ]
    });
  }

  handle(message: Discord.Message, args: string[]): void {
    message.channel.send(`MASTER CONTROL PROGRAM VERSION ${global.__version} BY DANIEL A. HAWTON. END OF LINE.`);
  }
}