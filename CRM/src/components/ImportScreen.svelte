<script lang="ts">
  import Papa from 'papaparse';
  import { Upload, FileSpreadsheet, Check, ArrowRight, AlertCircle, Trash2, Database, Play, Eye, Settings, ListPlus, RotateCcw } from 'lucide-svelte';
  import { syncManager } from '../utils/syncManager';
  import type { ImportMapping } from '../types';

  interface ImportScreenProps {
    onImportSuccess: () => void;
  }

let { onImportSuccess }: ImportScreenProps = $props();

  let step = $state(1) as 1 | 2 | 3;
  
  let file = $state<File | null>(null);
  let isDragActive = $state(false);
  let parsedHeaders = $state<string[]>([]);
  let parsedRows = $state<any[]>([]);
  let parseError = $state<string | null>(null);

  let fieldMapping = $state<ImportMapping>({
    name: '',
    phone: '',
    email: '',
    website: '',
    group_name: '',
    tags: '',
    address: '',
    company: '',
    job_title: '',
    notes: '',
    birthday: ''
  });

  let defaultGroup = $state('');
  let defaultTags = $state('');

  let importing = $state(false);
  let importCount = $state<number | null>(null);
  let importError = $state<string | null>(null);

  let fileInputRef: HTMLInputElement | null = $state(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    isDragActive = true;
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    isDragActive = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragActive = false;
    
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        processCSV(droppedFile);
      } else {
        parseError = 'Unsupported file format. Please upload a .csv file.';
      }
    }
  };

  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const selectedFile = target.files[0];
      processCSV(selectedFile);
    }
  };

  const processCSV = (csvFile: File) => {
    parseError = null;
    file = csvFile;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          parseError = 'Failed to parse CSV file: ' + results.errors[0].message;
          return;
        }

        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          parseError = 'Empty CSV file or headers not detected.';
          return;
        }

        parsedHeaders = headers;
        parsedRows = results.data;

        const initialMapping = { ...fieldMapping };
        headers.forEach((h: string) => {
          const lower = h.toLowerCase().replace(/[\s_-]/g, '');
          
          if (lower === 'name' || lower === 'fullname' || lower === 'displayname' || lower === 'contactname') {
            initialMapping.name = h;
          } else if (lower === 'phone' || lower === 'mobile' || lower === 'tel' || lower === 'cellphone' || lower === 'cell') {
            initialMapping.phone = h;
          } else if (lower === 'email' || lower === 'emailaddress' || lower === 'mail') {
            initialMapping.email = h;
          } else if (lower === 'website' || lower === 'web' || lower === 'site' || lower === 'url') {
            initialMapping.website = h;
          } else if (lower === 'group' || lower === 'folder' || lower === 'category' || lower === 'groups_name' || lower === 'group_name') {
            initialMapping.group_name = h;
          } else if (lower === 'tag' || lower === 'tags' || lower === 'label' || lower === 'labels') {
            initialMapping.tags = h;
          } else if (lower === 'address' || lower === 'location' || lower === 'addr' || lower === 'street') {
            initialMapping.address = h;
          } else if (lower === 'company' || lower === 'org' || lower === 'organization' || lower === 'employer') {
            initialMapping.company = h;
          } else if (lower === 'title' || lower === 'role' || lower === 'jobtitle' || lower === 'job') {
            initialMapping.job_title = h;
          } else if (lower === 'notes' || lower === 'note' || lower === 'description' || lower === 'memo' || lower === 'history') {
            initialMapping.notes = h;
          } else if (lower === 'birthday' || lower === 'bday' || lower === 'birthdate' || lower === 'birth') {
            initialMapping.birthday = h;
          }
        });

        if (!initialMapping.name && headers.length > 0) {
          initialMapping.name = headers[0];
        }

        fieldMapping = initialMapping;
        step = 2;
      },
      error: (err: Error) => {
        parseError = 'An error occurred while parsing the CSV file: ' + err.message;
      }
    });
  };

  const handleFieldMapChange = (crmField: keyof ImportMapping, csvHeader: string) => {
    fieldMapping = {
      ...fieldMapping,
      [crmField]: csvHeader
    };
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    
    if (!fieldMapping.name) {
      alert('The "Full Name" field must be mapped to proceed with the import.');
      return;
    }

    importing = true;
    importError = null;

    const structuredContacts = parsedRows.map((row: any) => {
      return {
        name: row[fieldMapping.name] || 'Unnamed Contact',
        phone: fieldMapping.phone ? row[fieldMapping.phone] : '',
        email: fieldMapping.email ? row[fieldMapping.email] : '',
        website: fieldMapping.website ? row[fieldMapping.website] : '',
        group_name: fieldMapping.group_name ? row[fieldMapping.group_name] : '',
        tags: fieldMapping.tags ? row[fieldMapping.tags] : '',
        address: fieldMapping.address ? row[fieldMapping.address] : '',
        company: fieldMapping.company ? row[fieldMapping.company] : '',
        job_title: fieldMapping.job_title ? row[fieldMapping.job_title] : '',
        notes: fieldMapping.notes ? row[fieldMapping.notes] : '',
        birthday: fieldMapping.birthday ? row[fieldMapping.birthday] : ''
      };
    });

    const tagsArray = defaultTags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    try {
      await syncManager.importContacts(structuredContacts, defaultGroup.trim(), tagsArray);
      importCount = structuredContacts.length;
      step = 3;
    } catch (err: any) {
      importError = err.message || 'Import failed.';
    } finally {
      importing = false;
    }
  };

  const handleReset = () => {
    file = null;
    parsedHeaders = [];
    parsedRows = [];
    parseError = null;
    fieldMapping = {
      name: '', phone: '', email: '', website: '', group_name: '',
      tags: '', address: '', company: '', job_title: '', notes: '', birthday: ''
    };
    defaultGroup = '';
    defaultTags = '';
    importCount = null;
    importError = null;
    step = 1;
  };

  const getPreviewContacts = () => {
    return parsedRows.slice(0, 3).map((row: any) => {
      const rawTags = fieldMapping.tags ? row[fieldMapping.tags] : '';
      let combinedTagsList: string[] = rawTags 
        ? String(rawTags).split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
    
      if (defaultTags) {
        defaultTags.split(',').forEach((dt: string) => {
          const trimmed = dt.trim();
          if (trimmed && !combinedTagsList.includes(trimmed)) {
            combinedTagsList.push(trimmed);
          }
        });
      }
      
      return {
        name: row[fieldMapping.name] || 'Unnamed Contact',
        phone: fieldMapping.phone ? row[fieldMapping.phone] : '',
        email: fieldMapping.email ? row[fieldMapping.email] : '',
        group: (fieldMapping.group_name ? row[fieldMapping.group_name] : '') || defaultGroup,
        tags: combinedTagsList.join(', '),
        company: fieldMapping.company ? row[fieldMapping.company] : '',
        job_title: fieldMapping.job_title ? row[fieldMapping.job_title] : ''
      };
    });
  };

  const crmFieldsConfig: { key: keyof ImportMapping; label: string; required: boolean }[] = [
    { key: 'name', label: 'Full Name', required: true },
    { key: 'phone', label: 'Phone Number', required: false },
    { key: 'email', label: 'Email Address', required: false },
    { key: 'website', label: 'Website URL', required: false },
    { key: 'company', label: 'Company / Org', required: false },
    { key: 'job_title', label: 'Job Title / Role', required: false },
    { key: 'group_name', label: 'Primary Group', required: false },
    { key: 'tags', label: 'Tags List', required: false },
    { key: 'address', label: 'Physical Address', required: false },
    { key: 'birthday', label: 'Birthday', required: false },
    { key: 'notes', label: 'Biography / Notes', required: false },
  ];
