import {IActivityApi} from "../IActivityApi";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {ResponseResultEnum} from "../../enums/ResponseResultEnum";

export class ActivityApi implements IActivityApi{
    trackActivity(entities: Array<ActivityEntity>): Promise<ResponseResultEnum> {
        return undefined;
    }
}
