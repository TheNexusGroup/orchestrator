<script lang="ts">
  import { onMount } from 'svelte';
  import orchestrator from '../lib/orchestrator';

  let apiUrl = '';
  let method = 'GET';
  let headers = '{\n  "Content-Type": "application/json"\n}';
  let body = '';
  let response = '';
  let loading = false;
  let requests: Array<{url: string, method: string, timestamp: string, status?: string, response?: any}> = [];

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  onMount(() => {
    orchestrator.addHook('apiRequest', (data) => {
      requests = [
        {
          url: data.url,
          method: data.options.method || 'GET',
          timestamp: new Date().toISOString()
        },
        ...requests
      ].slice(0, 10);
    });
  });

  async function makeRequest() {
    if (!apiUrl.trim()) {
      alert('Please enter an API URL');
      return;
    }

    loading = true;
    response = '';

    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = headers ? JSON.parse(headers) : {};
      } catch (e) {
        throw new Error('Invalid JSON in headers');
      }

      const options: RequestInit = {
        method,
        headers: parsedHeaders
      };

      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = body;
      }

      const result = await orchestrator.apiRequest(apiUrl, options);
      
      response = JSON.stringify(result, null, 2);
      
      requests = requests.map(req => 
        req.url === apiUrl && req.method === method && !req.status
          ? { ...req, status: 'success', response: result }
          : req
      );

      orchestrator.setState('lastApiResult', result);

    } catch (error) {
      response = `Error: ${error.message}`;
      
      requests = requests.map(req => 
        req.url === apiUrl && req.method === method && !req.status
          ? { ...req, status: 'error', response: error.message }
          : req
      );

      orchestrator.setState('lastApiError', error.message);
    } finally {
      loading = false;
    }
  }

  function clearHistory() {
    requests = [];
  }

  function loadRequest(request: any) {
    apiUrl = request.url;
    method = request.method;
    if (request.response && typeof request.response === 'object') {
      response = JSON.stringify(request.response, null, 2);
    }
  }

  function insertSampleData() {
    body = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      data: {
        timestamp: new Date().toISOString(),
        value: Math.random()
      }
    }, null, 2);
  }
</script>

<div class="space-y-6">
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">API Test Console</h2>
    <p class="text-gray-600 mb-6">
      Test REST API endpoints with custom headers and request bodies. All requests are tracked and can be replayed.
    </p>

    <!-- Request Configuration -->
    <div class="space-y-4">
      <!-- URL and Method -->
      <div class="flex space-x-2">
        <select bind:value={method} class="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[100px]">
          {#each methods as m}
            <option value={m}>{m}</option>
          {/each}
        </select>
        <input
          type="text"
          bind:value={apiUrl}
          placeholder="https://api.example.com/endpoint"
          class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <button
          on:click={makeRequest}
          disabled={loading}
          class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <!-- Headers -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Headers (JSON)</label>
        <textarea
          bind:value={headers}
          rows="3"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
          placeholder="{&quot;Authorization&quot;: &quot;Bearer token&quot;, &quot;Content-Type&quot;: &quot;application/json&quot;}"
        ></textarea>
      </div>

      <!-- Request Body -->
      {#if ['POST', 'PUT', 'PATCH'].includes(method)}
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Request Body</label>
            <button
              on:click={insertSampleData}
              class="text-xs text-blue-600 hover:text-blue-800"
            >
              Insert Sample Data
            </button>
          </div>
          <textarea
            bind:value={body}
            rows="8"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
            placeholder="Enter request body here..."
          ></textarea>
        </div>
      {/if}
    </div>
  </div>

  <!-- Response -->
  {#if response}
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Response</h3>
      <pre class="bg-gray-100 p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap">{response}</pre>
    </div>
  {/if}

  <!-- Request History -->
  {#if requests.length > 0}
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Request History</h3>
        <button
          on:click={clearHistory}
          class="text-sm text-red-600 hover:text-red-800"
        >
          Clear History
        </button>
      </div>

      <div class="space-y-3">
        {#each requests as request, index}
          <div class="border border-gray-200 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {
                  request.method === 'GET' ? 'bg-green-100 text-green-800' :
                  request.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  request.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }">
                  {request.method}
                </span>
                <span class="text-sm text-gray-900">{request.url}</span>
                {#if request.status}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs {
                    request.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }">
                    {request.status}
                  </span>
                {/if}
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500">
                  {new Date(request.timestamp).toLocaleTimeString()}
                </span>
                <button
                  on:click={() => loadRequest(request)}
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Quick Actions -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Quick API Tests</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        on:click={() => {
          apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
          method = 'GET';
          makeRequest();
        }}
        class="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
      >
        Test GET Request
      </button>
      
      <button
        on:click={() => {
          apiUrl = 'https://httpbin.org/post';
          method = 'POST';
          body = JSON.stringify({ message: 'Hello from Vazio!' }, null, 2);
          makeRequest();
        }}
        class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        Test POST Request
      </button>
    </div>
  </div>
</div>