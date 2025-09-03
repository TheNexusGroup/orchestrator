<script lang="ts">
  import { onMount } from 'svelte';
  import orchestrator from '../lib/orchestrator';
  import type { FileUpload } from '../lib/orchestrator';

  let files: FileUpload[] = [];
  let uploadedFile: FileUpload | null = null;
  let dragActive = false;

  onMount(() => {
    const unsubscribe = orchestrator.getStore().subscribe(state => {
      if (state.uploadedFile) {
        uploadedFile = state.uploadedFile;
        if (!files.find(f => f.name === uploadedFile.name)) {
          files = [...files, uploadedFile];
        }
      }
    });

    return unsubscribe;
  });

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      handleFile(input.files[0]);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave() {
    dragActive = false;
  }

  async function handleFile(file: File) {
    try {
      await orchestrator.handleFileUpload(file);
    } catch (error) {
      console.error('File upload failed:', error);
      alert(`File upload failed: ${error.message}`);
    }
  }

  function downloadFile(file: FileUpload, format: 'original' | 'json' = 'original') {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(file.data, null, 2);
      filename = file.name.replace(/\.[^/.]+$/, '.json');
      mimeType = 'application/json';
    } else {
      content = file.content;
      filename = file.name;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-6">
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">File Manager</h2>
    <p class="text-gray-600 mb-6">
      Upload and manage JSON, YAML, and CSV files. Files are automatically parsed and stored in the orchestrator state.
    </p>

    <!-- File Upload Zone -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors {dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}"
      on:drop={handleDrop}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
    >
      <div class="space-y-4">
        <div class="mx-auto w-12 h-12 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
        
        <div>
          <p class="text-lg font-medium text-gray-900">Drop files here</p>
          <p class="text-sm text-gray-500">or click to browse</p>
        </div>

        <input
          type="file"
          accept=".json,.yaml,.yml,.csv"
          on:change={handleFileInput}
          class="hidden"
          id="file-input"
        />
        
        <label
          for="file-input"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose File
        </label>
        
        <p class="text-xs text-gray-400">
          Supported formats: JSON, YAML, CSV
        </p>
      </div>
    </div>
  </div>

  <!-- Uploaded Files List -->
  {#if files.length > 0}
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
      
      <div class="space-y-4">
        {#each files as file, index}
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="font-medium text-gray-900">{file.name}</h4>
                <p class="text-sm text-gray-500">Type: {file.type.toUpperCase()}</p>
              </div>
              
              <div class="flex space-x-2">
                <button
                  on:click={() => downloadFile(file)}
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download Original
                </button>
                <button
                  on:click={() => downloadFile(file, 'json')}
                  class="text-green-600 hover:text-green-800 text-sm"
                >
                  Export as JSON
                </button>
                <button
                  on:click={() => removeFile(index)}
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>

            <!-- File Preview -->
            <div class="bg-gray-50 rounded p-3">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Parsed Data Preview:</h5>
              <pre class="text-xs text-gray-600 overflow-auto max-h-40">
{JSON.stringify(file.data, null, 2)}
              </pre>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- File Operations -->
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">File Operations</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        on:click={() => {
          const stateExport = orchestrator.exportState('json');
          const blob = new Blob([stateExport], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'orchestrator-state.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
        class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
      >
        Export State as JSON
      </button>
      
      <button
        on:click={() => {
          const stateExport = orchestrator.exportState('yaml');
          const blob = new Blob([stateExport], { type: 'text/yaml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'orchestrator-state.yaml';
          a.click();
          URL.revokeObjectURL(url);
        }}
        class="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
      >
        Export State as YAML
      </button>
    </div>
  </div>
</div>