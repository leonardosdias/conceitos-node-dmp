import { container } from 'tsyringe';

import IStorageProvider from './models/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorage';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);
