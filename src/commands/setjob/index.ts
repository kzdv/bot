import Discord from "discord.js";
import Client from "../../lib/Client";
import Command from "../Command";
import Log from "../../lib/Log";
import Utils from "../../lib/Utils";

export default class HelpCommand extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      command: "set job",
      description: "Set job (set job <id> <job> <grade>)",
      roles: [
        "766323246144290848",
        "766344624141893642",
        "766344693679521842",
        "766344726847946762"
      ]
    });
    this.client = client;
  }

  async handle(message: Discord.Message, args: string[]) {
    args = args.slice(this.command.split(" ").length);
    if (!args[0] || !args[1] || !args[2]) {
      message.channel.send("Missing job name at end of command. Syntax: `set job <id> <job> <grade>`");
      return;
    }
    this.client.rcon.connect();
    this.client.rcon.send(`setjob ${args[0]} ${args[1]} ${args[2]}`);
    Log.info(`Setting job for ${args[0]} to ${args[1]} ${args[2]}, requested by ${message.author.tag}`);
    message.channel.send("REQUEST SENT TO SERVER. END OF LINE.");
  }
}