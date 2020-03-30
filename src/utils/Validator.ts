import {ActivityEntity} from "../entities/ActivityEntity";
import {logError, validateTime} from "./index";
import {validate} from "class-validator";

export interface IValidator {
    validateActivityEntity(entity: ActivityEntity) : Promise<boolean>;
}

export class Validator implements IValidator {
    async validateActivityEntity(entity: ActivityEntity): Promise<boolean> {
        let entityDate = entity.time;
        if (!validateTime(entityDate)) {
            logError("Entity date validation failed: " + entityDate);
            return false;
        }
        let validationResult = await validate(entity);
        if (validationResult == null || validationResult.length == 0)
            return true;
        logError(JSON.stringify(validationResult));
        return false;
    }
}
