import Dexie, { type EntityTable } from 'dexie';
import { Resource, Collection } from '../types';

const db = new Dexie('ResourceVaultDB') as Dexie & {
  resources: EntityTable<Resource, 'id'>;
  collections: EntityTable<Collection, 'id'>;
};

db.version(1).stores({
  resources: 'id, type, title, category, createdAt, updatedAt',
  collections: 'id, name, isCustom, createdAt',
});

export { db };
