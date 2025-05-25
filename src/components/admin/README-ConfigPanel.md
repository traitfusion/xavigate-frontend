# Xavigate Config Panel - Integration Guide

## What This Component Does
This is a React component that provides an admin interface for updating:
1. **System Prompt** - The AI assistant's base prompt (text file)
2. **Conversation History Limit** - How many previous messages to include (number 1-10)
3. **RAG Top-K Results** - How many documents to retrieve from vector search (number 1-10)

## What You Need to Implement

### 1. Backend Endpoints
Create two endpoints:

#### GET `/api/config`
Should return:
```json
{
  "systemPrompt": "current prompt text...",
  "conversationHistoryLimit": 3,
  "topK_RAG_hits": 4
}
```

#### POST `/api/config`
Receives:
```json
{
  "systemPrompt": "updated prompt text...",
  "conversationHistoryLimit": 5,
  "topK_RAG_hits": 6
}
```
Should save these values and return:
```json
{
  "status": "ok"
}
```

### 2. Update the Component Configuration
In the component, update these sections marked with "SEAN TODO":

1. **Line 15**: Set `isAdmin` based on your auth system
2. **Line 18-21**: Add authentication token logic if needed
3. **Lines in fetchConfig() and saveConfig()**: Add auth headers if required

### 3. Storage Options (Your Choice)
You can store these values in:
- Text files (system_prompt.txt + config.json)
- Database table
- Environment variables
- Redis/cache

### 4. Use the Values in Your Existing Code
However you're currently building the GPT prompt and doing RAG search, just read these stored values:
- Use `systemPrompt` when initializing GPT
- Use `conversationHistoryLimit` when building message context
- Use `topK_RAG_hits` when searching your vector database

## Installation
1. Save the component as: `/frontend/src/components/admin/ConfigPanel.tsx`
2. Add to your routes: `<Route path="/admin/config" element={<ConfigPanel />} />`
3. The component uses Tailwind CSS (already in your project)

## Testing
1. Set `isAdmin = true` to see the config panel
2. Set `isAdmin = false` to see the "Access Denied" screen
3. The UI will show loading states and success/error messages

That's it! The UI is complete and ready to use. You just need to:
- Create the two endpoints
- Store/retrieve the three values
- Use them in your existing chat logic