---
description: it should be applieed on my hise project files
globs: 
alwaysApply: true
---
# HISE Project Rules - AI Assistant Guidelines

## 1. Core HISE Environment Awareness
**CRITICAL RULE**: Remember that you are working on an audio plugin in HISE (Hart Instruments Sampler Engine), not standard JavaScript.

**DOCUMENTATION RULE**: Read the file every 5 minutes to stay aware of the HISE environment and syntax requirements.

**DOCUMENTATION AS RULES**: 
- Always check and reference the project's documentation files (01_hise_syntax_rules.md, 02_hise_api_reference.md, 03_scriptnode_reference.md, etc.)
- Treat their contents as binding rules for all coding, scripting, and workflow tasks
- Apply documented rules to all answers and code suggestions
- Warn if a request would violate a documented rule

**HISE SCRIPT LANGUAGE**:
- Always remember that the scripting language is **HISE Script**, not JavaScript
- All code examples, explanations, and script-related advice must be tailored for HISE Script syntax and conventions
- Use HISE-specific APIs and patterns instead of standard JavaScript patterns



## 4. Documentation & Journaling
- **Rule**: Every significant change or new workflow should be documented in Moo_bass_journal.md with the date.
- **Rule**: Reference all external resources (videos, articles, etc.) in the journal with a link and a short note.

## 5. Coding & Scripting
- **Rule**: All scripts must be named descriptively (e.g., rename_808s.sh, create_samplemaps.sh).
- **Rule**: Scripts should be idempotent (safe to run multiple times without causing errors or duplicates).
- **Rule**: Always test scripts on a backup before running on the main project.

## 6. Editor/Environment
- **Rule**: Use a dark theme with high-contrast text in Cursor.
- **Rule**: Set up file watchers or auto-formatting for Markdown and scripts.
- **Rule**: Use code folding and minimap for easier navigation in large files.

## 7. General Workflow
- **Rule**: Always put the document you're working on in @ Add Context
- **Rule**: Before starting a new feature or major change, make a backup of the project.
- **Rule**: At the end of each session, write a short summary in the journal.
- **Rule**: Always Use https://docs.hise.dev as manual for HISE JavaScript

## 8. AI Assistant Specific Rules
- **RULE**: When writing HISE code, always check the readmeai.md file for syntax requirements
- **RULE**: If encountering linter errors with `inline function`, verify the syntax against HISE documentation
- **RULE**: When debugging button callbacks, use `Content.getComponent()` to get button references
compilation
- **RULE**: When in doubt about HISE syntax, refer to https://docs.hise.dev before using standard JavaScript patterns
