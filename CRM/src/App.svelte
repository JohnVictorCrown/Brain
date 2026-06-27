<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Brain, Wifi, WifiOff, RefreshCw, Users, Upload, Settings as SettingsIcon } from 'lucide-svelte';
  import ContactsScreen from './components/ContactsScreen.svelte';
  import ImportScreen from './components/ImportScreen.svelte';
  import SettingsScreen from './components/SettingsScreen.svelte';
  import type { ScreenType } from './types';
  import { syncManager } from './utils/syncManager';

  let currentScreen: ScreenType = $state('contacts');
  let isOnline = $state(syncManager.isOnline());
  let pendingSyncCount = $state(syncManager.getSyncQueue().length);
  let isSyncing = $state(false);
  let triggerRefreshStats = $state(0);

  let unsubConnection: (() => void) | null = null;
  let unsubSync: (() => void) | null = null;
  let timer: number | null = null;

  onMount(() => {
    unsubConnection = syncManager.onConnectionChange((online) => {
      isOnline = online;
      pendingSyncCount = syncManager.getSyncQueue().length;
    });

    unsubSync = syncManager.onSyncChange(() => {
      pendingSyncCount = syncManager.getSyncQueue().length;
      triggerRefreshStats++;
    });

    timer = setInterval(() => {
      isOnline = syncManager.isOnline();
      pendingSyncCount = syncManager.getSyncQueue().length;
    }, 3000);
  });

  onDestroy(() => {
    unsubConnection?.();
    unsubSync?.();
    if (timer) clearInterval(timer);
  });

  const handleDatabaseChange = () => {
    triggerRefreshStats++;
    pendingSyncCount = syncManager.getSyncQueue().length;
  };

  const triggerManualSync = async () => {
    if (!isOnline) return;
    isSyncing = true;
    await syncManager.syncNow();
    isSyncing = false;
    handleDatabaseChange();
  };
</script>

<div class="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans select-none text-slate-100">
  <header class="bg-slate-900/80 backdrop-blur-md px-4 py-3 md:px-6 flex items-center justify-between border-b border-slate-800/80 shrink-0 z-50">
    <div class="flex items-center gap-3">
      <div class="relative flex items-center justify-center bg-gradient-to-tr from-teal-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-teal-500/20">
        <Brain class="h-5 w-5 text-white" />
        <span class="absolute -bottom-1 -right-1 bg-white text-teal-600 rounded-full p-0.5 border border-teal-100 shadow-xs">
          <span class="block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
        </span>
      </div>
      <div>
        <div class="flex items-center gap-1.5">
          <h1 class="text-sm md:text-base font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
            Brain CRM
          </h1>
          {#if isOnline}
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold tracking-wider uppercase">
              <Wifi class="h-2.5 w-2.5" />
              <span>Cloud Synced</span>
            </div>
          {:else}
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 font-bold tracking-wider uppercase animate-pulse">
              <WifiOff class="h-2.5 w-2.5" />
              <span>Offline Active</span>
            </div>
          {/if}
        </div>
        <p class="text-[10px] text-teal-400/80 font-semibold uppercase tracking-widest">
          Fluid Database Environment
        </p>
      </div>
    </div>

    {#if pendingSyncCount > 0}
      <div 
        class={"hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all hover:bg-slate-800 " + (isOnline ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300')}
        onclick={triggerManualSync}
        title={isOnline ? "Click to trigger manual server sync" : "Offline. Queue will auto-sync when online."}
      >
        <RefreshCw class={"h-3 w-3 " + (isSyncing ? 'animate-spin' : '')} />
        <span>
          {pendingSyncCount} pending change{pendingSyncCount > 1 ? 's' : ''}
        </span>
        {#if isOnline}
          <span class="text-[10px] bg-teal-500 text-white px-1 py-0.2 rounded-sm font-bold uppercase tracking-wider">
            Sync Now
          </span>
        {/if}
      </div>
    {/if}

    <div class="hidden md:block text-xs text-slate-500 font-medium">
      Offline Cache & Cloud Synchronization Active
    </div>
  </header>

  <main class="flex-1 overflow-hidden relative bg-slate-950">
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

    {#if pendingSyncCount > 0}
      <div class="sm:hidden bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1.5 px-3 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <RefreshCw class="h-3 w-3 animate-spin" />
          <span>{pendingSyncCount} offline modification{pendingSyncCount > 1 ? 's' : ''} queued</span>
        </div>
        {#if isOnline}
          <button 
            onclick={triggerManualSync}
            class="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold"
          >
            Sync
          </button>
        {/if}
      </div>
    {/if}

    {#if currentScreen === 'contacts'}
      <div class="absolute inset-0 flex flex-col h-full">
        <ContactsScreen onContactsChange={handleDatabaseChange} />
      </div>
    {:else if currentScreen === 'import'}
      <div class="absolute inset-0 flex flex-col h-full">
        <ImportScreen onImportSuccess={() => currentScreen = 'contacts'} />
      </div>
    {:else if currentScreen === 'settings'}
      <div class="absolute inset-0 flex flex-col h-full">
        <SettingsScreen 
          onDatabaseReset={handleDatabaseChange} 
          {triggerRefreshStats}
        />
      </div>
    {/if}
  </main>

  <nav class="bg-slate-900 border-t border-slate-800/80 py-2.5 px-4 shrink-0 shadow-2xl z-50">
    <div class="max-w-md mx-auto flex justify-around items-center">
      <button
        id="nav-contacts-btn"
        onclick={() => currentScreen = 'contacts'}
        class={"flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (currentScreen === 'contacts' ? 'text-teal-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200')}
      >
        <Users class={"h-5 w-5 transition-transform " + (currentScreen === 'contacts' ? 'stroke-[2.5px]' : '')} />
        <span class="text-[10px] tracking-wide">Contacts</span>
      </button>

      <button
        id="nav-import-btn"
        onclick={() => currentScreen = 'import'}
        class={"flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (currentScreen === 'import' ? 'text-teal-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200')}
      >
        <Upload class={"h-5 w-5 transition-transform " + (currentScreen === 'import' ? 'stroke-[2.5px]' : '')} />
        <span class="text-[10px] tracking-wide">Import CSV</span>
      </button>

      <button
        id="nav-settings-btn"
        onclick={() => currentScreen = 'settings'}
        class={"flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (currentScreen === 'settings' ? 'text-teal-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200')}
      >
        <SettingsIcon class={"h-5 w-5 transition-transform " + (currentScreen === 'settings' ? 'stroke-[2.5px]' : '')} />
        <span class="text-[10px] tracking-wide">Settings</span>
      </button>
    </div>
  </nav>
</div>