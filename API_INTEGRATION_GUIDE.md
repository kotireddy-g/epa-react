# API Integration Guide for React (Coming from Flutter)

## 📚 Overview

This guide explains how to use APIs in React, tailored for developers with Flutter experience.

## 🔄 Flutter vs React API Pattern

### Flutter (What you know):
```dart
// In Flutter
import 'package:http/http.dart' as http;

Future<List<Idea>> fetchIdeas() async {
  final response = await http.get(Uri.parse('$baseUrl/ideas'));
  if (response.statusCode == 200) {
    return parseIdeas(response.body);
  }
  throw Exception('Failed to load ideas');
}

// Usage in Widget
class IdeaScreen extends StatefulWidget {
  @override
  _IdeaScreenState createState() => _IdeaScreenState();
}

class _IdeaScreenState extends State<IdeaScreen> {
  List<Idea> ideas = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchIdeas().then((data) {
      setState(() {
        ideas = data;
        isLoading = false;
      });
    });
  }
}
```

### React (What we're using):
```typescript
// In React
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function IdeaPage() {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getIdeas().then((data) => {
      setIdeas(data);
      setIsLoading(false);
    });
  }, []); // [] means run once when component mounts

  // Rest of component...
}
```

## 🎯 Key Concepts

### 1. **API Service (Similar to Flutter's http service)**

Our `apiService` (in `src/services/api.ts`) is like Flutter's http client:

```typescript
// Flutter equivalent: http.get(), http.post(), etc.
apiService.getIdeas()      // GET request
apiService.createIdea()    // POST request
apiService.updateIdea()    // PUT request
```

### 2. **useState Hook (Similar to Flutter's setState)**

```typescript
// React
const [ideas, setIdeas] = useState([]);

// Flutter equivalent
List<Idea> ideas = [];
setState(() {
  ideas = newIdeas;
});
```

### 3. **useEffect Hook (Similar to Flutter's initState/lifecycle)**

```typescript
// React: Run when component mounts
useEffect(() => {
  loadData();
}, []);  // Empty array = run once (like initState)

// React: Run when specific value changes
useEffect(() => {
  loadData();
}, [userId]);  // Runs when userId changes

// Flutter equivalent
@override
void initState() {
  super.initState();
  loadData();
}
```

## 📝 Step-by-Step: How to Use the API

### Step 1: Import the API Service

```typescript
import { apiService } from '../services/api';
```

### Step 2: Set Up State

```typescript
const [ideas, setIdeas] = useState<Idea[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Step 3: Fetch Data on Component Mount

```typescript
useEffect(() => {
  const loadIdeas = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getIdeas();
      setIdeas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  loadIdeas();
}, []);
```

### Step 4: Create/Update Data

```typescript
const handleCreateIdea = async (newIdea) => {
  try {
    const created = await apiService.createIdea(newIdea);
    setIdeas([...ideas, created]);  // Add to local state
  } catch (err) {
    alert('Error creating idea: ' + err.message);
  }
};

const handleUpdateIdea = async (id, updates) => {
  try {
    const updated = await apiService.updateIdea(id, updates);
    setIdeas(ideas.map(idea => 
      idea.id === id ? updated : idea
    ));
  } catch (err) {
    alert('Error updating idea: ' + err.message);
  }
};
```

## 🔍 Complete Example: Updating IdeaPage

```typescript
import { useState, useEffect } from 'react';
import { apiService, Idea } from '../services/api';
import { Button } from './ui/button';

