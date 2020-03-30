import {IFormatterService} from "./IFormatterService";
import {ActivityEntity} from "../../entities/ActivityEntity";
import {logError} from "../../utils";
import path from "path";

export class FormatterService implements IFormatterService {

    formatActivity(activity: ActivityEntity): ActivityEntity {
        if (activity == null) {
            logError("Nothing to format, activity is null");
            return null;
        }
        let formattedActivity = activity;

        formattedActivity.entity = this.formatEntity(activity.entity);

        return formattedActivity;
    }

    private formatEntity(entity: string) : string {
        return path.basename(entity)
    }

}
