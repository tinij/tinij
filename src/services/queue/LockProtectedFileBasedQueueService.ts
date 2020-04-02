import { FileBasedQueueService } from "./FileBasedQueueService";
import { ActivityEntity } from "../../entities/ActivityEntity";
import { IMessageBroker } from "../messageBroker/IMessageBroker";
import AsyncLock from 'async-lock';


export class LockProtectedFileBasedQueueService extends FileBasedQueueService {


    private readonly lock : AsyncLock;

    constructor(messageBroker: IMessageBroker) {
        super(messageBroker);
        this.lock  = new AsyncLock();
    }


    popActiveActivities(): Promise<Array<ActivityEntity>> {
        return this.lock.acquire("file", (done) => {
            return super.popActiveActivities();
        });
    }

    pushActivityToQueue(activity: ActivityEntity): Promise<boolean> {
        return this.lock.acquire("file", () => {
            return super.pushActivityToQueue(activity);
        });
    }

    pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean> {
        return this.lock.acquire("file", () => {
            return super.pushActivitiesToQueue(activity);
        });
    }

    getActiveActivities(): Promise<Array<ActivityEntity>> {
        return this.lock.acquire("file", () => {
            return super.getActiveActivities();
        });
    }

    initQueue(): Promise<boolean> {
        return super.initQueue();
    }

}