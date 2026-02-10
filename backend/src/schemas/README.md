# Scenario Schemas

This directory contains TypeScript schema definitions for all scenario types in the platform.

## Overview

The schema layer provides:
1. **TypeScript Interfaces**: Type definitions for compile-time safety
2. **Mongoose Models**: MongoDB schemas with runtime validation
3. **Validation Functions**: Custom validation logic

## Structure
```
schemas/
└── scenarios/
    ├── base-scenario.schema.ts      # Common fields for all types
    ├── ctf-scenario.schema.ts       # CTF-specific fields
    └── index.ts                     # Export all schemas

models/
└── CTFScenario.model.ts            # MongoDB/Mongoose implementation
```

## Technology Stack

**Database**: MongoDB (recommended by course instructor)  
**ODM**: Mongoose  
**Language**: TypeScript

## Current Schemas

### CTF (Capture The Flag) - v1.0 (Draft)
- **TypeScript Interface**: `schemas/scenarios/ctf-scenario.schema.ts`
- **Mongoose Model**: `models/CTFScenario.model.ts`
- **Documentation**: `docs/schemas/CTF-Schema-Specification.md`
- **Status**: Draft - Pending team review (Week 6)

### Coming Soon
- **Quiz** - Week 9
- **Hands-on Lab** - Week 10
- **Simulated Attack** - Week 11

## Usage

### TypeScript (Type Checking)
```typescript
import { CTFScenario, CTFGameContent } from './schemas/scenarios';

const scenario: CTFScenario = {
  scenario_id: "uuid-123",
  scenario_type: "ctf",
  basic_info: {
    title: "My CTF Challenge",
    topic: "Packet Sniffing",
    difficulty: "intermediate",
    estimated_time: 20,
    learning_objectives: ["Analyze packets"]
  },
  game_content: {
    description: "...",
    flag: "CTF{flag_here}",
    hints: [...],
    solutions: [...],
    feedback_templates: {...}
  },
  metadata: {...}
};

// TypeScript will check types at compile time
```

### Mongoose (Database Operations)
```typescript
import { CTFScenarioModel, createCTFScenario } from './models/CTFScenario.model';

// Create a new scenario
const scenario = await createCTFScenario({
  basic_info: {...},
  game_content: {...}
}, "instructor@example.com");

// Query scenarios
const published = await CTFScenarioModel.findPublished();
const myScenarios = await CTFScenarioModel.findByInstructor("instructor@example.com");

// Update scenario
scenario.basic_info.title = "Updated Title";
await scenario.save(); // Automatically updates version and timestamp

// Publish scenario
await scenario.publish();
```

### Validation
```typescript
import { validateCTFScenarioData } from './models/CTFScenario.model';

const validation = validateCTFScenarioData(scenarioData);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Handle errors...
}
```

## Schema Design Principles

1. **Type Safety**: TypeScript interfaces provide compile-time checking
2. **Runtime Validation**: Mongoose schemas enforce rules at database level
3. **Flexibility**: Support diverse CTF topics with one schema
4. **Extensibility**: Easy to add fields without breaking existing code
5. **Performance**: Strategic indexes for common queries

## Relationship: TypeScript vs Mongoose
```
TypeScript Interface (compile-time)
         ↓
    Your Code
         ↓
Mongoose Schema (runtime)
         ↓
    MongoDB Database
```

**Both are needed:**
- TypeScript: Catches errors during development
- Mongoose: Validates data before saving to database

## MongoDB Connection

**Setup** (see `backend/src/config/database.ts`):
```typescript
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instructor_portal');
```

**Environment Variable**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/instructor_portal
```

## Validation Rules

See: `CTF_CONSTRAINTS` in `ctf-scenario.schema.ts`

**Key Constraints**:
- Description: 300-600 characters
- Background story: 100-300 characters (if provided)
- Flag: Must match `CTF{...}` pattern
- Hints: 3-7 items required
- Solutions: At least 1 required
- Learning objectives: At least 1 required

## Collections in MongoDB

| Collection | Purpose | Model |
|-----------|---------|-------|
| `ctf_scenarios` | CTF scenarios | CTFScenarioModel |
| `quiz_scenarios` | Quiz scenarios | Coming in Week 9 |
| `templates` | Scenario templates | Coming in Week 8 |
| `instructors` | Instructor accounts | Coming in Week 8 |

## Documentation

**Detailed Specifications**:
- [CTF Schema Specification](../../docs/schemas/CTF-Schema-Specification.md)
- [API Documentation](../../docs/api-documentation.md) (Coming soon)
- [Database Design](../../docs/database-schema.md) (Coming soon)

## Development Workflow

1. **Design**: Define TypeScript interface
2. **Implement**: Create Mongoose model
3. **Test**: Validate with sample data
4. **Document**: Update specifications
5. **Review**: Team review in weekly meeting

## Testing
```typescript
// Example: Create and validate a test scenario
import { CTFScenarioModel, validateCTFScenarioData } from './models';

const testData = {
  basic_info: {...},
  game_content: {...}
};

// Validate before saving
const validation = validateCTFScenarioData(testData);
if (validation.valid) {
  const scenario = await createCTFScenario(testData, "test@example.com");
  console.log('Created:', scenario.scenario_id);
}
```

## Notes

- All schemas use TypeScript for type safety
- MongoDB provides flexible schema with Mongoose validation
- Indexes are created automatically on first query
- Use `timestamps: true` for automatic createdAt/updatedAt
- Virtual properties don't persist to database but available in queries

## Questions?

- Check the detailed specification docs
- Create a GitHub Issue
- Ask in team meetings