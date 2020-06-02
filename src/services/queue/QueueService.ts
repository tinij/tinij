import {IQueueService} from "./IQueueService";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {MAX_ACTIVITIES_BEFORE_SEND} from "../../constants";
import {EventType, IMessageBroker} from "../messageBroker/IMessageBroker";

export class QueueService implements IQueueService {

    activeQueue: Array<ActivityEntity>;

    private readonly messageBroker: IMessageBroker;

    constructor(messageBroker: IMessageBroker) {
        this.messageBroker = messageBroker;
    }

    async popActiveActivities(): Promise<Array<ActivityEntity>> {
        let activeActivities = this.activeQueue;
        this.activeQueue = new Array<ActivityEntity>();
        return activeActivities;
    }

    async initQueue(): Promise<boolean> {
        this.activeQueue = new Array<ActivityEntity>();
        return true;
    }

    async pushActivityToQueue(activity: ActivityEntity): Promise<boolean> {
        this.activeQueue.push(activity);

        if (this.activeQueue.length >= MAX_ACTIVITIES_BEFORE_SEND)
            this.messageBroker.invokeEvent(EventType.QUEUE_MIN_LIMIT_REACHED);

        return true;
    }

    async pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean> {
        if (activity == null || activity.length == 0)
            return true;
        for (let active of activity) {
            this.activeQueue.push(active);
        }
        return true;
    }

    async getActiveActivities(): Promise<Array<ActivityEntity>> {
        return this.activeQueue;
    }

}
