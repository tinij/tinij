import { ActivityEntity } from "../../entities/ActivityEntity";
export interface IQueueService {
    initQueue(): Promise<boolean>;
    pushActivityToQueue(activity: ActivityEntity): Promise<boolean>;
    pushActivitiesToQueue(activity: Array<ActivityEntity>): Promise<boolean>;
    popActiveActivities(): Promise<Array<ActivityEntity>>;
}
