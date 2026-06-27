import { Contact } from '../types';

export interface SyncAction {
  id?: string | number; // For updates/deletes
  tempId?: string; // For tracing offline creations
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'BULK_DELETE' | 'BULK_UPDATE_GROUPS' | 'BULK_UPDATE_TAGS';
  data: any;
  timestamp: number;
}

class SyncManager {
  private syncQueueKey = 'brain_crm_sync_queue';
  private contactsCacheKey = 'brain_crm_contacts_cache';
  private groupsCacheKey = 'brain_crm_groups_cache';
  private tagsCacheKey = 'brain_crm_tags_cache';
  private syncListeners: (() => void)[] = [];
  private connectionListeners: ((online: boolean) => void)[] = [];
  private isSyncing = false;

  constructor() {
    // Monitor online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.notifyConnection(true);
        this.syncNow();
      });
      window.addEventListener('offline', () => {
        this.notifyConnection(false);
      });
    }
  }

  // Check if we are online
  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Subscribe to sync queue completions / changes
  public onSyncChange(callback: () => void) {
    this.syncListeners.push(callback);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== callback);
    };
  }

  // Subscribe to online/offline state changes
  public onConnectionChange(callback: (online: boolean) => void) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== callback);
    };
  }

  private notifySync() {
    this.syncListeners.forEach(listener => {
      try { listener(); } catch (e) { console.error(e); }
    });
  }

  private notifyConnection(online: boolean) {
    this.connectionListeners.forEach(listener => {
      try { listener(online); } catch (e) { console.error(e); }
    });
  }

  // Cache handlers
  private getCachedContacts(): Contact[] {
    const data = localStorage.getItem(this.contactsCacheKey);
    return data ? JSON.parse(data) : [];
  }

  private setCachedContacts(contacts: Contact[]) {
    localStorage.setItem(this.contactsCacheKey, JSON.stringify(contacts));
  }

  private getCachedGroups(): string[] {
    const data = localStorage.getItem(this.groupsCacheKey);
    return data ? JSON.parse(data) : [];
  }

  private setCachedGroups(groups: string[]) {
    localStorage.setItem(this.groupsCacheKey, JSON.stringify(groups));
  }

  private getCachedTags(): string[] {
    const data = localStorage.getItem(this.tagsCacheKey);
    return data ? JSON.parse(data) : [];
  }

  private setCachedTags(tags: string[]) {
    localStorage.setItem(this.tagsCacheKey, JSON.stringify(tags));
  }

  // Sync Queue handlers
  public getSyncQueue(): SyncAction[] {
    const data = localStorage.getItem(this.syncQueueKey);
    return data ? JSON.parse(data) : [];
  }

  private saveSyncQueue(queue: SyncAction[]) {
    localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
    this.notifySync();
  }

  private addToQueue(action: SyncAction) {
    const queue = this.getSyncQueue();
    queue.push(action);
    this.saveSyncQueue(queue);
    
    // Attempt automatic sync if we are online
    if (this.isOnline()) {
      this.syncNow();
    }
  }

  // Main Methods: Contacts
  public async getContacts(filters?: { search?: string; group?: string; tag?: string }): Promise<Contact[]> {
    let contacts: Contact[] = [];

    if (this.isOnline()) {
      try {
        const queryParams = new URLSearchParams();
        if (filters) {
          if (filters.search) queryParams.append('search', filters.search);
          if (filters.group) queryParams.append('group', filters.group);
          if (filters.tag) queryParams.append('tag', filters.tag);
        }

        const url = `/api/contacts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);
        if (response.ok) {
          contacts = await response.json();
          
          // If no filters are active, cache this as the complete contact list.
          // Otherwise, fetch the full contact list in the background to keep the cache warm,
          // so offline mode always has access to the full database.
          if (!filters || (!filters.search && !filters.group && !filters.tag)) {
            this.setCachedContacts(contacts);
          } else {
            fetch('/api/contacts')
              .then(res => {
                if (res.ok) return res.json();
                throw new Error('Unfiltered fetch failed');
              })
              .then(allContacts => {
                this.setCachedContacts(allContacts);
              })
              .catch(err => {
                console.warn('[Sync Engine] Background cache warming failed:', err);
              });
          }
          
          // Refresh groups and tags cache in background
          this.fetchAndCacheGroupsAndTags();
        } else {
          contacts = this.getCachedContacts();
        }
      } catch (err) {
        console.warn('Failed to fetch contacts online. Using offline cache...', err);
        contacts = this.getCachedContacts();
      }
    } else {
      contacts = this.getCachedContacts();
    }

    // Apply Client-Side Filtering (Crucial for Offline High-Fidelity experience and local fallbacks)
    if (filters) {
      const { search, group, tag } = filters;
      
      if (search) {
        const lowerSearch = search.toLowerCase();
        contacts = contacts.filter(c => 
          (c.name && c.name.toLowerCase().includes(lowerSearch)) ||
          (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
          (c.phone && c.phone.includes(lowerSearch)) ||
          (c.company && c.company.toLowerCase().includes(lowerSearch)) ||
          (c.tags && c.tags.toLowerCase().includes(lowerSearch)) ||
          (c.group_name && c.group_name.toLowerCase().includes(lowerSearch))
        );
      }

      if (group) {
        const lowerGroup = group.trim().toLowerCase();
        contacts = contacts.filter(c => c.group_name && c.group_name.trim().toLowerCase() === lowerGroup);
      }

      if (tag) {
        const lowerTag = tag.trim().toLowerCase();
        contacts = contacts.filter(c => 
          c.tags && c.tags.split(',').map(t => t.trim().toLowerCase()).includes(lowerTag)
        );
      }
    }

    return contacts;
  }

  private async fetchAndCacheGroupsAndTags() {
    try {
      const [gRes, tRes] = await Promise.all([
        fetch('/api/groups'),
        fetch('/api/tags')
      ]);
      if (gRes.ok) {
        const groups = await gRes.json();
        this.setCachedGroups(groups);
      }
      if (tRes.ok) {
        const tags = await tRes.json();
        this.setCachedTags(tags);
      }
    } catch (e) {
      console.warn('Failed to refresh groups/tags cache in background:', e);
    }
  }

  public getGroups(): string[] {
    if (this.isOnline()) {
      this.fetchAndCacheGroupsAndTags();
    }
    // Compute dynamically from cached contacts in case direct fetch hasn't completed
    const contacts = this.getCachedContacts();
    const groupsSet = new Set<string>();
    contacts.forEach(c => {
      if (c.group_name && c.group_name.trim()) {
        groupsSet.add(c.group_name.trim());
      }
    });
    const computed = Array.from(groupsSet).sort();
    const cached = this.getCachedGroups();
    return computed.length > 0 ? computed : cached;
  }

  public getTags(): string[] {
    if (this.isOnline()) {
      this.fetchAndCacheGroupsAndTags();
    }
    // Compute dynamically from cached contacts in case direct fetch hasn't completed
    const contacts = this.getCachedContacts();
    const tagsSet = new Set<string>();
    contacts.forEach(c => {
      if (c.tags) {
        c.tags.split(',').forEach(t => {
          const trimmed = t.trim();
          if (trimmed) tagsSet.add(trimmed);
        });
      }
    });
    const computed = Array.from(tagsSet).sort();
    const cached = this.getCachedTags();
    return computed.length > 0 ? computed : cached;
  }

  // Create Contact
  public async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    if (this.isOnline()) {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (response.ok) {
        const newContact = await response.json();
        // Update local cache
        const cache = this.getCachedContacts();
        cache.push(newContact);
        this.setCachedContacts(cache);
        this.fetchAndCacheGroupsAndTags();
        return newContact;
      }
      throw new Error('Server returned error on creating contact');
    } else {
      // Offline Flow
      const tempId = 'temp_' + Date.now();
      const newContact: Contact = {
        ...contact,
        id: tempId as any,
        created_at: new Date().toISOString()
      };

      // Update local cache instantly (Optimistic UI)
      const cache = this.getCachedContacts();
      cache.push(newContact);
      this.setCachedContacts(cache);

      // Queue action
      this.addToQueue({
        action: 'CREATE',
        tempId,
        data: contact,
        timestamp: Date.now()
      });

      return newContact;
    }
  }

  // Update Contact
  public async updateContact(id: number | string, contact: Contact): Promise<Contact> {
    if (this.isOnline() && typeof id === 'number') {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (response.ok) {
        const updated = await response.json();
        // Update cache
        const cache = this.getCachedContacts();
        const index = cache.findIndex(c => c.id === id);
        if (index !== -1) {
          cache[index] = updated;
          this.setCachedContacts(cache);
        }
        this.fetchAndCacheGroupsAndTags();
        return updated;
      }
      throw new Error('Server returned error on updating contact');
    } else {
      // Offline Flow or Temp Contact
      const cache = this.getCachedContacts();
      const index = cache.findIndex(c => c.id === id);
      const updatedContact = { ...contact, id: id as any };
      
      if (index !== -1) {
        cache[index] = updatedContact;
        this.setCachedContacts(cache);
      }

      // If updating a temp contact, check if it's already in queue
      if (typeof id === 'string' && id.startsWith('temp_')) {
        const queue = this.getSyncQueue();
        const createIdx = queue.findIndex(q => q.action === 'CREATE' && q.tempId === id);
        if (createIdx !== -1) {
          // Just update the CREATE data directly in the queue! This is highly elegant.
          queue[createIdx].data = contact;
          this.saveSyncQueue(queue);
          return updatedContact;
        }
      }

      // Queue general update
      this.addToQueue({
        action: 'UPDATE',
        id,
        data: contact,
        timestamp: Date.now()
      });

      return updatedContact;
    }
  }

  // Delete Contact
  public async deleteContact(id: number | string): Promise<void> {
    if (this.isOnline() && typeof id === 'number') {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Update cache
        const cache = this.getCachedContacts();
        const updatedCache = cache.filter(c => c.id !== id);
        this.setCachedContacts(updatedCache);
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error('Server returned error on deleting contact');
    } else {
      // Offline Flow or Temp Contact
      const cache = this.getCachedContacts();
      const updatedCache = cache.filter(c => c.id !== id);
      this.setCachedContacts(updatedCache);

      if (typeof id === 'string' && id.startsWith('temp_')) {
        // If deleting an offline-created contact that wasn't even sent to the server yet,
        // we can simply remove its CREATE event from the queue altogether! Amazing efficiency.
        const queue = this.getSyncQueue();
        const filteredQueue = queue.filter(q => !(q.action === 'CREATE' && q.tempId === id));
        this.saveSyncQueue(filteredQueue);
        return;
      }

      // Queue delete
      this.addToQueue({
        action: 'DELETE',
        id,
        data: null,
        timestamp: Date.now()
      });
    }
  }

  // Bulk Delete
  public async bulkDelete(ids: (number | string)[]): Promise<void> {
    const realIds = ids.filter(id => typeof id === 'number') as number[];
    const tempIds = ids.filter(id => typeof id === 'string' && id.startsWith('temp_')) as string[];

    // Instantly update cache
    const cache = this.getCachedContacts();
    const updatedCache = cache.filter(c => !ids.includes(c.id!));
    this.setCachedContacts(updatedCache);

    // Filter out temp ID creations from sync queue
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      const filteredQueue = queue.filter(q => !(q.action === 'CREATE' && tempIds.includes(q.tempId || '')));
      this.saveSyncQueue(filteredQueue);
    }

    if (realIds.length === 0) return;

    if (this.isOnline()) {
      const response = await fetch('/api/contacts/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: realIds })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error('Server bulk-delete failed');
    } else {
      this.addToQueue({
        action: 'BULK_DELETE',
        data: { ids: realIds },
        timestamp: Date.now()
      });
    }
  }

  // Bulk Update Groups
  public async bulkUpdateGroups(ids: (number | string)[], groupName: string): Promise<void> {
    const realIds = ids.filter(id => typeof id === 'number') as number[];
    const tempIds = ids.filter(id => typeof id === 'string' && id.startsWith('temp_')) as string[];

    // Instantly update cache
    const cache = this.getCachedContacts();
    cache.forEach(c => {
      if (ids.includes(c.id!)) {
        c.group_name = groupName;
      }
    });
    this.setCachedContacts(cache);

    // Update temp IDs in sync queue
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      queue.forEach(q => {
        if (q.action === 'CREATE' && tempIds.includes(q.tempId || '')) {
          q.data.group_name = groupName;
        }
      });
      this.saveSyncQueue(queue);
    }

    if (realIds.length === 0) return;

    if (this.isOnline()) {
      const response = await fetch('/api/contacts/bulk-update-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: realIds, group_name: groupName })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error('Server bulk group update failed');
    } else {
      this.addToQueue({
        action: 'BULK_UPDATE_GROUPS',
        data: { ids: realIds, group_name: groupName },
        timestamp: Date.now()
      });
    }
  }

  // Bulk Update Tags
  public async bulkUpdateTags(ids: (number | string)[], tags: string[], action: 'add' | 'remove' | 'set'): Promise<void> {
    const realIds = ids.filter(id => typeof id === 'number') as number[];
    const tempIds = ids.filter(id => typeof id === 'string' && id.startsWith('temp_')) as string[];

    // Instantly update cache
    const cache = this.getCachedContacts();
    cache.forEach(c => {
      if (ids.includes(c.id!)) {
        let currentTags = c.tags
          ? c.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [];

        if (action === 'set') {
          currentTags = tags.map(t => t.trim()).filter(Boolean);
        } else if (action === 'add') {
          tags.forEach(tag => {
            const trimmed = tag.trim();
            if (trimmed && !currentTags.includes(trimmed)) {
              currentTags.push(trimmed);
            }
          });
        } else if (action === 'remove') {
          const tagsToRemove = tags.map(t => t.trim());
          currentTags = currentTags.filter(tag => !tagsToRemove.includes(tag));
        }
        c.tags = currentTags.join(', ');
      }
    });
    this.setCachedContacts(cache);

    // Update temp creations in sync queue
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      queue.forEach(q => {
        if (q.action === 'CREATE' && tempIds.includes(q.tempId || '')) {
          let currentTags = q.data.tags
            ? q.data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [];
          if (action === 'set') {
            currentTags = tags.map(t => t.trim()).filter(Boolean);
          } else if (action === 'add') {
            tags.forEach(tag => {
              if (tag.trim() && !currentTags.includes(tag.trim())) {
                currentTags.push(tag.trim());
              }
            });
          } else if (action === 'remove') {
            currentTags = currentTags.filter((tag: string) => !tags.map(t => t.trim()).includes(tag));
          }
          q.data.tags = currentTags.join(', ');
        }
      });
      this.saveSyncQueue(queue);
    }

    if (realIds.length === 0) return;

    if (this.isOnline()) {
      const response = await fetch('/api/contacts/bulk-update-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: realIds, tags, action })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error('Server bulk tags update failed');
    } else {
      this.addToQueue({
        action: 'BULK_UPDATE_TAGS',
        data: { ids: realIds, tags, action },
        timestamp: Date.now()
      });
    }
  }

  // Import Contacts
  public async importContacts(contacts: Omit<Contact, 'id'>[], defaultGroup: string, defaultTags: string[]): Promise<void> {
    if (this.isOnline()) {
      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts, defaultGroup, defaultTags })
      });
      if (!response.ok) {
        throw new Error('Failed to import contacts to server');
      }
      // Re-fetch contacts to update local cache
      await this.getContacts();
    } else {
      // Offline Flow: Create them in cache and queue them
      const cache = this.getCachedContacts();
      const actionsToQueue: SyncAction[] = [];
      const timestamp = Date.now();

      contacts.forEach((c, idx) => {
        const tempId = `temp_import_${timestamp}_${idx}`;
        
        let finalGroup = c.group_name || '';
        if (!finalGroup && defaultGroup) {
          finalGroup = defaultGroup;
        }

        let importedTags = c.tags
          ? String(c.tags).split(',').map((t: string) => t.trim()).filter(Boolean)
          : [];
        
        if (defaultTags && Array.isArray(defaultTags)) {
          defaultTags.forEach((t: string) => {
            if (t.trim() && !importedTags.includes(t.trim())) {
              importedTags.push(t.trim());
            }
          });
        }
        const tagsStr = importedTags.join(', ');

        const contactToSave: Contact = {
          ...c,
          group_name: finalGroup,
          tags: tagsStr,
          id: tempId as any,
          created_at: new Date().toISOString()
        };

        cache.push(contactToSave);

        actionsToQueue.push({
          action: 'CREATE',
          tempId,
          data: {
            ...c,
            group_name: finalGroup,
            tags: tagsStr
          },
          timestamp
        });
      });

      this.setCachedContacts(cache);

      // Add to queue
      const queue = this.getSyncQueue();
      queue.push(...actionsToQueue);
      this.saveSyncQueue(queue);
    }
  }

  // Trigger local database reset on server
  public async resetServerDatabase(): Promise<void> {
    if (!this.isOnline()) {
      throw new Error('Must be online to reset the server database.');
    }
    // Delete local caches
    localStorage.removeItem(this.contactsCacheKey);
    localStorage.removeItem(this.groupsCacheKey);
    localStorage.removeItem(this.tagsCacheKey);
    localStorage.removeItem(this.syncQueueKey);
    
    // Call server restart/cleanup endpoint
    await fetch('/api/contacts/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from({ length: 1000 }, (_, i) => i + 1) }) // clear first 1000 IDs
    });

    this.notifySync();
  }

  // The Sync Engine Replay Function
  public async syncNow(): Promise<void> {
    if (this.isSyncing || !this.isOnline()) return;
    const queue = this.getSyncQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    console.log(`[Sync Engine] Found ${queue.length} offline operations. Starting replay...`);

    // We keep track of mapped temp IDs so that updates and deletes to temp IDs can map to real IDs returned by server
    const tempIdMap: Record<string, number> = {};

    try {
      for (const action of queue) {
        console.log(`[Sync Engine] Replaying action: ${action.action}`, action);

        if (action.action === 'CREATE') {
          const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          });
          if (response.ok) {
            const createdContact: Contact = await response.json();
            if (action.tempId) {
              tempIdMap[action.tempId] = createdContact.id as number;
            }
          } else {
            console.error('[Sync Engine] CREATE replaying failed on server:', response.statusText);
          }
        } 
        
        else if (action.action === 'UPDATE') {
          let id = action.id;
          // Map temp ID to real server ID if it was created in this session
          if (typeof id === 'string' && id.startsWith('temp_') && tempIdMap[id]) {
            id = tempIdMap[id];
          }

          if (typeof id === 'number') {
            const response = await fetch(`/api/contacts/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            });
            if (!response.ok) {
              console.error(`[Sync Engine] UPDATE failed for ID ${id}`);
            }
          } else {
            console.warn('[Sync Engine] UPDATE skipped due to invalid non-resolved temp ID:', id);
          }
        } 
        
        else if (action.action === 'DELETE') {
          let id = action.id;
          if (typeof id === 'string' && id.startsWith('temp_') && tempIdMap[id]) {
            id = tempIdMap[id];
          }

          if (typeof id === 'number') {
            const response = await fetch(`/api/contacts/${id}`, {
              method: 'DELETE'
            });
            if (!response.ok) {
              console.error(`[Sync Engine] DELETE failed for ID ${id}`);
            }
          } else {
            console.warn('[Sync Engine] DELETE skipped due to invalid non-resolved temp ID:', id);
          }
        } 
        
        else if (action.action === 'BULK_DELETE') {
          const { ids } = action.data;
          const mappedIds = ids.map((id: any) => 
            typeof id === 'string' && id.startsWith('temp_') ? tempIdMap[id] : id
          ).filter(Boolean);

          if (mappedIds.length > 0) {
            await fetch('/api/contacts/bulk-delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: mappedIds })
            });
          }
        } 
        
        else if (action.action === 'BULK_UPDATE_GROUPS') {
          const { ids, group_name } = action.data;
          const mappedIds = ids.map((id: any) => 
            typeof id === 'string' && id.startsWith('temp_') ? tempIdMap[id] : id
          ).filter(Boolean);

          if (mappedIds.length > 0) {
            await fetch('/api/contacts/bulk-update-groups', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: mappedIds, group_name })
            });
          }
        } 
        
        else if (action.action === 'BULK_UPDATE_TAGS') {
          const { ids, tags, action: tagAction } = action.data;
          const mappedIds = ids.map((id: any) => 
            typeof id === 'string' && id.startsWith('temp_') ? tempIdMap[id] : id
          ).filter(Boolean);

          if (mappedIds.length > 0) {
            await fetch('/api/contacts/bulk-update-tags', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids: mappedIds, tags, action: tagAction })
            });
          }
        }
      }

      // Clear the queue, fetch clean server state, and notify subscribers
      localStorage.removeItem(this.syncQueueKey);
      console.log('[Sync Engine] Replay completed successfully. Fetching fresh database state...');
      await this.getContacts(); // Updates cache & pulls fresh database
      this.notifySync();
    } catch (err) {
      console.error('[Sync Engine] Error during synchronization replay:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncManager = new SyncManager();
