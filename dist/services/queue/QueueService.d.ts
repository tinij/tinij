import { IQueueService } from "./IQueueService";
import { ActivityEntity } from "../../entities/ActivityEntity";
import { IMessageBroker } from "../IMessageBroker";
export declare class QueueService implements IQueueService {
    activeQueue: Array<ActivityEntity>;
    private readonly messageBroker;
    constructor(messageBroker: IMessageBroker);
    popActiveActivities(): Promise<Array<ActivityEntity>>;
    initQueue(): Promise<boolean>;
    pushActivityToQueue(activity: ActivityEntity): Promise<boolean>;
    pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean>;
}
