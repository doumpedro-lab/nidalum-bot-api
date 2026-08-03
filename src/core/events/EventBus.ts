import { EventHandler, IEventBus } from '../interfaces/IEventBus';
import { logger } from '../../infrastructure/logging/logger';

export class MemoryEventBus implements IEventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  async publish<T>(eventName: string, payload: T): Promise<void> {
    logger.info(`[EventBus] Emitting event: ${eventName}`);
    const eventHandlers = this.handlers.get(eventName) || [];
    
    // Fire and forget (async)
    eventHandlers.forEach(handler => {
      handler(payload).catch(err => {
        logger.error(`[EventBus] Error in handler for event: ${eventName}`, err);
      });
    });
  }

  subscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const currentHandlers = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...currentHandlers, handler]);
    logger.info(`[EventBus] Subscribed to event: ${eventName}`);
  }

  unsubscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const currentHandlers = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, currentHandlers.filter(h => h !== handler));
  }
}
