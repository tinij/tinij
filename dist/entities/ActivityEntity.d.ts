import { HeartbeatsTypeEnum } from "../enums/HeartbeatsTypeEnum";
export declare class ActivityEntity {
    entity: string;
    type: HeartbeatsTypeEnum;
    category: string;
    plugin: string;
    system: string;
    time: number;
    project: string;
    branch: string;
    language: string;
    dependencies: string;
    lines: number;
    lineno: number;
    is_write: boolean;
}
