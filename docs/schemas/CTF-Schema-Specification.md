# CTF Scenario Schema Specification

**Version**: 1.0 (Draft)  
**Author**: Ying Wang (Instructor Portal)  
**Date**: February 12, 2026  
**Status**: Draft - Pending Team Review  
**Last Updated**: 2026-02-12

---

## Table of Contents

1. [Overview](#overview)
2. [Purpose](#purpose)
3. [Schema Files](#schema-files)
4. [Core Concepts](#core-concepts)
5. [Field Definitions](#field-definitions)
6. [Validation Rules](#validation-rules)
7. [Examples](#examples)
8. [Integration Points](#integration-points)
9. [Open Questions](#open-questions)
10. [Change Log](#change-log)

---

## Overview

This document defines the standardized format for CTF (Capture The Flag) scenarios in the LLM-Assisted Gamified Cybersecurity Training Platform.

The CTF format supports all cybersecurity topics including:
- Network Security (Packet Sniffing, DNS Attacks, etc.)
- Web Security (SQL Injection, XSS, CSRF, etc.)
- System Security (Privilege Escalation, Buffer Overflow, etc.)
- Cloud Security (AWS/Azure misconfigurations, etc.)

---

## Purpose

**Primary Goals:**
1. Standardize CTF scenario data structure across all modules
2. Enable LLM-based content generation (Tianze's LLM Service)
3. Support gamification features (Raagini's Gamification Platform)
4. Facilitate instructor content management (Instructor Portal)

**Design Principles:**
- **Flexibility**: Support diverse CTF topics with one schema
- **Extensibility**: Easy to add new fields without breaking existing code
- **Validation**: Clear constraints for data quality
- **Separation of Concerns**: Instructor content vs. Gamification settings

---

## Schema Files
```
backend/src/schemas/scenarios/
├── base-scenario.schema.ts      # Common fields for all scenario types
├── ctf-scenario.schema.ts       # CTF-specific fields
└── index.ts                     # Export all schemas
```

**TypeScript Interfaces:**
- `BaseScenario` - Common fields
- `CTFScenario` - Complete CTF scenario
- `CTFGameContent` - Game-specific content
- `CTFEnvironment` - Environment configuration
- `CTFHint`, `CTFSolution`, etc.

---

## Core Concepts

### Scenario Lifecycle
```
Draft → Pending Review → Published → Archived
  ↑           ↓              ↓
  └───────────┴──────────────┘
        (can be edited)
```

### Content Layers

1. **Basic Info**: Metadata (title, topic, difficulty)
2. **Game Content**: What learners interact with
3. **Solutions**: What instructors see (hidden from learners)
4. **Educational Content**: Post-completion learning material

### Flag Validation Types

- `exact_match`: Flag must match exactly
- `regex`: Flag must match a regex pattern
- `case_insensitive`: Case doesn't matter

---

## Field Definitions

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `scenario_id` | string (UUID) | Unique identifier |
| `scenario_type` | "ctf" | Always "ctf" for CTF scenarios |
| `basic_info` | BasicInfo | Metadata about the scenario |
| `game_content` | CTFGameContent | Core CTF content |
| `metadata` | ScenarioMetadata | Creation/version info |

### CTFGameContent Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `description` | string | Yes | 300-600 chars |
| `flag` | string | Yes | Must match `CTF{...}` |
| `hints` | CTFHint[] | Yes | 3-7 items |
| `solutions` | CTFSolution[] | Yes | At least 1 |
| `feedback_templates` | object | Yes | - |
| `background_story` | string | No | 100-300 chars |
| `environment` | CTFEnvironment | No | - |
| `educational_content` | object | No | Recommended |

---

## Validation Rules
```typescript
CTF_CONSTRAINTS = {
  description: { min: 300, max: 600 chars },
  background_story: { min: 100, max: 300 chars },
  hints: { count: 3-7 },
  solutions: { min: 1 },
  flag: { pattern: /^CTF\{[^\}]+\}$/ }
}
```

**Validation Function:**
```typescript
validateCTFScenario(scenario: CTFScenario): { valid: boolean, errors: string[] }
```

---

## Examples

See: `mock-data/ctf-examples/`

### Topics Supported

- **Network Security**: Packet Sniffing, ARP Spoofing, DNS Attacks
- **Web Security**: SQL Injection, XSS, CSRF
- **Cryptography**: Hash cracking, Cipher breaking
- **Forensics**: Log analysis, Memory forensics

All use the same schema structure!

---

## Integration Points

### With LLM Service (Tianze)

**Input to LLM:**
```json
{
  "topic": "Packet Sniffing",
  "difficulty": "intermediate",
  "llm_config": { ... }
}
```

**Expected Output:**
Complete `CTFGameContent` matching this schema

### With Gamification Platform (Raagini)

**Published Scenario:**
```json
POST /api/gamification/scenarios
Body: CTFScenario (complete object)
```

**Fields Raagini Needs:**
- `flag` (for validation)
- `hints` with `suggested_cost`
- `feedback_templates`
- `max_score`
- `gamification_config` (optional)

---

## Open Questions

**For Week 6 Meeting:**

1. **Tianze**: Can your LLM generate all these fields reliably?
2. **Raagini**: Do you need additional gamification fields?
3. **Team**: Should we support multi-stage CTF (multiple flags)?
4. **Team**: How to handle dynamic environments (Docker, VMs)?

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-12 | 1.0 (Draft) | Initial schema definition | Ying Wang |

---

## Review Process

1. ✅ Internal review (Ying) - Feb 12, 2026
2. ⏳ Team review (Tianze, Raagini) - Week 6 Meeting
3. ⏳ Incorporate feedback
4. ⏳ Version 1.0 Final Release

---

## Contact

**Questions or Suggestions?**
- Create a GitHub Issue
- Email: ying.wang@example.edu
- Discuss in Week 6 team meeting