import Discord from "discord.js";
import Client from "./Client";

class Controller {
    static isVisitor(entry) {
        if (entry.visitor == 1 && entry.status == 0) return true;

        return false;
    }

    static isHomeController(entry) {
        if (entry.visitor == 0 && entry.status == 0) return true;

        return false;
    }

    static isGuest(entry) {
        if (entry.status == 1) return true;

        return false;
    }

    static isStaff(entry) {
        let ret = false;
        entry.roles.forEach(role => {
            if (["EC","WM","FE"].includes(role.name)) {
                ret = true;
            }
        });

        return ret;
    }

    static isSeniorStaff(entry) {
        let ret = false;
        entry.roles.forEach(role => {
            if (["ATM","DATM","TA"].includes(role.name)) {
                ret = true;
            }
        });

        return ret;
    }

    static hasRole(entry, role) {
        let ret = false;

        entry.roles.forEach(r => {
            if (r.name == role) ret = true;
        });

        return ret;
    }

    static rating_to_role = {
        "Observer": 0,
        "Student 1": 1,
        "Student 2": 2,
        "Student 3": 3,
        "Controller 1": 4,
        "Controller 2": 5,
        "Controller 3": 6,
        "Instructor 1": 7,
        "Instructor 2": 8,
        "Instructor 3": 9,
        "Supervisor": 10,
        "Administrator": 11
    }

    static hasCorrectRatingRole(entry, member: Discord.GuildMember, client: Client) {
        let roleName = Object.keys(client.roleCache).find(key => client.roleCache[key] === entry.rating_id);
        
        return member.roles.cache.find(r => r.name === roleName)?.id != null;
    }

    static getThirdArgument(entry) {
        const ratings = ["", "OBS", "S1", "S2", "S3", "C1", "C2", "C3", "I1", "I2", "I3", "SUP", "ADM"];
        if (this.isHomeController(entry)) {
            if (this.hasRole(entry, "ATM")) return " | ATM";
            if (this.hasRole(entry, "DATM")) return " | DATM";
            if (this.hasRole(entry, "TA")) return " | TA";
            if (this.hasRole(entry, "EC")) return " | EC";
            if (this.hasRole(entry, "FE")) return " | FE";
            if (this.hasRole(entry, "WM")) return " | WM";

            let fourth = "";
            if (this.hasRole(entry, "MTR")) return " | MTR";
        } else {
            return ` | ${entry.visitor_from}`;
        }

        return "";
    }
}

export default Controller;