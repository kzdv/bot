import Discord, { MessageEmbed } from "discord.js";
import Client from "../../lib/Client";
import Command from "../Command";
import Log from "../../lib/Log";
import Utils from "../../lib/Utils";

export default class HelpCommand extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      command: "find vehicle",
      description: "Find a vehicle (find vehicle <plate>)",
      roles: [
        "administrator",
        "766344436699365396",
        "768615611449737217"
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

    let jobs = [];
    this.client.db.getPool().execute("SELECT u.identifier AS identifier, ov.plate AS plate, ov.garage AS garage, ov.state AS state, u.firstname AS fname, u.lastname AS lname FROM owned_vehicles AS ov, users AS u WHERE ov.plate=? AND ov.owner=u.identifier", [args[0]], (err, rows) => {
      message.channel.send("MASTER CONTROL PROGRAM: SAN ANDREAS DEPARTMENT OF MOTOR VEHICLE INFORMATION:")
      if (err) {
        message.channel.send("UNABLE TO QUERY DATABASE. END OF LINE.");
        Log.error(`Error querying owned vehicles or users table: ${err.message}`);
        console.trace();
        return;
      }
      if ((rows as any).length < 1) {
        message.channel.send("NO RECORDS FOUND. END OF LINE.");
        return;
      }
      let count = 0;
      let group = 1;
      (rows as any).forEach((record: {identifier: string, plate: string, garage: string, state: number, fname: string, lname: string}) => {
        message.channel.send(`RECORD FOUND. ${record.plate}. REGISTERED TO ${record.fname} ${record.lname}. ${record.state == 1 ? "PARKED":"WAS PARKED"} AT ${record.garage}`);
      });
      message.channel.send("END OF LINE.");
    });
  }
}