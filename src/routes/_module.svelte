<script>
  import '../app.css';
  import { Router } from '@roxi/routify';
  import { routes } from '../.routify/routes.default.js';
  
  export let router = new Router({ routes });
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <h1 class="text-2xl font-bold text-gray-900">Vazio Orchestrator</h1>
        <nav class="flex space-x-4">
          <a href="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </a>
          <a href="/files" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            File Manager
          </a>
          <a href="/api" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            API Test
          </a>
          <a href="/state" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            State Manager
          </a>
        </nav>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <Router {router} />
  </main>
</div>