"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookPlugin = void 0;
const ConfigService_1 = require("../../../src/core/config/ConfigService");
const logger_1 = require("../../../src/infrastructure/logging/logger");
class FacebookPlugin {
    category = 'social';
    name = 'facebook';
    pageId;
    accessToken;
    async initialize() {
        const config = ConfigService_1.ConfigService.getInstance();
        this.pageId = await config.getSecret('FACEBOOK_PAGE_ID');
        this.accessToken = await config.getSecret('FACEBOOK_ACCESS_TOKEN');
        if (!this.pageId || !this.accessToken) {
            logger_1.logger.warn('FacebookPlugin initialized without credentials.');
        }
    }
    isActive() {
        return ConfigService_1.ConfigService.getInstance().getBoolean('ENABLE_FACEBOOK', true);
    }
    validate(params) {
        if (!params.text)
            return 'Text is required for Facebook.';
        return true;
    }
    async publish(params) {
        if (!this.isActive())
            throw new Error('Facebook Plugin is disabled');
        logger_1.logger.info(`Publishing to Facebook Page ${this.pageId}...`);
        const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
        let url = `https://graph.facebook.com/v19.0/${this.pageId}/feed`;
        let body = {
            message: fullText,
            access_token: this.accessToken
        };
        if (params.imageUrl) {
            url = `https://graph.facebook.com/v19.0/${this.pageId}/photos`;
            body.url = params.imageUrl;
            body.caption = fullText;
            delete body.message;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Facebook API Error: ${JSON.stringify(data)}`);
        }
        logger_1.logger.info(`Facebook post published: ${data.id}`);
        return data.id; // Returns Post ID or Photo ID
    }
}
exports.FacebookPlugin = FacebookPlugin;
