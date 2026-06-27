<script lang="ts">
  import { Contact } from '../types';
  import { 
    Search, Users, Plus, Trash2, Tag, Folder, X, Check, Edit3, Info,
    Globe, Mail, Phone, MapPin, Briefcase, Calendar, Download, AlertCircle, Copy
  } from 'lucide-svelte';
  import { syncManager } from '../utils/syncManager';

  interface ContactsScreenProps {
    onContactsChange?: () => void;
  }

  let { onContactsChange }: ContactsScreenProps = $props();

  let contacts = $state<Contact[]>([]);
  let groups = $state<string[]>([]);
  let tags = $state<string[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  let searchQuery = $state('');
  let activeGroupFilter = $state('');
  let activeTagFilter = $state('');

  let currentPage = $state(1);
  const recordsPerPage = 100;

  let selectedIds = $state<(number | string)[]>([]);

  let quickSelectGroup = $state('');
  let quickSelectTag = $state('');

  let isAddModalOpen = $state(false);
  let viewingContact = $state<Contact | null>(null);
  let isEditing = $state(false);

  let isBulkGroupModalOpen = $state(false);
  let bulkGroupValue = $state('');
  let isBulkTagModalOpen = $state(false);
  let bulkTagValue = $state('');
  let bulkTagAction = $state<'add' | 'remove' | 'set'>('add');

  let contactForm = $state<Omit<Contact, 'id' | 'created_at'>>({
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

  const fetchData = async () => {
    loading = true;
    error = null;
    try {
      const contactsData = await syncManager.getContacts({
        search: searchQuery,
        group: activeGroupFilter,
        tag: activeTagFilter
      });
      
      const groupsData = syncManager.getGroups();
      const tagsData = syncManager.getTags();

      contacts = contactsData;
      groups = groupsData;
      tags = tagsData;
    } catch (err: any) {
      error = err.message || 'An error occurred while loading contacts.';
    } finally {
      loading = false;
    }
  };

  $effect(() => {
    currentPage = 1;
    fetchData();
    syncManager.onSyncChange(fetchData);
  });

  const totalPages = $derived(Math.ceil(contacts.length / recordsPerPage));
  const currentRecords = $derived(contacts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  ));

  const handleSelectAll = () => {
    const currentPageIds = currentRecords.map(c => c.id).filter((id): id is number | string => id !== undefined);
    const allSelectedOnPage = currentPageIds.every(id => selectedIds.includes(id));

    if (allSelectedOnPage) {
      selectedIds = selectedIds.filter(id => !currentPageIds.includes(id));
    } else {
      selectedIds = [...selectedIds.filter(id => !currentPageIds.includes(id)), ...currentPageIds];
    }
  };

  const handleSelectToggle = (id: number | string) => {
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter(item => item !== id);
    } else {
      selectedIds = [...selectedIds, id];
    }
  };

  const applyBulkSelectionByGroup = (groupName: string) => {
    if (!groupName) return;
    
    activeGroupFilter = groupName;

    const idsInGroup = contacts
      .filter(c => c.group_name && c.group_name.trim().toLowerCase() === groupName.trim().toLowerCase())
      .map(c => c.id)
      .filter(id => id !== undefined) as (number | string)[];
    
    const union = new Set([...selectedIds, ...idsInGroup]);
    selectedIds = Array.from(union);
    quickSelectGroup = '';
  };

  const applyBulkSelectionByTag = (tagName: string) => {
    if (!tagName) return;

    activeTagFilter = tagName;

    const idsWithTag = contacts
      .filter(c => {
        const contactTags = c.tags ? c.tags.split(',').map(t => t.trim().toLowerCase()) : [];
        return contactTags.includes(tagName.trim().toLowerCase());
      })
      .map(c => c.id)
      .filter(id => id !== undefined) as (number | string)[];

    const union = new Set([...selectedIds, ...idsWithTag]);
    selectedIds = Array.from(union);
    quickSelectTag = '';
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedIds.length} selected contacts?`)) {
      return;
    }

    try {
      await syncManager.bulkDelete(selectedIds);
      selectedIds = [];
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to complete bulk delete.');
    }
  };

  const handleBulkUpdateGroup = async () => {
    try {
      await syncManager.bulkUpdateGroups(selectedIds, bulkGroupValue);
      isBulkGroupModalOpen = false;
      bulkGroupValue = '';
      selectedIds = [];
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to update groups.');
    }
  };

  const handleBulkUpdateTags = async () => {
    if (!bulkTagValue.trim()) return;
    const tagsArray = bulkTagValue.split(',').map(t => t.trim()).filter(Boolean);

    try {
      await syncManager.bulkUpdateTags(selectedIds, tagsArray, bulkTagAction);
      isBulkTagModalOpen = false;
      bulkTagValue = '';
      selectedIds = [];
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to update tags.');
    }
  };

  const handleBulkExportVCF = () => {
    if (selectedIds.length === 0) return;
    
    const selectedContacts = contacts.filter(c => c.id !== undefined && selectedIds.includes(c.id));
    if (selectedContacts.length === 0) {
      alert('No matching contacts found to export.');
      return;
    }

    const vcards = selectedContacts.map((contact: Contact) => {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.name}`,
        contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : '',
        contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : '',
        contact.website ? `URL:${contact.website}` : '',
        contact.company ? `ORG:${contact.company}` : '',
        contact.job_title ? `TITLE:${contact.job_title}` : '',
        contact.address ? `ADR;TYPE=WORK:;;${contact.address.replace(/\n/g, ';')}` : '',
        contact.birthday ? `BDAY:${contact.birthday}` : '',
        contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : '',
        contact.group_name ? `CATEGORIES:${contact.group_name}${contact.tags ? ',' + contact.tags : ''}` : contact.tags ? `CATEGORIES:${contact.tags}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\r\n');
    }).join('\r\n');

    const blob = new Blob([vcards], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    let filename = 'contacts_export.vcf';
    if (activeGroupFilter) {
      filename = `contacts_group_${activeGroupFilter.replace(/\s+/g, '_')}.vcf`;
    } else if (activeTagFilter) {
      filename = `contacts_tag_${activeTagFilter.replace(/\s+/g, '_')}.vcf`;
    } else if (selectedContacts.length === 1) {
      filename = `${selectedContacts[0].name.replace(/\s+/g, '_')}.vcf`;
    } else {
      filename = `contacts_export_${selectedContacts.length}.vcf`;
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddContactSubmit = async (e: Event) => {
    e.preventDefault();
    if (!contactForm.name.trim()) return;

    try {
      await syncManager.createContact(contactForm);
      isAddModalOpen = false;
      contactForm = {
        name: '', phone: '', email: '', website: '', group_name: '',
        tags: '', address: '', company: '', job_title: '', notes: '', birthday: ''
      };
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to save contact.');
    }
  };

  const handleEditContactSubmit = async (e: Event) => {
    e.preventDefault();
    if (!viewingContact || !viewingContact.id) return;

    try {
      const updated = await syncManager.updateContact(viewingContact.id, {
        ...contactForm,
        id: viewingContact.id
      });
      viewingContact = updated;
      isEditing = false;
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
    }
  };

  const startEditing = (contact: Contact) => {
    contactForm = {
      name: contact.name,
      phone: contact.phone || '',
      email: contact.email || '',
      website: contact.website || '',
      group_name: contact.group_name || '',
      tags: contact.tags || '',
      address: contact.address || '',
      company: contact.company || '',
      job_title: contact.job_title || '',
      notes: contact.notes || '',
      birthday: contact.birthday || ''
    };
    isEditing = true;
  };

  const deleteContact = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await syncManager.deleteContact(id);
      viewingContact = null;
      fetchData();
      if (onContactsChange) onContactsChange();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const downloadVCard = (contact: Contact) => {
    const vcardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.name}`,
      contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : '',
      contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : '',
      contact.website ? `URL:${contact.website}` : '',
      contact.company ? `ORG:${contact.company}` : '',
      contact.job_title ? `TITLE:${contact.job_title}` : '',
      contact.address ? `ADR;TYPE=WORK:;;${contact.address.replace(/\n/g, ';')}` : '',
      contact.birthday ? `BDAY:${contact.birthday}` : '',
      contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : '',
      contact.group_name ? `CATEGORIES:${contact.group_name}${contact.tags ? ',' + contact.tags : ''}` : contact.tags ? `CATEGORIES:${contact.tags}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${contact.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<style>
  /* Tailwind is loaded via CDN in index.html */
</style>