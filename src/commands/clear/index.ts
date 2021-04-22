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
    let count;
    args = args.slice(this.command.split(" ").length);
    if (!args[0]) {
      count = parseInt(args[0]) + 1;
    } else {
      count = 11;
    }
    if (count <= 100) {
      (message.channel as TextChannel).bulkDelete(count);
    } else {
      while (count > 0) {
        let batch = count;
        if (batch < 100) { batch = 100; }

        (message.channel as TextChannel).bulkDelete(batch);

        count -= batch;
        
        await new Promise(r => setTimeout(r, 250));
      }
    }
  }
}