import ChildProcess from "child_process";

import Command from "../Command";
import Discord, { TextChannel } from "discord.js";

export default class DevServerRestart extends Command {
  constructor(client: Discord.Client) {
    super(client, {
      command: "reset channel",
      description: "Will clone and destroy the channel command is run in",
      roles: ["481985190164692995", "447538332730261524"],
    });
  }

  async handle(message: Discord.Message, args: string[]): Promise<void> {
    await (message.channel as TextChannel).clone();
    message.channel.delete();
  }
}