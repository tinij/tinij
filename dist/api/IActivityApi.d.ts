import { ResponseResultEnum } from "../enums/ResponseResultEnum";
import { ActivityEntity } from "../entities/ActivityEntity";
export interface IActivityApi {
    trackActivity(entities: Array<ActivityEntity>): Promise<ResponseResultEnum>;
}
