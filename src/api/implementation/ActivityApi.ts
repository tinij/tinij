import {IActivityApi} from "../IActivityApi";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {ResponseResultEnum} from "../../enums/ResponseResultEnum";
import {logInfo} from "../../utils";
import axios, {AxiosRequestConfig} from 'axios';
import {ConfigSingleton} from "../../configSingleton";

export class ActivityApi implements IActivityApi{

    protected config: ConfigSingleton;

    constructor() {
        this.config = ConfigSingleton.getInstance();
    }

    async trackActivity(entities: Array<ActivityEntity>): Promise<ResponseResultEnum> {
        try {
            if (entities == null || entities.length == 0) {
                logInfo("Noting to track.");
                return ResponseResultEnum.EMPTY;
            }

            let requestData = entities;
            let axiosConfig : AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Access-Control-Allow-Origin": "*",
                    "TINIJ-API-KEY": this.config.GetApiKey(),
                    "User-Agent": this.config.GetUserAgent()
                },
            };
            const response = await axios.post(this.config.GetTrackActivityUrl(), requestData, axiosConfig);
            if (response.status >= 200 && response.status <= 400)
                return ResponseResultEnum.OK;
            else if (response.status >= 400 && response.status <= 500) {
                return ResponseResultEnum.SKIP; //something was wrong with payload, ignore it;
            } else
                return ResponseResultEnum.FAILED;
        }
        catch (e) {
         return ResponseResultEnum.FAILED;
        }
    }

}
