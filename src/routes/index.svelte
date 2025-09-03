<script lang="ts">
  import { onMount } from 'svelte';
  import orchestrator from '../lib/orchestrator';
  import type { StateStore } from '../lib/orchestrator';
  
  let state: StateStore = {};
  let isWebSocketConnected = false;
  let apiBaseUrl = '';
  let websocketUrl = '';

  onMount(() => {
    const unsubscribe = orchestrator.getStore().subscribe(value => {
      state = value;
    });

    orchestrator.addHook('websocketConnect', () => {
      isWebSocketConnected = true;
    });

    orchestrator.addHook('websocketDisconnect', () => {
      isWebSocketConnected = false;
    });

    return unsubscribe;
  });

  function connectWebSocket() {
    if (websocketUrl) {
      try {
        orchestrator.connectWebSocket(websocketUrl);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    }
  }

  function disconnectWebSocket() {
    orchestrator.disconnectWebSocket();
  }

  async function testApiCall() {
    if (apiBaseUrl) {
      try {
        const result = await orchestrator.apiRequest('/test', {
          method: 'GET'
        });
        orchestrator.setState('lastApiResult', result);
      } catch (error) {
        console.error('API call failed:', error);
        orchestrator.setState('lastApiError', error.message);
      }
    }
  }

  function addTestData() {
    orchestrator.setState('testData', {
      timestamp: new Date().toISOString(),
      value: Math.random(),
      message: 'Test data from dashboard'
    });
  }
</script>

<div class="space-y-6">
  <!-- Welcome Section -->
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      Welcome to Vazio Orchestrator
    </h2>
    <p class="text-gray-600 mb-4">
      Your central hub for web application state management with WebSocket and REST API integration.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="font-medium text-blue-900">State Management</h3>
        <p class="text-sm text-blue-700">Centralized store with reactive updates</p>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="font-medium text-green-900">Dynamic Hooks</h3>
        <p class="text-sm text-green-700">Programmable event handlers</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg">
        <h3 class="font-medium text-purple-900">File Processing</h3>
        <p class="text-sm text-purple-700">JSON, YAML, CSV parsing support</p>
      </div>
    </div>
  </div>

  <!-- Connection Configuration -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Connection Configuration</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- WebSocket Configuration -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-700">WebSocket Connection</h4>
        <div class="flex space-x-2">
          <input
            type="text"
            bind:value={websocketUrl}
            placeholder="ws://localhost:9292/ws"
            class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {#if isWebSocketConnected}
            <button
              on:click={disconnectWebSocket}
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Disconnect
            </button>
          {:else}
            <button
              on:click={connectWebSocket}
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Connect
            </button>
          {/if}
        </div>
        <p class="text-sm text-gray-500">
          Status: {isWebSocketConnected ? 'Connected' : 'Disconnected'}
        </p>
      </div>

      <!-- API Configuration -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-700">REST API Configuration</h4>
        <div class="flex space-x-2">
          <input
            type="text"
            bind:value={apiBaseUrl}
            placeholder="http://localhost:9292/api"
            class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            on:click={testApiCall}
            class="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Test API
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
    <div class="flex space-x-4">
      <button
        on:click={addTestData}
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
      >
        Add Test Data
      </button>
      <button
        on:click={() => orchestrator.reset()}
        class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
      >
        Reset State
      </button>
    </div>
  </div>

  <!-- Current State Display -->
  {#if Object.keys(state).length > 0}
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Current State</h3>
      <pre class="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
{JSON.stringify(state, null, 2)}
      </pre>
    </div>
  {/if}
</div>