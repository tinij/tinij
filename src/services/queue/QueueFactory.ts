import { IQueueService } from "./IQueueService";
import { FileBasedQueueService } from "./FileBasedQueueService";
import { IMessageBroker } from "../messageBroker/IMessageBroker";
import { QueueService } from "./QueueService";
import { ConfigService } from "../../configService";
import fs from "fs";
import { logError } from "../../utils";
import { LockProtectedFileBasedQueueService } from "./LockProtectedFileBasedQueueService";

export class QueueFactory {

    private readonly fileBasedQueue: IQueueService;
    private readonly memoryBasedQueue: IQueueService;
    private readonly config: ConfigService;

    constructor(messageBroker: IMessageBroker) {
        this.fileBasedQueue = new LockProtectedFileBasedQueueService(messageBroker);
        this.memoryBasedQueue = new QueueService(messageBroker);
        this.config = ConfigService.getInstance();
    }

    async getService() : Promise<IQueueService> {
        if (await this.config.IsMemoryBasedQueue())
            return this.memoryBasedQueue;
        var isPossibleToUseFile = await this.initFileSystem();
        return isPossibleToUseFile ? this.fileBasedQueue : this.memoryBasedQueue;
    }

    private initFileSystem() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.access(this.config.GetActivityFileLocation(), fs.constants.F_OK | fs.constants.W_OK, async (error) => {
                    if (error != null) {
                        fs.writeFile(this.config.GetActivityFileLocation(), "", { encoding: 'utf8', flag: "w" }, (err) => {
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