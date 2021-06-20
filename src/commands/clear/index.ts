import ChildProcess from "child_process";

import Command from "../Command";
import Discord, { TextChannel } from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "clear",
      description: "Clear last X messages (up to 100)",
      roles: [
        "administrator"
      ]
    });
  }

  async handle(message: Discord.Message, args: string[]): Promise<void> {
    let count = parseInt(args.slice(this.command.split(" ").length)[0]);
    if (count == 0) {
      count = 11;
    }

    (message.channel as TextChannel).bulkDelete(count, true);
  }
}