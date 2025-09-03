// @ts-nocheck


export const routes = {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes",
    "dir": "src",
    "base": "routes",
    "ext": "",
    "name": "routes"
  },
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default__layout_svelte",
      "name": "+layout",
      "file": {
        "path": "src/routes/+layout.svelte",
        "dir": "src/routes",
        "base": "+layout.svelte",
        "ext": ".svelte",
        "name": "+layout"
      },
      "asyncModule": () => import('../src/routes/+layout.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_api_svelte",
      "name": "api",
      "file": {
        "path": "src/routes/api.svelte",
        "dir": "src/routes",
        "base": "api.svelte",
        "ext": ".svelte",
        "name": "api"
      },
      "asyncModule": () => import('../src/routes/api.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_files_svelte",
      "name": "files",
      "file": {
        "path": "src/routes/files.svelte",
        "dir": "src/routes",
        "base": "files.svelte",
        "ext": ".svelte",
        "name": "files"
      },
      "asyncModule": () => import('../src/routes/files.svelte'),
      "children": []
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_state_svelte",
      "name": "state",
      "file": {
        "path": "src/routes/state.svelte",
        "dir": "src/routes",
        "base": "state.svelte",
        "ext": ".svelte",
        "name": "state"
      },
      "asyncModule": () => import('../src/routes/state.svelte'),
      "children": []
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}
export default routes