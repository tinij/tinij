import {IActivityApi} from "../IActivityApi";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {ResponseResultEnum} from "../../enums/ResponseResultEnum";
import {logInfo, logDetail} from "../../utils";
import axios, {AxiosRequestConfig} from 'axios';
import {ConfigService} from "../../configService";
import { logTrace } from "../../utils";

export class ActivityApi implements IActivityApi{

    protected config: ConfigService;

    constructor() {
        this.config = ConfigService.getInstance();
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
                    "TINIJ-API-KEY": await this.config.GetApiKey(),
                    "User-Agent": this.config.GetUserAgent()
                },
            };
            const response = await axios.post(await this.config.GetTrackActivityUrl(), requestData, axiosConfig);
            if (response.status >= 200 && response.status <= 400) {
                logTrace("SENT activities, count: " + entities.length + " response code: " + response.status);
                return ResponseResultEnum.OK;
            }
            else if (response.status >= 400 && response.status <= 500) {
                logTrace("SKIP to send activities, count: " + entities.length + " response code: " + response.status);
                return ResponseResultEnum.SKIP; //something was wrong with payload, ignore it;
            } else {
                logTrace("FAILED to send activities, count: " + entities.length + " response code: " + response.status);
                return ResponseResultEnum.FAILED;
            }
        }
        catch (e) {
         logDetail("Request failed: " + e?.errno);
         return ResponseResultEnum.FAILED;
        }
    }

}
