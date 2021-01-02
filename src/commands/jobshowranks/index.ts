import Discord, { MessageEmbed } from "discord.js";
import Client from "../../lib/Client";
import Command from "../Command";
import mysql2 from "mysql2";
import Log from "../../lib/Log";

export default class HelpCommand extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      command: "show ranks for job",
      description: "Show job ranks for a specific job",
      roles: [
        "everyone"
      ]
    });
    this.client = client;
  }

  async handle(message: Discord.Message, args: string[]) {
    args = args.slice(this.command.split(" ").length);
    if (!args[0]) {
      message.channel.send("Missing job name at end of command. Syntax: `show ranks for job <job>`");
      return;
    }

    const embed = new MessageEmbed();
    embed
      .setTitle("MASTER CONTROL PROGRAM JOB LISTING")
      .setFooter("END OF LINE.")
      .setColor(message.guild.me.displayHexColor);
    let jobs = [];
    this.client.db.getPool().execute("SELECT `grade`,`name`,`label`,`salary` FROM job_grades WHERE `job_name`=? ORDER BY `grade`", [args[0]], (err, rows) => {
      if (err) {
        message.channel.send("Could not query database.");
        Log.error(`Error querying jobs table: ${err.message}`);
        console.trace();
        return;
      }
      let count = 0;
      let group = 1;
      (rows as any).forEach((job: {grade: number, name: string, label: string, salary: number}) => {
        const msg = `\`${job.grade}\` = ${job.label} - $${job.salary}`;
        if (count + msg.length > 1024) {
          embed.addField(`Ranks for ${args[0]} #${group}`, jobs);
          jobs = [];
          count = 0;
          group += 1;
        }
        jobs.push(msg);
      });
      embed.addField(`Ranks for ${args[0]} #${group}`, jobs);
      message.channel.send(embed);
    });
  }
}