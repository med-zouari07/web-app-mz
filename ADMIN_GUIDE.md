# Admin Panel Guide

## Accessing the Admin Panel

The admin panel for managing activities has been created and is available in the codebase. To use it:

1. Navigate to `/src/components/Admin.tsx`
2. You can integrate it into your main app by:
   - Creating a separate admin route
   - Using React Router to conditionally show the admin panel
   - Adding authentication checks before allowing access

## Admin Panel Features

### Create Activities
- Add new activities with titles and descriptions in English, French, and Arabic
- Upload activity images via URL
- Activities can be for any occasion: Ramadan, holidays, special events, etc.

### Edit Activities
- Modify existing activities
- Update descriptions, titles, and images
- Changes are saved to the Supabase database

### Delete Activities
- Remove activities that are no longer needed
- Activities are permanently deleted from the database

## Database

Activities are stored in the `activities` table in Supabase with:
- `id` - Unique identifier
- `title_en`, `title_fr`, `title_ar` - Titles in each language
- `description_en`, `description_fr`, `description_ar` - Descriptions in each language
- `image` - URL to the activity image
- `created_at`, `updated_at` - Timestamps

## Contact Messages

Contact form submissions are stored in the `contact_messages` table with:
- `id` - Unique identifier
- `name` - Sender's name
- `email` - Sender's email
- `message` - The message content
- `read` - Whether the message has been read (default: false)
- `created_at` - When the message was received

## Usage Example

To add the admin panel to your main app with a simple password protection:

```typescript
import Admin from './components/Admin';
import { useState } from 'react';

// In your App or router:
const [adminMode, setAdminMode] = useState(false);

if (adminMode) {
  return <Admin />;
}

// Or use React Router:
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/" element={<App />} />
  <Route path="/admin" element={<Admin />} />
</Routes>
```

## Recommended Next Steps

1. Add authentication/password protection to the admin panel
2. Create a management page to view and respond to contact messages
3. Add analytics to track activity views and donations
4. Implement activity categories/tags for better organization
5. Add image upload functionality instead of requiring URLs
