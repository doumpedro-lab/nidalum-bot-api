"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramPlugin = void 0;
const ConfigService_1 = require("../../../src/core/config/ConfigService");
const logger_1 = require("../../../src/infrastructure/logging/logger");
class InstagramPlugin {
    category = 'social';
    name = 'instagram';
    igAccountId;
    accessToken;
    async initialize() {
        const config = ConfigService_1.ConfigService.getInstance();
        this.igAccountId = await config.getSecret('INSTAGRAM_ACCOUNT_ID');
        this.accessToken = await config.getSecret('FACEBOOK_ACCESS_TOKEN'); // Uses FB token generally
    }
    isActive() {
        return ConfigService_1.ConfigService.getInstance().getBoolean('ENABLE_INSTAGRAM', true);
    }
    validate(params) {
        if (!params.imageUrl)
            return 'Image URL is required for Instagram.';
        return true;
    }
    async publish(params) {
        if (!this.isActive())
            throw new Error('Instagram Plugin is disabled');
        const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
        logger_1.logger.info(`Creating Instagram Media Container...`);
        // 1. Create Media Container
        const createUrl = `https://graph.facebook.com/v19.0/${this.igAccountId}/media`;
        const createRes = await fetch(createUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: params.imageUrl,
                caption: fullText,
                access_token: this.accessToken
            })
        });
        const createData = await createRes.json();
        if (!createRes.ok)
            throw new Error(`IG Create Error: ${JSON.stringify(createData)}`);
        const creationId = createData.id;
        // 2. Publish Media Container
        logger_1.logger.info(`Publishing Instagram Media: ${creationId}`);
        const publishUrl = `https://graph.facebook.com/v19.0/${this.igAccountId}/media_publish`;
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
            throw new Error(`IG Publish Error: ${JSON.stringify(publishData)}`);
        logger_1.logger.info(`Instagram post published: ${publishData.id}`);
        return publishData.id;
    }
}
exports.InstagramPlugin = InstagramPlugin;
