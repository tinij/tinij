import {HeartbeatsTypeEnum} from "../enums/HeartbeatsTypeEnum";
import {IsIn, IsInt, IsString, Length, IsNotEmpty, IsEnum, IsDate, IsNumber, Min, Max} from "class-validator";
import {CategoryEnum} from "../enums/CategoryEnum";
import {isNumber} from "util";
import { PlatformTypeEnum } from "../enums/PlatformTypeEnum";
import { PluginTypeEnum } from "../enums/PluginTypeEnum";

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

  @IsEnum(PluginTypeEnum)
  @IsNotEmpty()
  plugin: PluginTypeEnum;

  @IsEnum(PlatformTypeEnum)
  @IsNotEmpty()
  system: PlatformTypeEnum;

  @IsNotEmpty()
  @IsString()
  @Length(1, 60)
  machine: string;

  @IsDate()
  time: Date;

  project: string;
  branch: string;
  language: string;
  dependencies: string;
  lines: number;
  lineno: number;
  is_write: boolean;
  userId: number;


}