</script>

<style>
  /* Tailwind is loaded via CDN in index.html */
</style>

<div class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 flex flex-col h-full">
  
  <div class="mb-6">
    <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
      <FileSpreadsheet class="h-5 w-5 text-slate-600" />
      <span>CSV Contact Importer</span>
    </h2>
    <p class="text-xs text-slate-500 mt-1">
      Upload any standard spreadsheet in .csv format. Match your column headers to our database schema, and bulk load thousands of records instantly into SQLite.
    </p>
  </div>

  <div class="mb-6 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs max-w-4xl mx-auto w-full">
    <div class="flex items-center gap-2">
      <div class={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
        step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        1
      </div>
      <span class={`text-xs font-semibold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Upload file</span>
    </div>
    <ArrowRight class="h-4 w-4 text-slate-300" />
    <div class="flex items-center gap-2">
      <div class={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
        step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        2
      </div>
      <span class={`text-xs font-semibold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Map fields &amp; Defaults</span>
    </div>
    <ArrowRight class="h-4 w-4 text-slate-300" />
    <div class="flex items-center gap-2">
      <div class={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
        step >= 3 ? 'bg-green-700 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        3
      </div>
      <span class={`text-xs font-semibold ${step >= 3 ? 'text-green-800' : 'text-slate-400'}`}>Import completed</span>
    </div>
  </div>

  <div class="flex-1 max-w-4xl mx-auto w-full">
    {#if step === 1}
      <div class="space-y-6">
        <div
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          onclick={() => fileInputRef?.click()}
          class={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            isDragActive 
              ? 'border-slate-800 bg-slate-100/50 scale-[1.01]' 
              : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-xs'
          }`}
        >
          <input
            type="file"
            bind:this={fileInputRef}
            onchange={handleFileSelect}
            accept=".csv"
            class="hidden"
          />
          <div class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
            <Upload class="h-6 w-6" />
          </div>
          <h3 class="text-sm font-semibold text-slate-800">
            Drag &amp; drop your CSV file here, or click to browse
          </h3>
          <p class="text-xs text-slate-400 mt-1 max-w-xs">
            Supports only comma-separated .csv files. First row should contain the column headers.
          </p>
        </div>

        {#if parseError}
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-xs text-red-700 max-w-2xl mx-auto items-start">
            <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <h4 class="font-bold">Parsing Failure</h4>
              <p class="mt-0.5 text-slate-600">{parseError}</p>
            </div>
          </div>
        {/if}

        <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">
            CRM CSV Formatting Guide
          </h4>
          <p class="text-xs text-slate-600">
            To maximize mapping speed, we recommend naming your spreadsheet headers similar to:
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div>• Name / Full Name</div>
            <div>• Phone / Mobile</div>
            <div>• Email / Address</div>
            <div>• Website / URL</div>
            <div>• Group / Folder</div>
            <div>• Tags / Labels</div>
            <div>• Company / Org</div>
            <div>• Job Title / Role</div>
          </div>
          <p class="text-xs text-slate-500 italic">
            Our smart parser automatically identifies standard variants and pre-fills mappings for you.
          </p>
        </div>
      </div>
    {/if}

    {#if step === 2}
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs">
            <div>
              <h3 class="text-sm font-bold text-slate-900 border-b border-slate-150 pb-2 flex items-center gap-1.5">
                <Settings class="h-4 w-4 text-slate-500" />
                <span>Map CSV Headers to CRM Database fields</span>
              </h3>
              <p class="text-[11px] text-slate-400 mt-1">
                Select which column from your CSV file represents each CRM field. Leaving a selector empty is acceptable, except for Full Name.
              </p>
            </div>

            <div class="space-y-3">
              {#each crmFieldsConfig as field (field.key)}
                {@const isMapped = !!fieldMapping[field.key]}
                <div class="grid grid-cols-12 gap-2 items-center">
                  <div class="col-span-5 flex items-center gap-1">
                    <span class="text-xs font-semibold text-slate-700">{field.label}</span>
                    {#if field.required}
                      <span class="text-red-500 font-bold">*</span>
                    {/if}
                  </div>
                  <div class="col-span-7 relative">
                    <select
                      id={`map-${field.key}-select`}
                      bind:value={fieldMapping[field.key]}
                      onchange={(e) => handleFieldMapChange(field.key, (e.target as HTMLSelectElement).value)}
                      class={`w-full px-3 py-1.5 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400 ${
                        isMapped ? 'border-slate-300 font-medium text-slate-800 bg-emerald-50/20' : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      <option value="">-- Ignored / Skip Field --</option>
                      {#each parsedHeaders as h}
                        <option value={h}>{h}</option>
                      {/each}
                    </select>
                    {#if isMapped}
                      <Check class="absolute right-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600" />
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <div class="border-t border-slate-150 pt-4 space-y-4">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ListPlus class="h-4 w-4 text-slate-400" />
                  <span>Append default labels to all contacts</span>
                </h3>
                <p class="text-[10px] text-slate-400 mt-0.5">
                  Need to immediately sort this import? Apply a default group or append tags to every single incoming contact.
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 mb-1">Default Group</label>
                  <input
                    id="default-group-input"
                    type="text"
                    bind:value={defaultGroup}
                    placeholder="e.g. Imported Leads"
                    class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                  <span class="text-[9px] text-slate-400">Only applied if contact does not have a mapped group row.</span>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-500 mb-1">Default Tags (Comma-separated)</label>
                  <input
                    id="default-tags-input"
                    type="text"
                    bind:value={defaultTags}
                    placeholder="e.g. bulk-import-2026, raw"
                    class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
                  />
                  <span class="text-[9px] text-slate-400">These tags will be appended to every imported contact.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs h-fit sticky top-24">
            <div>
              <h3 class="text-sm font-bold text-slate-900 border-b border-slate-150 pb-2 flex items-center gap-1.5">
                <Eye class="h-4 w-4 text-slate-500" />
                <span>Real-time Import Preview</span>
              </h3>
              <p class="text-[11px] text-slate-400 mt-1">
                Showing how the first {Math.min(3, parsedRows.length)} rows will resolve inside the CRM database.
              </p>
            </div>

            <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
              {#each getPreviewContacts() as contact, index (index)}
                <div class="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span class="font-bold text-slate-900 truncate pr-2">{contact.name}</span>
                    <span class="text-[9px] text-slate-400">Preview #{index + 1}</span>
                  </div>
                  
                  {#if contact.phone || contact.email}
                    <div class="text-slate-600 space-y-0.5 font-mono text-[10px]">
                      {#if contact.phone}
                        <div>📞 {contact.phone}</div>
                      {/if}
                      {#if contact.email}
                        <div>✉️ {contact.email}</div>
                      {/if}
                    </div>
                  {/if}

                  {#if contact.company || contact.job_title}
                    <div class="text-slate-700 italic text-[11px]">
                      💼 {contact.job_title} {contact.company ? `at ${contact.company}` : ''}
                    </div>
                  {/if}

                  <div class="flex flex-wrap gap-1 pt-1 items-center">
                    {#if contact.group}
                      <span class="bg-slate-200 text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wide">
                        {contact.group}
                      </span>
                    {/if}
                    {#if contact.tags}
                      {#each contact.tags.split(',') as tag}
                        {@const trimmed = tag.trim()}
                        {#if trimmed}
                          <span class="bg-white border border-slate-250 text-slate-600 text-[9px] px-1.5 py-0.1 rounded-full">
                            {trimmed}
                          </span>
                        {/if}
                      {/each}
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            {#if importError}
              <div class="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs text-red-700">
                <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <h4 class="font-bold">Execution Error</h4>
                  <p class="mt-0.5">{importError}</p>
                </div>
              </div>
            {/if}

            <div class="flex items-center gap-3 pt-2">
              <button
                onclick={handleReset}
                class="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw class="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
              <button
                id="execute-import-btn"
                onclick={handleExecuteImport}
                disabled={importing || !fieldMapping.name}
                class="flex-2 py-2 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {#if importing}
                  <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Writing to SQLite...</span>
                {:else}
                  <Database class="h-4 w-4" />
                  <span>Import {parsedRows.length} Contacts</span>
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if step === 3}
      <div class="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center space-y-6 shadow-sm my-10">
        <div class="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-150">
          <Check class="h-7 w-7" />
        </div>
        <div class="space-y-2">
          <h3 class="text-base font-bold text-slate-900">Import Successful!</h3>
          <p class="text-xs text-slate-500">
            A batch of <span class="font-bold text-slate-950">{importCount} contacts</span> has been successfully mapped, processed, and loaded into your SQLite database.
          </p>
        </div>

        <div class="bg-slate-50 rounded-lg p-4 border border-slate-150 space-y-2 text-xs text-slate-600 text-left">
          <div class="flex justify-between">
            <span>Total records inserted:</span>
            <span class="font-bold text-slate-900">{importCount}</span>
          </div>
          {#if defaultGroup}
            <div class="flex justify-between">
              <span>Default Group applied:</span>
              <span class="font-bold text-slate-900">{defaultGroup}</span>
            </div>
          {/if}
          {#if defaultTags}
            <div class="flex justify-between items-start">
              <span>Default Tags appended:</span>
              <span class="font-bold text-slate-900 text-right max-w-[200px] truncate">{defaultTags}</span>
            </div>
          {/if}
        </div>

        <div class="flex gap-3">
          <button
            onclick={handleReset}
            class="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium cursor-pointer"
          >
            Import another file
          </button>
          <button
            id="view-contacts-after-import-btn"
            onclick={onImportSuccess}
            class="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs transition-all font-bold cursor-pointer"
          >
            View Contacts Book
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>