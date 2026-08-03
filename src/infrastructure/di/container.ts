import 'reflect-metadata';
import { container } from 'tsyringe';
import { MemoryEventBus } from '../../core/events/EventBus';
import { LocalQueueProvider } from '../providers/queue/LocalQueueProvider';
import { FirestoreProvider } from '../providers/cloud/FirestoreProvider';
import { FirebaseStorageProvider } from '../providers/cloud/FirebaseStorageProvider';
import { GeminiProvider } from '../providers/cloud/GeminiProvider';

// Event Bus
container.registerSingleton('IEventBus', MemoryEventBus);

// Queue Provider
container.registerSingleton('IQueueProvider', LocalQueueProvider);

// Database Provider
container.registerSingleton('IDatabaseProvider', FirestoreProvider);

// Storage Provider
container.registerSingleton('IStorageProvider', FirebaseStorageProvider);

// AI Provider
container.registerSingleton('IAIProvider', GeminiProvider);

export { container };
