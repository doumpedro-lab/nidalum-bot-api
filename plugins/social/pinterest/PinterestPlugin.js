"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinterestPlugin = void 0;
const ConfigService_1 = require("../../../src/core/config/ConfigService");
const logger_1 = require("../../../src/infrastructure/logging/logger");
class PinterestPlugin {
    category = 'social';
    name = 'pinterest';
    boardId;
    accessToken;
    async initialize() {
        const config = ConfigService_1.ConfigService.getInstance();
        this.boardId = await config.getSecret('PINTEREST_BOARD_ID');
        this.accessToken = await config.getSecret('PINTEREST_ACCESS_TOKEN');
    }
    isActive() {
        return ConfigService_1.ConfigService.getInstance().getBoolean('ENABLE_PINTEREST', true);
    }
    validate(params) {
        if (!params.imageUrl)
            return 'Image URL is required for Pinterest.';
        return true;
    }
    async publish(params) {
        if (!this.isActive())
            throw new Error('Pinterest Plugin is disabled');
        logger_1.logger.info(`Publishing to Pinterest Board ${this.boardId}...`);
        const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
        const url = `https://api.pinterest.com/v5/pins`;
        const body = {
            board_id: this.boardId,
            media_source: {
                source_type: 'image_url',
                url: params.imageUrl
            },
            description: fullText
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Pinterest API Error: ${JSON.stringify(data)}`);
        }
        logger_1.logger.info(`Pinterest pin published: ${data.id}`);
        return data.id;
    }
}
exports.PinterestPlugin = PinterestPlugin;
