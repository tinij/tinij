import { ConfigService } from "../configService";
import fs from "fs";
import util from "util";

var logFile : fs.WriteStream;
var logLevel: number;

export async function InitLogService() : Promise<boolean> {
    logFile = fs.createWriteStream(ConfigService.getInstance().GetLogFileLocation(), {flags : 'w', encoding: "utf8"});
    this.logLevel = await ConfigService.getInstance().GetDebugLevel();
    return true;
}

export function validateTime(time: number) : boolean {
    return (new Date(time)).getTime() > 0;
}

export function validateDateTime(time: Date) : boolean {
    let utcDate = new Date(new Date().toUTCString());
    let previousDay = new Date(utcDate);
    let nextDay = new Date(utcDate);

    previousDay.setDate(previousDay.getDate() - 1);
    nextDay.setDate(nextDay.getDate() + 1);
    if (time.getTime() < previousDay.getTime() || time.getTime() > nextDay.getTime()) {
        logDetail("Failed to validate date: " + time);
        return false;
    }
    return true;
}

export const logError = (s: string) => {
    console.error(s);
    if (s == undefined || logFile == null) {
        return;
    }
    logFile.write(new Date().toISOString() +  " - [ERROR] " + new Date().toISOString() +  " ]"  + util.format(s) + '\n');
};

export const logInfo = async (s: string) => {
    if (logLevel <= 1)
        return;
    console.log(s);
    if (s == undefined || logFile == null) {
        return;
    }
    logFile.write(new Date().toISOString() +  " - [INFO] " + new Date().toISOString() +  "]"  + util.format(s) + '\n');
};
export const logDetail = async (s: string) => {
    if (logLevel <= 2)
        return;
    console.log(s);
    if (s == undefined || logFile == null) {
        return;
    }
    logFile.write(new Date().toISOString() +  " - [DETAIL] " + new Date().toISOString() +  "]" + util.format(s) + '\n');
};

export const logTrace = async (s: string) => {
    if (logLevel < 3)
        return;
    console.log(s);
    if (s == undefined || logFile == null) {
        return;
    }
    logFile.write(new Date().toISOString() +  " - [TRACE] " + util.format(s) + '\n');
};

