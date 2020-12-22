import Discord from "discord.js";
import { readdirSync } from "fs";
import Command from "../commands/Command";
import Log from "./Log";
import { resolve, join } from "path";

export default class Client extends Discord.Client {
  commands: Discord.Collection<string, Command>;
  constructor(options?) {
    super(options);
    this.commands = new Discord.Collection();
  }
  loadCommands(path) {
    Log.info("Loading commands...");
    readdirSync(resolve(global.__basedir, path)).filter(f => !f.endsWith(".js") && !f.endsWith(".map")).forEach(dir => {
      const commands = readdirSync(resolve(global.__basedir, join(path, dir))).filter(f => f.endsWith(".js"));
      commands.forEach(f => {
        const Command = require(resolve(global.__basedir, join(path, dir, f)));
        const command = new Command.default(this);
        if (command.command) {
          Log.info(`Loaded command: ${command.command}`)
          this.commands.set(command.command, command);
        } else {
          Log.info(`Problem while loading ${join(path, dir, f)}, doesn't appear to be a valid command file.`);
        }
      })
    });
    return this;
  }
  loadEvents(path) {
    readdirSync(resolve(global.__basedir, path)).filter(f => f.endsWith(".js")).forEach(file => {
      const event = require(resolve(global.__basedir, join(path, file)));
      const eventName = file.substring(0, file.indexOf("."));
      super.on(eventName, event.default.bind(null, this));
      delete require.cache[require.resolve(resolve(global.__basedir, join(path, file)))]; // Delete cache
      Log.info(`Loaded event: ${eventName}`);
    });
    return this;
  }
}