<script lang="ts">
  import { Settings, Trash2, Database, Download, RefreshCw, AlertTriangle, Check, FileSpreadsheet, Users, Tag, Folder, Info } from 'lucide-svelte';
  import { syncManager } from '../utils/syncManager';
  import type { Contact } from '../types';

  interface SettingsScreenProps {
    onDatabaseReset: () => void;
    triggerRefreshStats?: number;
  }

  let { onDatabaseReset, triggerRefreshStats = 0 }: SettingsScreenProps = $props();

  let stats = $state({
    totalContacts: 0,
    totalGroups: 0,
    totalTags: 0,
    groupDistribution: [] as { name: string; count: number }[]
  });
  let loading = $state(true);
  let feedback = $state<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchStats = async () => {
    loading = true;
    try {
      const contacts = await syncManager.getContacts();
      const groups = syncManager.getGroups();
      const tags = syncManager.getTags();

      const groupCounts: { [key: string]: number } = {};
      contacts.forEach((c: Contact) => {
        const gName = c.group_name || 'Unassigned';
        groupCounts[gName] = (groupCounts[gName] || 0) + 1;
      });

      const groupDistribution = Object.entries(groupCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      stats = {
        totalContacts: contacts.length,
        totalGroups: groups.length,
        totalTags: tags.length,
        groupDistribution
      };
    } catch (err: any) {
      console.error('Failed to load stats:', err);
    } finally {
      loading = false;
    }
  };

  $effect(() => {
    fetchStats();
  });

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    feedback = { message, type };
    setTimeout(() => feedback = null, 4000);
  };

  const handleExportCSV = async () => {
    try {
      const contacts = await syncManager.getContacts();

      if (contacts.length === 0) {
        showFeedback('No contacts exist in the database to export.', 'error');
        return;
      }

      const headers = ['Name', 'Phone', 'Email', 'Website', 'Group', 'Tags', 'Address', 'Company', 'Job Title', 'Notes', 'Birthday'];
      const csvRows = [headers.join(',')];

      contacts.forEach((c: Contact) => {
        const row = [
          `"${(c.name || '').replace(/"/g, '""')}"`,
          `"${(c.phone || '').replace(/"/g, '""')}"`,
          `"${(c.email || '').replace(/"/g, '""')}"`,
          `"${(c.website || '').replace(/"/g, '""')}"`,
          `"${(c.group_name || '').replace(/"/g, '""')}"`,
          `"${(c.tags || '').replace(/"/g, '""')}"`,
          `"${(c.address || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${(c.company || '').replace(/"/g, '""')}"`,
          `"${(c.job_title || '').replace(/"/g, '""')}"`,
          `"${(c.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${(c.birthday || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `crm_contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showFeedback('CSV file compiled and downloaded successfully.');
    } catch (err: any) {
      showFeedback('CSV Export failed: ' + err.message, 'error');
    }
  };

  const handleExportVCard = async () => {
    try {
      const contacts = await syncManager.getContacts();

      if (contacts.length === 0) {
        showFeedback('No contacts exist in the database to export.', 'error');
        return;
      }

      const vcards = contacts.map((c: Contact) => {
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${c.name}`,
          c.phone ? `TEL;TYPE=CELL:${c.phone}` : '',
          c.email ? `EMAIL;TYPE=INTERNET:${c.email}` : '',
          c.website ? `URL:${c.website}` : '',
          c.company ? `ORG:${c.company}` : '',
          c.job_title ? `TITLE:${c.job_title}` : '',
          c.address ? `ADR;TYPE=WORK:;;${c.address.replace(/\n/g, ';')}` : '',
          c.birthday ? `BDAY:${c.birthday}` : '',
          c.notes ? `NOTE:${c.notes.replace(/\n/g, '\\n')}` : '',
          c.group_name ? `CATEGORIES:${c.group_name}${c.tags ? ',' + c.tags : ''}` : c.tags ? `CATEGORIES:${c.tags}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\r\n');
      }).join('\r\n');

      const blob = new Blob([vcards], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `crm_contacts_backup_${new Date().toISOString().slice(0, 10)}.vcf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showFeedback('vCard package file downloaded successfully.');
    } catch (err: any) {
      showFeedback('vCard Export failed: ' + err.message, 'error');
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Warning: This will delete ALL current contacts and restore the 5 original Demo contacts. Proceed?')) {
      return;
    }

    try {
      const contacts = await syncManager.getContacts();
      const ids = contacts.map(c => c.id).filter(id => id !== undefined) as (number | string)[];

      if (ids.length > 0) {
        await syncManager.bulkDelete(ids);
      }

      const demoContacts = [
        {
          name: 'Alice Smith',
          phone: '+1 (555) 123-4567',
          email: 'alice@alphacorp.com',
          website: 'https://alphacorp.com',
          group_name: 'Customers',
          tags: 'vip, follow-up',
          address: '123 Main St, New York, NY',
          company: 'Alpha Corp',
          job_title: 'Sales Manager',
          notes: 'Prefers email communication. Interested in our enterprise product demo.',
          birthday: '1990-05-15'
        },
        {
          name: 'Bob Jones',
          phone: '+1 (555) 987-6543',
          email: 'bob@betalabs.co',
          website: 'https://betalabs.co',
          group_name: 'Leads',
          tags: 'tech, cold-lead',
          address: '456 Science Dr, Boston, MA',
          company: 'Beta Labs',
          job_title: 'Lead Engineer',
          notes: 'Met at TechConf 2026. Very interested in our API integrations.',
          birthday: '1985-11-22'
        },
        {
          name: 'Charlie Brown',
          phone: '+1 (555) 456-7890',
          email: 'charlie@gammaventures.com',
          website: 'https://gammaventures.com',
          group_name: 'Partners',
          tags: 'investor, high-priority',
          address: '789 Capital Way, San Francisco, CA',
          company: 'Gamma Ventures',
          job_title: 'CEO',
          notes: 'Looking for a strategic partnership in Q3. Keep updated regularly.',
          birthday: '1978-02-28'
        },
        {
          name: 'Diana Prince',
          phone: '+1 (555) 321-7654',
          email: 'diana@deltaltd.org',
          website: 'https://deltaltd.org',
          group_name: 'Customers',
          tags: 'active, friendly',
          address: '101 Amazon Pl, Seattle, WA',
          company: 'Delta Ltd',
          job_title: 'Marketing Director',
          notes: 'Regular customer, very happy with services. Loves receiving holiday greeting cards.',
          birthday: '1988-08-18'
        },
        {
          name: 'Evan Wright',
          phone: '+1 (555) 654-3210',
          email: 'evan@wrightconsulting.net',
          website: 'https://wrightconsulting.net',
          group_name: 'Consultants',
          tags: 'external, contract',
          address: '202 Solo Blvd, Austin, TX',
          company: 'Wright Consulting',
          job_title: 'Principal Consultant',
          notes: 'Helped with our system architecture setup. Key external resource.',
          birthday: '1993-12-05'
        }
      ];

      await syncManager.importContacts(demoContacts, '', []);

      showFeedback('Database has been completely reset and re-seeded with original demo contacts!');
      fetchStats();
      onDatabaseReset();
    } catch (err: any) {
      showFeedback('Database reset failed: ' + err.message, 'error');
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('CRITICAL WARNING: This will permanently delete ALL contacts and tags in your CRM. This action is irreversible. Proceed?')) {
      return;
    }

    try {
      const contacts = await syncManager.getContacts();
      const ids = contacts.map(c => c.id).filter(id => id !== undefined) as (number | string)[];

      if (ids.length > 0) {
        await syncManager.bulkDelete(ids);
      }

      showFeedback('Database completely wiped! You now have a blank contact book.');
      fetchStats();
      onDatabaseReset();
    } catch (err: any) {
      showFeedback('Failed to wipe database: ' + err.message, 'error');
    }
  };
</script>

<div class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 text-slate-100 flex flex-col h-full">
  {#if feedback}
    <div class={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-2 text-xs font-semibold border ${
      feedback.type === 'success' 
        ? 'bg-teal-950/90 border-teal-500/50 text-teal-300 backdrop-blur-md' 
        : 'bg-rose-950/90 border-rose-500/50 text-rose-300 backdrop-blur-md'
    }`}>
      {#if feedback.type === 'success'}
        <Check class="h-4 w-4 text-teal-400" />
      {:else}
        <AlertTriangle class="h-4 w-4 text-rose-400" />
      {/if}
      <span>{feedback.message}</span>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto w-full mb-12">
    <div class="md:col-span-6 space-y-6">
      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <Database class="h-4 w-4 text-teal-400" />
          <span>Offline-First CRM Metrics</span>
        </h3>

        {#if loading}
          <div class="py-6 text-center text-xs text-slate-400 animate-pulse">Loading active metrics...</div>
        {:else}
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100">{stats.totalContacts}</span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <Users class="h-3 w-3 text-teal-400" />
                <span>Contacts</span>
              </span>
            </div>
            
            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100">{stats.totalGroups}</span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <Folder class="h-3 w-3 text-teal-400" />
                <span>Groups</span>
              </span>
            </div>

            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100">{stats.totalTags}</span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <Tag class="h-3 w-3 text-teal-400" />
                <span>Tags</span>
              </span>
            </div>
          </div>
        {/if}
      </div>

      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
          Contacts by Group
        </h3>
        {#if loading}
          <div class="py-4 text-center text-xs text-slate-500 animate-pulse">Loading breakdowns...</div>
        {:else if stats.groupDistribution.length === 0}
          <p class="text-xs text-slate-500 italic">No groups registered yet.</p>
        {:else}
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            {#each stats.groupDistribution as group (group.name)}
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-900/50 last:border-0">
                <span class="font-medium text-slate-300">{group.name}</span>
                <span class="bg-teal-950/50 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-900/40">
                  {group.count}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="md:col-span-6 space-y-6">
      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <Download class="h-4 w-4 text-teal-400" />
          <span>Full Database Backups</span>
        </h3>
        
        <p class="text-xs text-slate-400 leading-relaxed">
          Compile your contact book offline at any time. Ideal for importing directory files into third-party CRM platforms or spreadsheets.
        </p>

        <div class="space-y-2 pt-1">
          <button
            onclick={handleExportCSV}
            class="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-900/20"
          >
            <FileSpreadsheet class="h-4 w-4" />
            <span>Export to CSV Spreadsheet (.csv)</span>
          </button>

          <button
            onclick={handleExportVCard}
            class="w-full py-2.5 border border-slate-800 hover:border-teal-800 hover:bg-teal-950/20 text-teal-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download class="h-4 w-4" />
            <span>Export all to standard vCard (.vcf)</span>
          </button>
        </div>
      </div>

      <div class="bg-slate-900/40 border border-red-900/40 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-red-950 pb-2 flex items-center gap-1.5">
          <AlertTriangle class="h-4 w-4 text-red-400 animate-pulse" />
          <span>Database Maintenance</span>
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-200">Reset & Seed Sandbox</span>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              This wipes the active database and reloads 5 beautifully detailed demo profiles with emails, websites, tags, and groups.
            </p>
            <button
              id="reset-db-btn"
              onclick={handleResetDatabase}
              class="mt-2 w-full py-2 border border-red-900 hover:border-red-600 hover:bg-red-950/20 text-red-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw class="h-3.5 w-3.5" />
              <span>Restore Demo Seed Contacts</span>
            </button>
          </div>

          <div class="border-t border-slate-800/80 pt-3 flex flex-col gap-1">
            <span class="text-xs font-bold text-red-400">Factory Wipe Database</span>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Permanently clear all contact cards and tags, starting your Brain CRM system from an absolute pristine clean slate.
            </p>
            <button
              id="wipe-db-btn"
              onclick={handleClearDatabase}
              class="mt-2 w-full py-2.5 bg-red-950 border border-red-800/60 hover:bg-red-900 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/35"
            >
              <Trash2 class="h-3.5 w-3.5" />
              <span>Delete All Contacts (Wipe Database)</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-teal-950/20 border border-teal-900/40 rounded-xl p-4 flex gap-3 text-xs text-slate-300 backdrop-blur-md">
        <Info class="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <h4 class="font-bold text-teal-300">PWA Offline & Cloud Sync Active</h4>
          <p class="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
            This app runs completely offline. All actions — including resets and deletions — are instantly cached and will transparently replay and synchronize with the SQLite backend the moment you regain internet access!
          </p>
        </div>
      </div>

    </div>
  </div>

</div>