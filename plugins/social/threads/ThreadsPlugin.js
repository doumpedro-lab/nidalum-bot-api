"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsPlugin = void 0;
const ConfigService_1 = require("../../../src/core/config/ConfigService");
const logger_1 = require("../../../src/infrastructure/logging/logger");
class ThreadsPlugin {
    category = 'social';
    name = 'threads';
    threadsAccountId;
    accessToken;
    async initialize() {
        const config = ConfigService_1.ConfigService.getInstance();
        this.threadsAccountId = await config.getSecret('THREADS_ACCOUNT_ID');
        this.accessToken = await config.getSecret('THREADS_ACCESS_TOKEN');
    }
    isActive() {
        return ConfigService_1.ConfigService.getInstance().getBoolean('ENABLE_THREADS', true);
    }
    validate(params) {
        if (!params.text)
            return 'Text is required for Threads.';
        return true;
    }
    async publish(params) {
        if (!this.isActive())
            throw new Error('Threads Plugin is disabled');
        logger_1.logger.info(`Creating Threads Media Container...`);
        const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
        // 1. Create Media Container
        const createUrl = `https://graph.threads.net/v1.0/${this.threadsAccountId}/threads`;
        const payload = {
            media_type: params.imageUrl ? 'IMAGE' : 'TEXT',
            text: fullText,
            access_token: this.accessToken
        };
        if (params.imageUrl)
            payload.image_url = params.imageUrl;
        const createRes = await fetch(createUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        if (!createRes.ok)
            throw new Error(`Threads Create Error: ${JSON.stringify(createData)}`);
        const creationId = createData.id;
        // 2. Publish
        logger_1.logger.info(`Publishing Threads Media: ${creationId}`);
        const publishUrl = `https://graph.threads.net/v1.0/${this.threadsAccountId}/threads_publish`;
        const publishRes = await fetch(publishUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                creation_id: creationId,
                access_token: this.accessToken
            })
        });
        const publishData = await publishRes.json();
        if (!publishRes.ok)
            throw new Error(`Threads Publish Error: ${JSON.stringify(publishData)}`);
        logger_1.logger.info(`Threads post published: ${publishData.id}`);
        return publishData.id;
    }
}
exports.ThreadsPlugin = ThreadsPlugin;
