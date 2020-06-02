import {IQueueService} from "./IQueueService";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {MAX_ACTIVITIES_BEFORE_SEND} from "../../constants";
import {EventType, IMessageBroker} from "../messageBroker/IMessageBroker";
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import { ConfigService } from "../../configService";
import { logError } from "../../utils";
import lock from "async-lock";
export class FileBasedQueueService implements IQueueService {

    private readonly messageBroker: IMessageBroker;
    private readonly config: ConfigService;
    private lastTrackedActivity: number = 0;

    constructor(messageBroker: IMessageBroker) {
        this.messageBroker = messageBroker;
        this.config = ConfigService.getInstance();
    }


    async popActiveActivities(): Promise<Array<ActivityEntity>> {
        try {
            let queuesRaw = await fsPromises.readFile(this.config.GetActivityFileLocation(), { encoding: "utf8" });
            await fsPromises.writeFile(this.config.GetActivityFileLocation(), "", { encoding: "utf8", flag: "w" });
            if (queuesRaw == null || queuesRaw == "")
                return new Array<ActivityEntity>();
            let parsedQueue = JSON.parse(queuesRaw) as ActivityEntity[];
            if (parsedQueue == null) {
                parsedQueue = new Array<ActivityEntity>();
            }
            return parsedQueue;
        } catch (err) {
            logError("Can't get activities: " + err);
            return new Array<ActivityEntity>();;
        }
    }

    async pushActivityToQueue(activity: ActivityEntity): Promise<boolean> {
        try {
            let currentQueue = await this.getActiveActivities();
            currentQueue.push(activity);
            await fsPromises.writeFile(this.config.GetActivityFileLocation(), JSON.stringify(currentQueue), { encoding: "utf8", flag: "w" });
            if (currentQueue.length >= MAX_ACTIVITIES_BEFORE_SEND) {
                let time: number = Date.now();
                if (this.enoughTimePassed(time)) {
                    this.messageBroker.invokeEvent(EventType.QUEUE_MIN_LIMIT_REACHED);
                    this.lastTrackedActivity = time;
                }
            }
            return true;
        } catch (err) {
            logError("Can't push activities: " + err);
            return false;
        }
    }

    private enoughTimePassed(time: number): boolean {
        return this.lastTrackedActivity + 1000 * 60 < time;
    }

    async pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean> {
        try {
            let currentQueue = await this.getActiveActivities();
            for (let oneActivity of activity) {
                currentQueue.push(oneActivity);
            }
            var json = JSON.stringify(activity);
            await fsPromises.writeFile(this.config.GetActivityFileLocation(), json, { encoding: "utf8", flag: "w" });
            return true;
        } catch (err) {
            logError("Write failed: " + err);
            return false;
        }
    }

    async getActiveActivities(): Promise<Array<ActivityEntity>> {
        try {
            let queuesRaw = await fsPromises.readFile(this.config.GetActivityFileLocation(), { encoding: "utf8" });
            if (queuesRaw == null || queuesRaw == "")
                return new Array<ActivityEntity>();
            let parsedQueue = JSON.parse(queuesRaw) as ActivityEntity[];
            if (parsedQueue == null) {
                parsedQueue = new Array<ActivityEntity>();
            }
            return parsedQueue;
        } catch (err) {
            logError("can't fetch activities: " + err);
        }
        return new Array<ActivityEntity>();
    }

    async initQueue(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.access(this.config.GetActivityFileLocation(), fs.constants.F_OK | fs.constants.W_OK, async (error) => {
                    var needToRewrite = error != null;

                    if (error == null) {
                        let queuesRaw = await fsPromises.readFile(this.config.GetActivityFileLocation(), { encoding: "utf8" });
                        if (queuesRaw == null || queuesRaw == "")
                            needToRewrite = true
                        else {
                            try {
                                var file = JSON.parse(queuesRaw) as ActivityEntity[];
                                if (file == null || file.length == 0)
                                    needToRewrite = true;
                            } catch (err) {
                                logError("Corrupted file");
                                needToRewrite = true;
                            }
                        }
                    }

                    if (needToRewrite) {
                        fs.writeFile(this.config.GetActivityFileLocation(), "",  {encoding: 'utf8', flag: "w"}, (err) => {
                            if (err == null) {
                                return resolve(true);
                            }
                            else {
                                logError("Error init file config. Error code: " + err);
                                return resolve (false)
                            }
                        });
                    }
                    return resolve(true);
                });
            } catch (err) {
                logError("Exception during file init: " + err);
                return resolve(false);
            }
        })
    }


}
