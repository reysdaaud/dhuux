import fs from 'fs';
import { readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatasetSchema, } from '../types/eval';
import { generateTestCaseId } from '../utils';
import { logger } from '../utils/logger';
export class LocalFileDatasetStore {
    storeRoot;
    indexFile;
    static cachedDatasetStore = null;
    constructor(storeRoot) {
        this.storeRoot = storeRoot;
        this.indexFile = this.getIndexFilePath();
        if (!fs.existsSync(this.storeRoot)) {
            fs.mkdirSync(this.storeRoot, { recursive: true });
        }
        if (!fs.existsSync(this.indexFile)) {
            fs.writeFileSync(path.resolve(this.indexFile), JSON.stringify({}));
        }
        logger.info(`Initialized local file dataset store at root: ${this.storeRoot}`);
    }
    static getDatasetStore() {
        if (!this.cachedDatasetStore) {
            this.cachedDatasetStore = new LocalFileDatasetStore(this.generateRootPath());
        }
        return this.cachedDatasetStore;
    }
    static reset() {
        this.cachedDatasetStore = null;
    }
    async createDataset(req) {
        return this.createDatasetInternal(req);
    }
    async createDatasetInternal(req) {
        const { data, datasetId, schema, targetAction } = req;
        const id = await this.generateDatasetId(datasetId);
        const filePath = path.resolve(this.storeRoot, this.generateFileName(id));
        if (fs.existsSync(filePath)) {
            logger.error(`Dataset already exists at ` + filePath);
            throw new Error(`Create dataset failed: file already exists at {$filePath}`);
        }
        const dataset = this.getDatasetFromInferenceDataset(data);
        logger.info(`Saving Dataset to ` + filePath);
        await writeFile(filePath, JSON.stringify(dataset));
        const now = new Date().toString();
        const metadata = {
            datasetId: id,
            schema,
            targetAction,
            size: dataset.length,
            version: 1,
            datasetType: req.datasetType,
            createTime: now,
            updateTime: now,
        };
        let metadataMap = await this.getMetadataMap();
        metadataMap[id] = metadata;
        logger.debug(`Saving DatasetMetadata for ID ${id} to ` + path.resolve(this.indexFile));
        await writeFile(path.resolve(this.indexFile), JSON.stringify(metadataMap));
        return metadata;
    }
    async updateDataset(req) {
        const { datasetId, data, schema, targetAction } = req;
        const filePath = path.resolve(this.storeRoot, this.generateFileName(datasetId));
        if (!fs.existsSync(filePath)) {
            throw new Error(`Update dataset failed: dataset not found`);
        }
        let metadataMap = await this.getMetadataMap();
        const prevMetadata = metadataMap[datasetId];
        if (!prevMetadata) {
            throw new Error(`Update dataset failed: dataset metadata not found`);
        }
        const patch = this.getDatasetFromInferenceDataset(data ?? []);
        let newSize = prevMetadata.size;
        if (patch.length > 0) {
            logger.info(`Updating Dataset at ` + filePath);
            newSize = await this.patchDataset(datasetId, patch, filePath);
        }
        const now = new Date().toString();
        const newMetadata = {
            datasetId: datasetId,
            size: newSize,
            schema: schema ? schema : prevMetadata.schema,
            targetAction: targetAction ? targetAction : prevMetadata.targetAction,
            version: data ? prevMetadata.version + 1 : prevMetadata.version,
            datasetType: prevMetadata.datasetType,
            createTime: prevMetadata.createTime,
            updateTime: now,
        };
        logger.debug(`Updating DatasetMetadata for ID ${datasetId} at ` +
            path.resolve(this.indexFile));
        metadataMap[datasetId] = newMetadata;
        await writeFile(path.resolve(this.indexFile), JSON.stringify(metadataMap));
        return newMetadata;
    }
    async getDataset(datasetId) {
        const filePath = path.resolve(this.storeRoot, this.generateFileName(datasetId));
        if (!fs.existsSync(filePath)) {
            throw new Error(`Dataset not found for dataset ID ${datasetId}`);
        }
        return await readFile(filePath, 'utf8').then((data) => {
            return DatasetSchema.parse(JSON.parse(data));
        });
    }
    async listDatasets() {
        return this.getMetadataMap().then((metadataMap) => {
            let metadatas = [];
            for (var key in metadataMap) {
                metadatas.push(metadataMap[key]);
            }
            return metadatas;
        });
    }
    async deleteDataset(datasetId) {
        const filePath = path.resolve(this.storeRoot, this.generateFileName(datasetId));
        await rm(filePath);
        let metadataMap = await this.getMetadataMap();
        delete metadataMap[datasetId];
        logger.debug(`Deleting DatasetMetadata for ID ${datasetId} in ` +
            path.resolve(this.indexFile));
        await writeFile(path.resolve(this.indexFile), JSON.stringify(metadataMap));
    }
    static generateRootPath() {
        return path.resolve(process.cwd(), `.genkit/datasets`);
    }
    async generateDatasetId(datasetId) {
        const metadataMap = await this.getMetadataMap();
        const keys = Object.keys(metadataMap);
        if (datasetId) {
            const isValid = /^[A-Za-z][A-Za-z0-9_.-]{4,34}[A-Za-z0-9]$/g.test(datasetId);
            if (!isValid) {
                throw new Error('Invalid datasetId provided. ID must be alphanumeric, with hyphens, dots and dashes. Is must start with an alphabet, end with an alphabet or a number, and must be 6-36 characters long.');
            }
            return this.testUniqueness(datasetId, keys);
        }
        const id = uuidv4();
        return this.testUniqueness(id, keys);
    }
    testUniqueness(datasetId, keys) {
        if (!keys.some((i) => i === datasetId)) {
            return datasetId;
        }
        throw new Error(`Dataset ID not unique: ${datasetId}`);
    }
    generateFileName(datasetId) {
        return `${datasetId}.json`;
    }
    getIndexFilePath() {
        return path.resolve(this.storeRoot, 'index.json');
    }
    async getMetadataMap() {
        if (!fs.existsSync(this.indexFile)) {
            return Promise.resolve({});
        }
        return await readFile(path.resolve(this.indexFile), 'utf8').then((data) => JSON.parse(data));
    }
    getDatasetFromInferenceDataset(data) {
        return data.map((d) => ({
            testCaseId: d.testCaseId ?? generateTestCaseId(),
            ...d,
        }));
    }
    async patchDataset(datasetId, patch, filePath) {
        const existingDataset = await this.getDataset(datasetId);
        const datasetMap = new Map(existingDataset.map((d) => [d.testCaseId, d]));
        const patchMap = new Map(patch.map((d) => [d.testCaseId, d]));
        patchMap.forEach((value, key) => {
            if (value.testCaseId && !value.input && !value.reference) {
                datasetMap.delete(key);
            }
            else {
                datasetMap.set(key, value);
            }
        });
        const newDataset = Array.from(datasetMap.values());
        await writeFile(filePath, JSON.stringify(newDataset));
        return newDataset.length;
    }
}
//# sourceMappingURL=localFileDatasetStore.js.map