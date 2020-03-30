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

describe('Base test',
    () => {
        it('should return true', () => {
            const tinij = new Tinij("test");
            assert.isNotNull(tinij);
        });
});

describe('Language test',
    () => {
        it('should return JS', () => {
            const tinij = new Tinij("test api");
            let language = tinij.languageDetector.detectLanguageByFileName("alex.js");
            assert.equal(language, "JavaScript");
        });
});

describe('Validation test',
    () => {
        it('should return false for empty activity', async () => {
            const tinij = new Tinij("testKey");
            let activity = new ActivityEntity();
            activity.time = new Date().getUTCMilliseconds();
            let result = await tinij.validationService.validateActivityEntity(activity);
            assert.equal(result, false);

            let pluginName = "testPlugin";
            let entity = "test.ts";
            let category = CategoryEnum.CODING;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            activity.time = new Date().getUTCMilliseconds();
            activity.system = "MacOS";
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

            let pluginName = "testPlugin";
            let entity = "/Users/alexlobanov/Projects/tinij project/tinij-base/test/test.ts";
            let category = CategoryEnum.CODING;
            let writeOperation = false;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            const tinij = new Tinij("testKey");
            await tinij.trackActivity(
                pluginName,
                new Date().getUTCMilliseconds(),
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

            let pluginName = "testPlugin";
            let entity = "/Users/alexlobanov/Projects/tinij project/tinij-base/test/test.ts";
            let category = CategoryEnum.CODING;
            let writeOperation = false;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            const tinij = new Tinij("testKey");
            await tinij.trackActivity(
                pluginName,
                new Date().getUTCMilliseconds(),
                entity,
                category,
                writeOperation,
                project,
                branch,
                lineNumber);

            let popedQueueItems = await tinij.queueService.popActiveActivities();
            assert.equal(popedQueueItems.length, 1, "Queue should have tracked activity item");

            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was removed earlier");
        });
});

describe('Broker event test',
    () => {
        it('should try to send activities to backend', async () => {

            let pluginName = "testPlugin";
            let entity = "/Users/alexlobanov/Projects/tinij project/tinij-base/test/test.ts";
            let category = CategoryEnum.CODING;
            let writeOperation = false;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            const tinij = new FakeTinij();
            const activitiesRecorded = MAX_ACTIVITIES_BEFORE_SEND;
            for (let i = 0; i < activitiesRecorded; i++) {
                await tinij.trackActivity(
                    pluginName,
                    new Date().getUTCMilliseconds(),
                    entity,
                    category,
                    writeOperation,
                    project,
                    branch,
                    i);
            }
            let activityApi = tinij.activityApi as FakeApiService;
            assert.equal(activityApi.isInvoked, true, "Should trying to send activities");
            assert.equal(activityApi.countOfTrackedActivities, activitiesRecorded, "Should send all activities");

            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was sent already");
        });
    });

describe('Machine info test',
    () => {
        it('should return current operation system and name ', async () => {
            const tinij = new Tinij("testKey");
            let result = await tinij.machineInfoService.getMachineInfo();
            console.log("Machine Name: " + result.machineName);
            console.log("OS: " +  result.operationSystem);
        });
});

describe('HTTP request test',
    () => {
        it('should try to send activities to real backend system', async () => {

            let pluginName = "testPlugin";
            let entity = "/Users/alexlobanov/Projects/tinij project/tinij-base/test/test.ts";
            let category = CategoryEnum.CODING;
            let writeOperation = false;
            let project = "testProject";
            let branch = "testBranch";
            let lineNumber = 5;

            const tinij = new Tinij("test");
            const activitiesRecorded = MAX_ACTIVITIES_BEFORE_SEND;
            for (let i = 0; i < activitiesRecorded; i++) {
                await tinij.trackActivity(
                    pluginName,
                    new Date().getUTCMilliseconds(),
                    entity,
                    category,
                    writeOperation,
                    project,
                    branch,
                    i);
            }
            let empty = await tinij.queueService.getActiveActivities();
            assert.equal(empty.length, 0, "Queue should not have tracked activity item - because they was sent already");
        });
    });
