import { ConfigSingleton } from "../configSingleton";
import fs from "fs";
import util from "util";

var logFile = fs.createWriteStream('debug.log', {flags : 'w'});

export const logError = (s: string) => {
    console.error(s);
    logFile.write(util.format(s) + '\n');
};

export const logInfo = (s: string) => {
    var level = ConfigSingleton.getInstance().GetDebugLevel();
    if (level <= 1)
        return;
    console.log(s);
    logFile.write(util.format(s) + '\n');
};
export const logDetail = (s: string) => {
    var level = ConfigSingleton.getInstance().GetDebugLevel();
    if (level <= 2)
        return;
    console.log(s);
    logFile.write(util.format(s) + '\n');
};

export const logTrace = (s: string) => {
    var level = ConfigSingleton.getInstance().GetDebugLevel();
    if (level < 3)
        return;
    console.log(s);
    logFile.write(util.format(s) + '\n');
};

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

export const notConcurrent = <T>(proc: () => PromiseLike<T>) => {
    let inFlight: Promise<T> | false = false;
  
    return () => {
      if (!inFlight) {
        inFlight = (async () => {
          try {
            return await proc();
          } finally {
            inFlight = false;
          }
        })();
      }
      return inFlight;
    };
  };