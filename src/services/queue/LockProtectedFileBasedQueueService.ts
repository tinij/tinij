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
        let result = super.popActiveActivities();

        return this.lock.acquire("file", async (done) => {
            done(null, await result);
        });
    }

    pushActivityToQueue(activity: ActivityEntity): Promise<boolean> {
        let result = super.pushActivityToQueue(activity);

        return this.lock.acquire("file", async (done) => {
            done(null, await result);
        });
    }

    pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean> {
        let result = super.pushActivitiesToQueue(activity);

        return this.lock.acquire("file", async (done) => {
            done(null, await result);
        });
    }

    getActiveActivities(): Promise<Array<ActivityEntity>> {
        let result = super.getActiveActivities();

        return this.lock.acquire("file", async (done) => {
            done(null, await result);
        });
    }

    initQueue(): Promise<boolean> {
        return super.initQueue();
    }

}