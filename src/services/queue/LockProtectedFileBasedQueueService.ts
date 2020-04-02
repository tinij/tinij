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


    async popActiveActivities(): Promise<Array<ActivityEntity>> {
        return this.lock.acquire("file", () => {
            return super.popActiveActivities();
        });
    }

    async pushActivityToQueue(activity: ActivityEntity): Promise<boolean> {
        return this.lock.acquire("file", () => {
            return super.pushActivityToQueue(activity);
        });
    }

    async pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean> {
        return this.lock.acquire("file", () => {
            return super.pushActivitiesToQueue(activity);
        });
    }

    async getActiveActivities(): Promise<Array<ActivityEntity>> {
        return this.lock.acquire("file", () => {
            return super.getActiveActivities();
        });
    }

    async initQueue(): Promise<boolean> {
        return this.initQueue();
    }

}