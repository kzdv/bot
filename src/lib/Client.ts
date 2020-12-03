import Discord from "discord.js";
import Command from "../commands/Command";

export default class Client extends Discord.Client {
  commands: Discord.Collection<string, Command>;
  constructor(options) {
    super(options);
    this.commands = new Discord.Collection();

  }
}