export function IdeaPage() {
  // State management (like Flutter's State)
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load ideas when component mounts (like Flutter's initState)
  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getIdeas();
      setIdeas(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIdea = async (summary: string, description: string) => {
    try {
      const bulletPoints = generateBulletPoints(description);
      
      const newIdea = await apiService.createIdea({
        summary,
        description,
        bulletPoints,
        status: 'draft',
      });

      // Update local state (like Flutter's setState)
      setIdeas([...ideas, newIdea]);
    } catch (err: any) {
      alert('Error creating idea: ' + err.message);
    }
  };

  const handleUpdateIdea = async (id: string, updates: Partial<Idea>) => {
    try {
      const updated = await apiService.updateIdea(id, updates);
      
      setIdeas(ideas.map(idea => 
        idea.id === id ? updated : idea
      ));
    } catch (err: any) {
      alert('Error updating idea: ' + err.message);
    }
  };

  // Loading state (like Flutter's FutureBuilder loading)
  if (isLoading) {
    return <div>Loading ideas...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Main render
  return (
    <div>
      <h1>Your IDEAS</h1>
      {ideas.map(idea => (
        <div key={idea.id}>
          <h3>{idea.summary}</h3>
          <p>{idea.description}</p>
        </div>
      ))}
      <Button onClick={() => handleCreateIdea('New Idea', 'Description')}>
        Create Idea
      </Button>
    </div>
  );
}
```

## 🚀 Available API Methods

### Ideas
- `apiService.getIdeas()` - Get all ideas
- `apiService.getIdea(id)` - Get single idea
- `apiService.createIdea(data)` - Create new idea
- `apiService.updateIdea(id, data)` - Update idea

### Validation
- `apiService.saveValidation({ ideaId, validationData, score })` - Save validation

### Business Plans
- `apiService.saveBusinessPlan({ ideaId, templateId, sections, tasks })` - Save business plan

### Implementation
- `apiService.saveImplementationItem(item)` - Create implementation item
- `apiService.getImplementationItems(ideaId)` - Get implementation items for an idea

## 💡 Pro Tips

### 1. **Error Handling**
Always wrap API calls in try-catch:
```typescript
try {
  const data = await apiService.getIdeas();
  setIdeas(data);
} catch (error) {
  console.error('API Error:', error);
  setError(error.message);
}
```

### 2. **Loading States**
Show loading indicators while fetching:
```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await apiService.getIdeas();
    setIdeas(data);
  } finally {
    setIsLoading(false);  // Always runs
  }
};
```

### 3. **Optimistic Updates**
Update UI immediately, then sync with server:
```typescript
const handleDelete = async (id) => {
  // Update UI immediately
  setIdeas(ideas.filter(idea => idea.id !== id));
  
  try {
    await apiService.deleteIdea(id);
  } catch (err) {
    // Rollback on error
    setIdeas([...ideas]);
    alert('Failed to delete');
  }
};
```

## 🏗️ Project Structure

```
src/
├── services/
│   └── api.ts              # API service (like Flutter's http client)
├── components/
│   ├── IdeaPage.tsx        # Uses apiService
│   ├── ValidationPage.tsx  # Uses apiService
│   └── ...
└── App.tsx                 # Main app
```

## 🔗 Backend Architecture

```
server/
├── src/
│   ├── config/
│   │   └── database.js     # SQLite database setup
│   ├── server.js           # Express API server
│   └── ...
└── business_ideas.db       # SQLite database file
```

## 📊 Database Schema

### ideas table
- id, summary, description, bullet_points
- status, company_name, is_active
- created_at, updated_at

### validations table
- id, idea_id, validation_data, score
- created_at

### business_plans table
- id, idea_id, template_id, sections, tasks
- created_at, updated_at

### implementation_items table
- id, idea_id, item_type, name, owner
- start_date, end_date, completion_percentage, status
- created_at, updated_at

## 🎯 Next Steps

1. **Update Components**: Replace `useState` with API calls in:
   - IdeaPage.tsx
   - ValidationPage.tsx
   - BusinessPlanPage.tsx
   - ImplementationPage.tsx

2. **Add Loading States**: Show spinners while data loads

3. **Error Handling**: Display user-friendly error messages

4. **Real-time Updates**: Consider WebSockets for live updates (advanced)

---

**Remember**: In React, data flows one way (parent → child), and API calls update state, which triggers re-renders. This is similar to Flutter's setState pattern!
