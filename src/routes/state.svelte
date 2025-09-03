<script lang="ts">
  import { onMount } from 'svelte';
  import orchestrator from '../lib/orchestrator';
  import type { StateStore } from '../lib/orchestrator';

  let state: StateStore = {};
  let newKey = '';
  let newValue = '';
  let editingKey = '';
  let editingValue = '';
  let hooks: Array<{event: string, callback: string}> = [];
  let newHookEvent = '';
  let newHookCallback = '';
  let middleware: string[] = [];
  let newMiddleware = '';
  let stateHistory: Array<{timestamp: string, state: StateStore}> = [];

  onMount(() => {
    const unsubscribe = orchestrator.getStore().subscribe(value => {
      state = value;
      
      stateHistory = [
        { timestamp: new Date().toISOString(), state: {...value} },
        ...stateHistory
      ].slice(0, 20);
    });

    return unsubscribe;
  });

  function addStateItem() {
    if (!newKey.trim()) return;
    
    let parsedValue: any;
    try {
      parsedValue = JSON.parse(newValue || 'null');
    } catch (e) {
      parsedValue = newValue;
    }
    
    orchestrator.setState(newKey, parsedValue);
    newKey = '';
    newValue = '';
  }

  function deleteStateItem(key: string) {
    orchestrator.setState(key, undefined);
  }

  function startEdit(key: string, value: any) {
    editingKey = key;
    editingValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  }

  function saveEdit() {
    if (!editingKey) return;
    
    let parsedValue: any;
    try {
      parsedValue = JSON.parse(editingValue);
    } catch (e) {
      parsedValue = editingValue;
    }
    
    orchestrator.setState(editingKey, parsedValue);
    cancelEdit();
  }

  function cancelEdit() {
    editingKey = '';
    editingValue = '';
  }

  function addHook() {
    if (!newHookEvent.trim() || !newHookCallback.trim()) return;
    
    try {
      const callback = new Function('data', newHookCallback);
      orchestrator.addHook(newHookEvent, callback);
      
      hooks = [...hooks, { event: newHookEvent, callback: newHookCallback }];
      newHookEvent = '';
      newHookCallback = '';
    } catch (e) {
      alert('Invalid JavaScript code in callback: ' + e.message);
    }
  }

  function addMiddleware() {
    if (!newMiddleware.trim()) return;
    
    try {
      const middlewareFunc = new Function('data', newMiddleware);
      orchestrator.addMiddleware(middlewareFunc);
      
      middleware = [...middleware, newMiddleware];
      newMiddleware = '';
    } catch (e) {
      alert('Invalid JavaScript code in middleware: ' + e.message);
    }
  }

  function restoreState(historicalState: StateStore) {
    if (confirm('Are you sure you want to restore this state? Current state will be lost.')) {
      Object.keys(state).forEach(key => {
        orchestrator.setState(key, undefined);
      });
      
      Object.entries(historicalState).forEach(([key, value]) => {
        orchestrator.setState(key, value);
      });
    }
  }

  function clearAllState() {
    if (confirm('Are you sure you want to clear all state? This cannot be undone.')) {
      orchestrator.reset();
      hooks = [];
      middleware = [];
      stateHistory = [];
    }
  }

  function exportState() {
    const stateExport = orchestrator.exportState('json');
    const blob = new Blob([stateExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `state-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importState(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string);
        if (confirm('Import this state? Current state will be replaced.')) {
          Object.keys(state).forEach(key => {
            orchestrator.setState(key, undefined);
          });
          
          Object.entries(importedState).forEach(([key, value]) => {
            orchestrator.setState(key, value);
          });
        }
      } catch (error) {
        alert('Invalid JSON file: ' + error.message);
      }
    };
    reader.readAsText(input.files[0]);
  }
</script>

<div class="space-y-6">
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">State Manager</h2>
    <p class="text-gray-600 mb-6">
      Manage the orchestrator's global state, configure hooks, and add middleware for data processing.
    </p>

    <!-- State Management Actions -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        on:click={exportState}
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        Export State
      </button>
      
      <label class="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 cursor-pointer">
        Import State
        <input type="file" accept=".json" on:change={importState} class="hidden" />
      </label>
      
      <button
        on:click={clearAllState}
        class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
      >
        Clear All
      </button>
    </div>
  </div>

  <!-- Add New State Item -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Add State Item</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        bind:value={newKey}
        placeholder="Key name"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
      <input
        type="text"
        bind:value={newValue}
        placeholder="Value (JSON or string)"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
      <button
        on:click={addStateItem}
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
      >
        Add Item
      </button>
    </div>
  </div>

  <!-- Current State Display -->
  {#if Object.keys(state).length > 0}
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Current State</h3>
      
      <div class="space-y-3">
        {#each Object.entries(state) as [key, value]}
          {#if key !== undefined && value !== undefined}
            <div class="border border-gray-200 rounded-lg p-4">
              {#if editingKey === key}
                <div class="space-y-2">
                  <div class="font-medium text-gray-900">{key}:</div>
                  <textarea
                    bind:value={editingValue}
                    rows="4"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
                  ></textarea>
                  <div class="flex space-x-2">
                    <button
                      on:click={saveEdit}
                      class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      on:click={cancelEdit}
                      class="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              {:else}
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 mb-1">{key}:</div>
                    <pre class="text-sm text-gray-600 whitespace-pre-wrap break-all">{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</pre>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button
                      on:click={() => startEdit(key, value)}
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      on:click={() => deleteStateItem(key)}
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {:else}
    <div class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
      <p class="text-gray-500">No state items yet. Add some above to get started.</p>
    </div>
  {/if}

  <!-- Hooks Configuration -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Event Hooks</h3>
    
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          bind:value={newHookEvent}
          class="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select Event</option>
          <option value="beforeStateUpdate">Before State Update</option>
          <option value="afterStateUpdate">After State Update</option>
          <option value="websocketConnect">WebSocket Connect</option>
          <option value="websocketDisconnect">WebSocket Disconnect</option>
          <option value="fileUpload">File Upload</option>
          <option value="apiRequest">API Request</option>
        </select>
        
        <textarea
          bind:value={newHookCallback}
          placeholder="console.log('Hook triggered:', data);"
          rows="2"
          class="md:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
        ></textarea>
        
        <button
          on:click={addHook}
          class="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
        >
          Add Hook
        </button>
      </div>

      {#if hooks.length > 0}
        <div class="mt-4">
          <h4 class="font-medium text-gray-700 mb-2">Active Hooks:</h4>
          <div class="space-y-2">
            {#each hooks as hook, index}
              <div class="bg-purple-50 p-3 rounded-md">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-purple-900">{hook.event}</span>
                </div>
                <pre class="text-sm text-purple-700 mt-1">{hook.callback}</pre>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Middleware Configuration -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Data Middleware</h3>
    
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <textarea
          bind:value={newMiddleware}
          placeholder="return { ...data, processed: true };"
          rows="2"
          class="md:col-span-3 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
        ></textarea>
        
        <button
          on:click={addMiddleware}
          class="bg-orange-600 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-700"
        >
          Add Middleware
        </button>
      </div>

      {#if middleware.length > 0}
        <div class="mt-4">
          <h4 class="font-medium text-gray-700 mb-2">Active Middleware:</h4>
          <div class="space-y-2">
            {#each middleware as mw, index}
              <div class="bg-orange-50 p-3 rounded-md">
                <pre class="text-sm text-orange-700">{mw}</pre>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- State History -->
  {#if stateHistory.length > 0}
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">State History</h3>
      
      <div class="space-y-2 max-h-96 overflow-y-auto">
        {#each stateHistory as historyItem, index}
          <div class="border border-gray-200 rounded p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-500">
                {new Date(historyItem.timestamp).toLocaleString()}
              </span>
              <button
                on:click={() => restoreState(historyItem.state)}
                class="text-xs text-blue-600 hover:text-blue-800"
              >
                Restore
              </button>
            </div>
            <pre class="text-xs text-gray-600 overflow-auto max-h-20">
{JSON.stringify(historyItem.state, null, 2)}
            </pre>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>