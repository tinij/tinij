import {IActivityApi} from "../../src/api/IActivityApi";
import {ActivityEntity} from "../../src/entities/ActivityEntity";
import {ResponseResultEnum} from "../../src/enums/ResponseResultEnum";

export class FakeApiService implements IActivityApi{

    countOfTrackedActivities: number;
    isInvoked: boolean;

    async trackActivity(entities: Array<ActivityEntity>): Promise<ResponseResultEnum> {
        this.countOfTrackedActivities = entities.length;
        this.isInvoked = true;
        return ResponseResultEnum.OK;
    }

}
