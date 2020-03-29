import { ActivityEntity } from "../entities/ActivityEntity";
export interface IValidator {
    validateActivityEntity(entity: ActivityEntity): Promise<boolean>;
}
export declare class Validator implements IValidator {
    validateActivityEntity(entity: ActivityEntity): Promise<boolean>;
}
