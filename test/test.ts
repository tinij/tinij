import { Tinij } from '../src';
import 'mocha';
import {describe} from "mocha";
import { assert } from "chai";
import {ActivityEntity} from "../src/entities/ActivityEntity";
import {HeartbeatsTypeEnum} from "../src/enums/HeartbeatsTypeEnum";
import {CategoryEnum} from "../src/enums/CategoryEnum";
import {FakeTinij} from "./fakeMethods/FakeTinij";
import {FakeApiService} from "./fakeMethods/FakeApiService";
import {MAX_ACTIVITIES_BEFORE_SEND} from "../src/constants";
import { PluginTypeEnum } from '../src/enums/PluginTypeEnum';
import { PlatformTypeEnum } from '../src/enums/PlatformTypeEnum';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import { EventType } from '../src/services/messageBroker/IMessageBroker';
import { FakeBrokerService } from './fakeMethods/FakeBrokerService';

describe('Base test',
    () => {
        it('should return true', async () => {
            let tinij = await generateTinijTestInstance(0);
            assert.isNotNull(tinij);
        });
});

describe('Language test',
    () => {
        it('should return JS', async () => {
            let tinij = await generateTinijTestInstance(0);
            let language = tinij.languageDetector.detectLanguageByFileName("alex.js");
            assert.equal(language, "JavaScript");
        });
});

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

describe('Activity track test',
    () => {
        it('should have one activity created', async () => {

            let pluginName = PluginTypeEnum.VSCODE;
            let entity = "/Users/alexlobanov/Projects/tinij project/tinij-base/test/test.ts";
            let category = CategoryEnum.CODING;
            let writeOperation = false;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            const tinij = new Tinij("testKey");
            await tinij.initServices();
            await tinij.clearRecordedLogs();
            await tinij.trackActivity(
                pluginName,
                new Date(),
                entity,
                category,
                writeOperation,
                project,
                branch,
                lineNumber);

            let queueItems = await tinij.queueService.getActiveActivities();
            assert.equal(queueItems.length, 1, "Queue should have tracked activity item");

            let createdActivityItem = queueItems[0];

            assert.equal(createdActivityItem.plugin, pluginName);
            assert.equal(createdActivityItem.category, category);
            assert.equal(createdActivityItem.is_write, writeOperation);
            assert.equal(createdActivityItem.project, project);
            assert.equal(createdActivityItem.branch, branch);
            assert.equal(createdActivityItem.lineno, lineNumber);
            assert.equal(createdActivityItem.entity, "test.ts");
        });
});

describe('Activity queue test',
    () => {
        it('should have one activity created and removed', async () => {
            console.log("START");
            let tinij = await generateTinijTestInstance(1);
            let popedQueueItems = await tinij.queueService.popActiveActivities();
            assert.equal(popedQueueItems.length, 1, "Queue should have tracked activity item");
            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was removed earlier");

        });

        it('pop and push tests', async () => {
            console.log("START");
            let tinij = await generateTinijTestInstance(1);
            let popedQueueItems = await tinij.queueService.popActiveActivities();
            assert.equal(popedQueueItems.length, 1, "Queue should have tracked activity item");

            await tinij.queueService.pushActivitiesToQueue(popedQueueItems);
            var updated = await tinij.queueService.getActiveActivities();
            assert.equal(updated.length, 1, "Queue should have tracked activity item");

            await tinij.queueService.popActiveActivities();
            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was removed earlier");
        });
});

describe('Broker event test',
    () => {
        it('should try to send activities to backend', async () => {
            const tinijFake = new FakeTinij(false);
            const activitiesRecorded = MAX_ACTIVITIES_BEFORE_SEND;
            let tinij = await generateTinijTestInstance(activitiesRecorded, tinijFake);
            let activityApi = tinij.activityApi as FakeApiService;
            let broker = tinij.simpleMessageBroker as FakeBrokerService;

            assert.equal(broker.invokedEvent, true, "[broker]Should trying to send activities");

            assert.equal(activityApi.isInvoked, true, "[api]Should trying to send activities");
            assert.equal(activityApi.countOfTrackedActivities, activitiesRecorded, "Should send all activities");

            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was sent already");
        });
    });

describe('Machine info test',
    () => {
        it('should return current operation system and name ', async () => {
            let tinij = await generateTinijTestInstance(0);
            let result = await tinij.machineInfoService.getMachineInfo();
            console.log("Machine Name: " + result.machineName);
            console.log("OS: " +  result.operationSystem);
        });
});

