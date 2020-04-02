import { IQueueService } from "./IQueueService";
import { FileBasedQueueService } from "./FileBasedQueueService";
import { IMessageBroker } from "../messageBroker/IMessageBroker";
import { QueueService } from "./QueueService";
import { ConfigSingleton } from "../../configSingleton";
import fs from "fs";
import { logError } from "../../utils";

export class QueueFactory {

    private readonly fileBasedQueue: IQueueService;
    private readonly memoryBasedQueue: IQueueService;
    private readonly config: ConfigSingleton;

    constructor(messageBroker: IMessageBroker) {
        this.fileBasedQueue = new FileBasedQueueService(messageBroker);
        this.memoryBasedQueue = new QueueService(messageBroker);
        this.config = ConfigSingleton.getInstance();
    }

    async getService() : Promise<IQueueService> {
        if (this.config.IsMemoryBasedQueue())
            return this.memoryBasedQueue;
        var isPossibleToUseFile = await this.initFileSystem();
        return isPossibleToUseFile ? this.fileBasedQueue : this.memoryBasedQueue;
    }

    private initFileSystem() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.exists(this.config.GetActivityFileLocation(), (exist) => {
                    if (!exist) {
                        fs.writeFile(this.config.GetActivityFileLocation(), "", 'utf8', (err) => {
                            if (err == null) {
                                return resolve (true)
                            } else {
                                logError("Error init file config. Error code: " + err);
                                return resolve(false);
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