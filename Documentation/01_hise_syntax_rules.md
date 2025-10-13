# HISE Syntax Rules and Common Mistakes

## Overview
HISE (Hart Instruments Sampler Engine) is a toolkit for developing sample-based virtual instruments with integrated scripting capabilities. This document covers the essential syntax rules and common mistakes to avoid.

## Most Common HISE Syntax Mistakes

### 1. **Using Standard JavaScript Function Syntax Instead of `inline function`**
```javascript
// ❌ WRONG - Standard JavaScript syntax
function myFunction(component, value) {
    // function body
}

// ✅ CORRECT - HISE requires inline function syntax
inline function myFunction(component, value) {
    // function body
}
```

### 2. **Declaring Variables Inside `inline function` Declarations**
```javascript
// ❌ WRONG - No variable declarations allowed inside inline functions
inline function myFunction() {
    const myVariable = "value"; // This causes errors
    var localVar = "local";     // This also causes errors
    let anotherVar = "test";    // This also causes errors
}

// ✅ CORRECT - Variables must be declared outside inline functions
const myVariable = "value";
var localVar = "local";

inline function myFunction() {
    // Use variables declared outside, but don't declare new ones
    Console.print(myVariable);
}
```

### 3. **Trying to Create Audio Effects in Main Interface Script**
```javascript
// ❌ WRONG - Audio processing doesn't work in main interface
inline function processAudio() {
    // Audio processing code - This doesn't work here
}

// ✅ CORRECT - Audio effects must be in Script FX modules
// Create a Script FX module in the Module Tree instead
```

### 4. **Using Non-Existent HISE Methods**
```javascript
// ❌ WRONG - Standard JavaScript methods may not work
array.forEach(function(item) {
    // code
});

// ✅ CORRECT - Use HISE-compatible loops
for (item in array) {
    // code
}
```

### 5. **Forgetting to Check Component Existence**
```javascript
// ❌ WRONG - Direct access might crash if component doesn't exist
const component = Content.getComponent("myComponent");
component.setValue(0.5); // Might crash if component doesn't exist

// ✅ CORRECT - Always check first
const component = Content.getComponent("myComponent");
if (component) {
    component.setValue(0.5);
}
```

### 6. **Using Wrong Variable Declaration Keywords**
```javascript
// ❌ WRONG - Invalid syntax combinations
const var myVariable = "value"; // This is invalid syntax

// ✅ CORRECT - Choose one declaration type
const myVariable = "value"; // For global constants
var myVariable = "value";   // For variables that change
let myVariable = "value";   // For block-scoped variables
```

## Key Rules to Remember

1. **Always use `inline function`** instead of `function`
2. **Never declare variables inside `inline function` declarations** - declare them outside
3. **Use HISE-specific loop syntax** (`for (item in array)`) when possible
4. **Always check if components exist** before accessing them
5. **Audio effects must be in Script FX modules**, not in main interface
6. **Use proper variable declaration keywords** (const, var, or let, but not combinations)

## Variable Declaration Rules

```javascript
// ✅ CORRECT - Global scope declarations
const globalConstant = "never changes";
var globalVariable = "can change";
let blockScopedVar = "block scoped";

// ✅ CORRECT - Inside inline functions, use existing variables
inline function myFunction() {
    Console.print(globalConstant);  // Use existing variables
    globalVariable = "new value";   // Modify existing variables
}

// ❌ WRONG - No new declarations inside inline functions
inline function myFunction() {
    var newVar = "value";     // This will cause errors
    const newConst = "value"; // This will cause errors
    let newLet = "value";     // This will cause errors
}
```

## Best Practices

1. **Always use `inline function`** syntax for all function declarations
2. **Declare variables outside** `inline function` declarations
3. **Check component existence** before accessing properties
4. **Use HISE-specific loop syntax** when possible
5. **Cache frequently accessed components** for better performance
6. **Implement proper error handling** for critical operations
7. **Use external tools** for visual assets (KnobMan, Photoshop, etc.)
8. **Follow established naming conventions** for consistency
9. **Test scripts thoroughly** before production use
10. **Document complex logic** with comments