describe('Settings write test',
    () => {
        it('should return current new API url', async () => {
            let tinij = await generateTinijTestInstance(0);
            let config = tinij.getConfig();
            let newUrl = "https://tinij.2.com/test";
            await config.SetTrackActivityUrl(newUrl);
            let url = await config.GetTrackActivityUrl();
            assert.equal(url, newUrl, "URL should be new one");
        });

        it('should return found new ApiToken', async () => {
            let tinij = await generateTinijTestInstance(0);
            await tinij.resetSettingsToDefault();

            let config = tinij.getConfig();

            console.log("APIKEY: " + await config.GetApiKey());

            assert.isNotTrue(await tinij.isApiKeyExist());
            
            await tinij.setApiKey("test");
            assert.isTrue(await tinij.isApiKeyExist());
        });
});

describe('Api Token Test',
    () => {
        it('Should return new api token key', async () => {
            let tinij = await generateTinijTestInstance(0);
            let newKey = "29df8b6f-cb4e-410e-9c64-e16df1262f22" + Date.now()
            await tinij.setApiKey(newKey);
            assert.equal(await tinij.isApiKeyExist(), true);

            let config = tinij.getConfig();
            assert.equal(await config.GetApiKey(), newKey);
        });
});

describe('Git info test',
    () => {
        it('should return current branch', async () => {
            let tinij = await generateTinijTestInstance(1, undefined, true);
            let popedQueueItems = await tinij.queueService.popActiveActivities();
            assert.equal(popedQueueItems.length, 1, "Queue should have tracked activity item");
            let createdObject = popedQueueItems[0];
            console.log(createdObject.branch);
        });
    });

describe('File system tests',
    () => {
        it('should have local file with activities created', async () => {
            const activitiesRecorded = MAX_ACTIVITIES_BEFORE_SEND - 1;
            let tinij = await generateTinijTestInstance(activitiesRecorded);

            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, activitiesRecorded, "Queue should have tracked activity item");

            let config = tinij.getConfig().GetActivityFileLocation();
            let parse = await fsPromises.readFile(config, { encoding: "utf8" });
            let array = JSON.parse(parse);
            assert.equal(array.length, activitiesRecorded);
        });

        it('should have config file created', async () => {
            let tinij = await generateTinijTestInstance(0);

            let config = tinij.getConfig().GetConfigLocation();
            let parse = await fsPromises.readFile(config, { encoding: "utf8" });
            let array = JSON.parse(parse);
            assert.isNotNull(array);
        });
});

describe('HTTP request test',
    () => {
        it('should try to send activities to real backend system', async () => {
            const activitiesRecorded = MAX_ACTIVITIES_BEFORE_SEND;
            let tinij = await generateTinijTestInstance(activitiesRecorded);

            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was sent already");
        });
});


describe('Reset to default tests',
    () => {
        it('should clear recorded logs to default', async () => {
            let tinij = await generateTinijTestInstance(10);
            let result = await tinij.clearRecordedLogs();
            assert.equal(result, true);

            let queueItems = await tinij.queueService.getActiveActivities();
            assert.equal(queueItems == null || queueItems.length == 0, true);
        });

        it('should reset settings to default', async () => {
            let tinij = await generateTinijTestInstance(0);
            let result = await tinij.resetSettingsToDefault();

            assert.equal(result, true);
        });
});


async function generateTinijTestInstance(countOfActivities: number, customTinij?: FakeTinij, ignoreBranch?: boolean) : Promise<Tinij> {
    let pluginName = PluginTypeEnum.VSCODE;
    let entity = "/Users/alexlobanov/Projects/tinij-project/tinij-base/test/fakeMethods/FakeApiService.ts";
    let category = CategoryEnum.CODING;
    let writeOperation = false;
    let project = "testProject";
    let branch = "testBranch";
    if (ignoreBranch) {
        branch = undefined;
    }
    let lineNumber = 5;

    let tinij = new FakeTinij(false);
    if (customTinij != null) {
        tinij = customTinij;
    }
    await tinij.initServices();
    await tinij.clearRecordedLogs();
    if (countOfActivities != 0) {
        for (let i = 0; i < countOfActivities; i++) {
            await tinij.trackActivity(
                pluginName,
                new Date(),
                entity,
                category,
                writeOperation,
                project,
                branch,
                i);
        }
        await new Promise(resolve =>
            setTimeout(resolve, 10) // allow time to cleanup
        );
    }
    return tinij;
}