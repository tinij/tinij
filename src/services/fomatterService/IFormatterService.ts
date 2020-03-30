import {ActivityEntity} from "../../entities/ActivityEntity";

export interface IFormatterService {
    formatActivity(activity: ActivityEntity) : ActivityEntity;
}
