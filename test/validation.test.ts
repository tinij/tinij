import {describe} from "mocha";
import {generateTinijTestInstance} from "./utils";
import {ActivityEntity, CategoryEnum, HeartbeatsTypeEnum, PlatformTypeEnum, PluginTypeEnum} from "../src";
import {assert} from "chai";

describe('Validation test',
    () => {
        it('should return false for empty activity', async () => {
            let tinij = await generateTinijTestInstance(0);

            let activity = new ActivityEntity();
            activity.time = new Date();

            let pluginName = PluginTypeEnum.VSCODE;
            let entity = "test.ts";
            let category = CategoryEnum.CODING;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            activity.time = new Date();
            activity.system = PlatformTypeEnum.MacOS;
            activity.machine = "testExecutor";
            activity.plugin = pluginName;
            activity.entity = entity;
            activity.category = category;
            activity.is_write = false;
            activity.project = project;
            activity.branch = branch;
            activity.lineno = lineNumber;
            activity.type = HeartbeatsTypeEnum.File;

            let validActivity = await tinij.validationService.validateActivityEntity(activity);

            assert.equal(validActivity, true);
        });
    });
