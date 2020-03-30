import {HeartbeatsTypeEnum} from "../enums/HeartbeatsTypeEnum";
import {IsIn, IsInt, IsString, Length, IsNotEmpty, IsEnum} from "class-validator";
import {CategoryEnum} from "../enums/CategoryEnum";

export class ActivityEntity {

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    entity: string;

    @IsEnum(HeartbeatsTypeEnum)
    @IsNotEmpty()
    type: HeartbeatsTypeEnum;

    @IsEnum(CategoryEnum)
    @IsNotEmpty()
    category: CategoryEnum;

    @IsNotEmpty()
    @IsString()
    @Length(1, 60)
    plugin: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 40)
    system: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    machine: string;

    @IsNotEmpty()
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
