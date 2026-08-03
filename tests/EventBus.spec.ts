import { MemoryEventBus } from '../src/core/events/EventBus';

describe('MemoryEventBus', () => {
  let eventBus: MemoryEventBus;

  beforeEach(() => {
    eventBus = new MemoryEventBus();
  });

  it('should allow subscription and publish events to handlers', async () => {
    let handledPayload: any = null;
    const handler = async (payload: any) => {
      handledPayload = payload;
    };

    eventBus.subscribe('TestEvent', handler);
    await eventBus.publish('TestEvent', { data: 123 });

    // Wait a tick for the async handler to process
    await new Promise(process.nextTick);

    expect(handledPayload).toEqual({ data: 123 });
  });

  it('should not call unsubscribed handlers', async () => {
    let handledCount = 0;
    const handler = async (payload: any) => {
      handledCount++;
    };

    eventBus.subscribe('TestEvent', handler);
    eventBus.unsubscribe('TestEvent', handler);
    await eventBus.publish('TestEvent', { data: 123 });

    await new Promise(process.nextTick);

    expect(handledCount).toBe(0);
  });
});
