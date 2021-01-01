import Discord, { MessageEmbed } from "discord.js";
import Client from "../../lib/Client";
import Command from "../Command";
import mysql2 from "mysql2";
import Log from "../../lib/Log";

export default class HelpCommand extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      command: "show jobs",
      description: "Show jobs",
      roles: [
        "everyone"
      ]
    });
    this.client = client;
  }

  async handle(message: Discord.Message, args: string[]) {
    const embed = new MessageEmbed();
    embed
      .setTitle("MASTER CONTROL PROGRAM JOB LISTING")
      .setDescription("PREFIX: TAG MASTER CONTROL PROGRAM")
      .setFooter("END OF LINE.")
      .setColor(message.guild.me.displayHexColor);
    let jobs = [];
    this.client.db.getPool().query("SELECT `name`,`label`,`whitelisted` FROM jobs ORDER BY `label`", (err, rows) => {
      if (err) {
        message.channel.send("Could not query database.");
        Log.error(`Error querying jobs table: ${err.message}`);
        console.trace();
        return;
      }
      let count = 0;
      let group = 1;
      (rows as any).forEach((job: {name:string,label:string,whitelisted:number}) => {
        const msg = `\`${job.name}\` = ${job.label} ${job.whitelisted ? "[WL]":""}`;
        if (count + msg.length > 1024) {
          embed.addField(`Jobs #${group}`, jobs);
          jobs = [];
          count = 0;
          group += 1;
        }
        jobs.push(msg);
      });
      embed.addField(`Jobs #${group}`, jobs);
      message.channel.send(embed);
    });
  }
}