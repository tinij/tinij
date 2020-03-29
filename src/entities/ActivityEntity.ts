import {HeartbeatsTypeEnum} from "../enums/HeartbeatsTypeEnum";
import {IsIn, IsInt, IsString, Length} from "class-validator";

export class ActivityEntity {

    @IsString()
    @Length(1, 50)
    entity: string;

    @IsInt()
    type: HeartbeatsTypeEnum;

    @IsString()
    @Length(1, 50)
    category: string;

    @IsString()
    plugin: string;

    @IsString()
    system: string;

    @IsInt()
    time: number;
    project: string;
    branch: string;
    language: string;
    dependencies: string;
    lines: number;
    lineno: number;
    is_write: boolean;


}
