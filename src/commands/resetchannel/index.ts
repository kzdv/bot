import ChildProcess from "child_process";

import Command from "../Command";
import Discord, { TextChannel } from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "force clear",
      description: "Force clear last X messages, WARNING: SLOW!",
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

    (message.channel as TextChannel).messages.fetch({ limit: count }).then((messages) => {
      messages.forEach((m) => {
        m.delete();
      });
    });
  }
}