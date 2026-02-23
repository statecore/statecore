# StateCore

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-4.1.0-blue.svg)](https://github.com/statecore/statecore)

A lightweight, performant, and type-safe state management library based on the **observer pattern**.  
StateCore helps you build **reactive, event-driven applications** with minimal overhead and maximum flexibility.

---

## ✨ Features

- 🪶 **Lightweight**: Zero dependencies, minimal footprint (~3KB minified)
- 🔄 **Observable**: Built-in observer system for reactive state updates
- 🛡️ **Type Safe**: Full TypeScript definitions included
- 🌐 **Universal**: Works in browsers, Node.js, and all major bundlers
- 💪 **Error Resilient**: Observer errors won't break your application
- 🔄 **Lifecycle Aware**: Safe cleanup and destroy mechanisms
- 🎯 **Flexible**: Function-based API + Class-based API with static instance management
- ⚡ **High Performance**: Optimized observer notification system

---

## 📦 Installation

```bash
npm install statecore
```

---

## 🚀 Quick Start

```javascript
const { createStatecore, STATECORE_EVENT__STATE_CHANGE } = require('statecore');

// Create a state instance
const store = createStatecore({ count: 0, user: null });

// Add an observer to watch state changes
const unsubscribe = store.statecoreAddObserver((eventName, newState, oldState) => {
  if (eventName === STATECORE_EVENT__STATE_CHANGE) {
    console.log('State changed:', { from: oldState, to: newState });
  }
});

// Update state - observers will be notified automatically
store.statecoreSetState({ count: 1, user: { name: 'John' } });

// Clean up when done
unsubscribe();
store.statecoreDestroy();
```

---

## 📖 Complete API Reference

### Quick Reference

| Method | Returns | Description |
|---|---|---|
| `createStatecore(initialState?)` | `Statecore` | Create a new instance |
| `statecoreGetState()` | `any` | Get current state |
| `statecoreSetState(newState)` | `any` | Set state and notify observers |
| `statecoreAddObserver(...filterArgs?, observer)` | `() => void` | Register observer (with optional leading filter args), returns unsubscribe fn |
| `statecoreRemoveObserver(observer)` | `void` | Remove a specific observer |
| `statecoreNotifyAllObservers(eventName, ...args)` | `Array<{value} \| {error}>` | Emit custom event, get per-observer results |
| `statecoreDestroy()` | `void` | Destroy instance and notify observers |
| `statecoreIsDestroyed()` | `boolean` | Check if instance is destroyed |

**`StatecoreClass` only:**

| Method | Returns | Description |
|---|---|---|
| `statecoreClassStaticGrabInstance(name, initialState?)` | `StatecoreClass` | Get or create a named singleton |
| `statecoreClassStaticGrabInstance(isGrab, name, initialState?)` | `StatecoreClass \| null` | Conditionally get or create a named singleton |

---

### 🏗️ Core Factory

#### `createStatecore(initialState?)`
Creates a new StateCore instance.

**Returns**: a `Statecore` instance.

```javascript
const store = createStatecore();
const storeWithState = createStatecore({ users: [], loading: false });
```

### 📊 State Management

#### `statecoreGetState()`
Retrieves the current state value.

**Returns**: the current state (any type), or `undefined` after the instance is destroyed.

```javascript
const currentState = store.statecoreGetState();
```

#### `statecoreSetState(newState)`
Updates state and automatically notifies all observers.

**Returns**: the new state value.

```javascript
const next = store.statecoreSetState({ users: [...users, newUser], loading: false });
```

### 👁️ Observer Management

#### `statecoreAddObserver(...filterArgs?, observer)`
Adds an observer function that gets called when the instance notifies observers. Optionally, one or more leading filter arguments can be provided before the observer function. When filter args are present, the observer is only invoked if the notification provides at least as many arguments as the number of filter args supplied.

**Returns**: an `unsubscribe()` function — calling it removes the observer.

```javascript
// Basic — called for every notification
const removeObserver = store.statecoreAddObserver((eventName, newState, oldState) => {
  switch (eventName) {
    case STATECORE_EVENT__STATE_CHANGE:
      console.log('State updated:', newState);
      break;
    case STATECORE_EVENT__DESTROY:
      console.log('Store destroyed');
      break;
  }
});

// With a leading filter arg — only invoked when the first notification arg matches
const removeStateObserver = store.statecoreAddObserver(
  STATECORE_EVENT__STATE_CHANGE,
  (eventName, newState, oldState) => {
    console.log('State updated:', newState);
  }
);

// Remove observer when no longer needed
removeObserver();
removeStateObserver();
```

#### `statecoreRemoveObserver(observer)`
Removes a specific observer function.

```javascript
const myObserver = (eventName, newState) => console.log(newState);
store.statecoreAddObserver(myObserver);
store.statecoreRemoveObserver(myObserver);
```

### 🔔 Event System

#### `statecoreNotifyAllObservers(eventName, ...args)`
Manually notify all observers with a custom event. Returns an array of per-observer result objects — one entry per observer in call order.

Each entry is either:
- `{ value: returnValue }` — the observer completed and returned this value (`undefined` if it returned nothing)
- `{ error: Error }` — the observer threw; execution continued with remaining observers

```javascript
const results = store.statecoreNotifyAllObservers('CUSTOM_EVENT', { message: 'Hello' });
// results: [{ value: 'ok' }, { error: Error(...) }, { value: undefined }]

results.forEach(({ value, error }) => {
  if (error) console.error('observer failed:', error);
  else console.log('observer returned:', value);
});
```

### ♻️ Lifecycle Management

#### `statecoreDestroy()`
Destroys the instance, notifies observers, and cleans up resources.

```javascript
store.statecoreDestroy();
```

#### `statecoreIsDestroyed()`
Check if the instance has been destroyed.

**Returns**: `true` if destroyed, `false` otherwise.

```javascript
if (!store.statecoreIsDestroyed()) {
  store.statecoreSetState(newState);
}
```

---

## 🏗️ Class-Based Usage

StateCore provides a powerful class-based API for more complex applications:

```javascript
const { StatecoreClass, STATECORE_EVENT__STATE_CHANGE } = require('statecore');

class UserStore extends StatecoreClass {
  constructor() {
    super({ users: [], loading: false, error: null });
  }

  async loadUsers() {
    this.statecoreSetState({ 
      ...this.statecoreGetState(), 
      loading: true, 
      error: null 
    });
    
    try {
      const users = await fetchUsers();
      this.statecoreSetState({ 
        users, 
        loading: false, 
        error: null 
      });
    } catch (error) {
      this.statecoreSetState({ 
        ...this.statecoreGetState(),
        loading: false, 
        error: error.message 
      });
    }
  }

  addUser(user) {
    const currentState = this.statecoreGetState();
    this.statecoreSetState({
      ...currentState,
      users: [...currentState.users, user]
    });
  }
}

const userStore = new UserStore();
userStore.statecoreAddObserver((eventName, newState) => {
  if (eventName === STATECORE_EVENT__STATE_CHANGE) {
    console.log('Users updated:', newState.users);
  }
});
```

### 🏭 Static Instance Management

StateCore provides two overloads for static instance management:

#### `StatecoreClass.statecoreClassStaticGrabInstance(instanceName, initialState?)`
Creates or retrieves a singleton instance by name. Always returns an instance (creates if doesn't exist).

```javascript
// Get or create singleton instance - always returns an instance
const store1 = UserStore.statecoreClassStaticGrabInstance('main', { users: [] });
const store2 = UserStore.statecoreClassStaticGrabInstance('main'); // Same instance as store1

// Different instances for different names
const adminStore = UserStore.statecoreClassStaticGrabInstance('admin');
const guestStore = UserStore.statecoreClassStaticGrabInstance('guest');

console.log(store1 === store2); // true - same instance
console.log(store1 === adminStore); // false - different instances
```

#### `StatecoreClass.statecoreClassStaticGrabInstance(isGrab, instanceName, initialState?)`
Advanced instance management with conditional creation.

```javascript
// Check if instance exists without creating (isGrab = false)
const existing = UserStore.statecoreClassStaticGrabInstance(false, 'main');
console.log('Instance exists:', existing !== null);

// Create or get instance (isGrab = true)
const store = UserStore.statecoreClassStaticGrabInstance(true, 'main', { users: [] });

// Later, just check existence again
const check = UserStore.statecoreClassStaticGrabInstance(false, 'main');
console.log('Now exists:', check !== null); // true
```

**Use Cases for Static Instance Management**:

```javascript
// Application-wide stores
class AppStateStore extends StatecoreClass {
  static getGlobalInstance() {
    return this.statecoreClassStaticGrabInstance('global', {
      user: null,
      theme: 'light',
      notifications: []
    });
  }
}

// Multi-tenant applications
class TenantStore extends StatecoreClass {
  static getForTenant(tenantId) {
    return this.statecoreClassStaticGrabInstance(`tenant-${tenantId}`, {
      tenantId,
      data: {},
      permissions: []
    });
  }
  
  static hasTenantStore(tenantId) {
    return this.statecoreClassStaticGrabInstance(false, `tenant-${tenantId}`) !== null;
  }
}

// Usage
const appStore = AppStateStore.getGlobalInstance();
const tenant1Store = TenantStore.getForTenant('tenant1');
const tenant2Store = TenantStore.getForTenant('tenant2');

console.log(TenantStore.hasTenantStore('tenant1')); // true
console.log(TenantStore.hasTenantStore('tenant3')); // false
```

---

## 🏷️ Built-in Events and Constants

StateCore provides several constants for version checking and event handling:

```javascript
const { 
  STATECORE_VERSION,
  STATECORE_EVENT__STATE_CHANGE,
  STATECORE_EVENT__DESTROY,
  STATECORE_EVENT__OBSERVER_ERROR 
} = require('statecore');

console.log('StateCore version:', STATECORE_VERSION); // "3.0.1"

store.statecoreAddObserver((eventName, ...args) => {
  switch (eventName) {
    case STATECORE_EVENT__STATE_CHANGE:
      console.log('State changed:', args[0], 'from:', args[1]);
      break;
    case STATECORE_EVENT__DESTROY:
      console.log('Store destroyed');
      break;
    case STATECORE_EVENT__OBSERVER_ERROR:
      console.log('Observer error:', args[0]);
      break;
  }
});
```

### Version Checking

```javascript
// Check if you're using a compatible version
const [major, minor, patch] = STATECORE_VERSION.split('.').map(Number);

if (major >= 3) {
  console.log('Using StateCore v3+, all features available');
} else if (major === 2 && minor >= 2) {
  console.log('Using StateCore v2.2+, most features available');
} else {
  console.warn('Consider upgrading StateCore for latest features');
}
```

---

## 🛡️ Error Handling

StateCore gracefully handles observer errors without breaking the application:

```javascript
store.statecoreAddObserver(() => {
  throw new Error('Broken observer');
});

store.statecoreAddObserver((eventName, newState) => {
  console.log('This still works:', newState);
});

// Both observers are called, error is logged but doesn't stop execution
store.statecoreSetState({ value: 123 });
```

Observer errors trigger `STATECORE_EVENT__OBSERVER_ERROR` events:

```javascript
store.statecoreAddObserver((eventName, error, originalArgs) => {
  if (eventName === STATECORE_EVENT__OBSERVER_ERROR) {
    console.error('Observer failed:', error.message);
    // Handle error reporting, logging, etc.
  }
});
```

---

## 📝 TypeScript Support

StateCore includes comprehensive TypeScript definitions:

```typescript
import { 
  createStatecore, 
  StatecoreClass,
  StatecoreObserver,
  Statecore
} from 'statecore';

interface AppState {
  user: { id: number; name: string } | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

const store: Statecore = createStatecore<AppState>({
  user: null,
  isAuthenticated: false,
  theme: 'light'
});

const observer: StatecoreObserver = (eventName, newState: AppState, oldState: AppState) => {
  console.log('State changed:', { eventName, newState, oldState });
};

store.statecoreAddObserver(observer);

// Type-safe state updates
store.statecoreSetState({
  user: { id: 1, name: 'John Doe' },
  isAuthenticated: true,
  theme: 'dark'
});
```

### TypeScript Class Usage

```typescript
class UserStore extends StatecoreClass {
  constructor() {
    super({ users: [], loading: false } as UserState);
  }

  getUsers(): User[] {
    return this.statecoreGetState().users;
  }

  async loadUsers(): Promise<void> {
    this.statecoreSetState({ ...this.statecoreGetState(), loading: true });
    // ... implementation
  }

  // Type-safe static instance management
  static getGlobalStore(): UserStore {
    return this.statecoreClassStaticGrabInstance('global', { users: [], loading: false });
  }

  static hasGlobalStore(): boolean {
    return this.statecoreClassStaticGrabInstance(false, 'global') !== null;
  }
}

interface UserState {
  users: User[];
  loading: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}
```

---

## 🌐 Environment Support

StateCore works seamlessly across different JavaScript environments:

### Browser (Global)
```html
<script src="statecore.js"></script>
<script>
  const store = window.statecore.createStatecore({ count: 0 });
</script>
```

### ES Modules
```javascript
import { createStatecore } from 'statecore';
const store = createStatecore({ count: 0 });
```

### CommonJS (Node.js)
```javascript
const { createStatecore } = require('statecore');
const store = createStatecore({ count: 0 });
```

### AMD (RequireJS)
```javascript
define(['statecore'], function(statecore) {
  const store = statecore.createStatecore({ count: 0 });
});
```

---

## ✅ Best Practices

### 1. Always Clean Up Observers
```javascript
const unsubscribe = store.statecoreAddObserver(observer);

// In React useEffect cleanup
useEffect(() => {
  const unsubscribe = store.statecoreAddObserver(observer);
  return unsubscribe; // Cleanup on unmount
}, []);

// In Vue beforeDestroy
beforeDestroy() {
  this.unsubscribe();
}
```

### 2. Use Immutable State Updates
```javascript
// ✅ Good: Create new state object
store.statecoreSetState({ 
  ...store.statecoreGetState(), 
  newProperty: 'value',
  nested: { ...store.statecoreGetState().nested, updated: true }
});

// ❌ Avoid: Mutating existing state
const state = store.statecoreGetState();
state.newProperty = 'value'; // Don't do this
store.statecoreSetState(state);
```

### 3. Check Destruction Before Operations
```javascript
class SafeStore extends StatecoreClass {
  updateState(newData) {
    if (!this.statecoreIsDestroyed()) {
      this.statecoreSetState({ ...this.statecoreGetState(), ...newData });
    }
  }
}
```

### 4. Use Static Instance Management Wisely
```javascript
class ConfigStore extends StatecoreClass {
  // Always ensure instance exists
  static getInstance() {
    return this.statecoreClassStaticGrabInstance('config', { 
      apiUrl: 'https://api.example.com',
      timeout: 5000 
    });
  }
  
  // Check before accessing
  static hasInstance() {
    return this.statecoreClassStaticGrabInstance(false, 'config') !== null;
  }
  
  // Environment-specific instances
  static getForEnv(env) {
    return this.statecoreClassStaticGrabInstance(`config-${env}`, {
      apiUrl: env === 'production' ? 'https://api.prod.com' : 'https://api.dev.com'
    });
  }
}

// Usage
const config = ConfigStore.getInstance();
const prodConfig = ConfigStore.getForEnv('production');
const devConfig = ConfigStore.getForEnv('development');
```

### 5. Handle Observer Errors Gracefully
```javascript
store.statecoreAddObserver((eventName, error, originalArgs) => {
  if (eventName === STATECORE_EVENT__OBSERVER_ERROR) {
    // Log to monitoring service
    console.error('StateCore observer error:', error);
    // Continue app operation
  }
});
```

### 6. Use Descriptive Event Names
```javascript
store.statecoreNotifyAllObservers('USER_LOGIN_SUCCESS', user);
store.statecoreNotifyAllObservers('NETWORK_ERROR', error);
store.statecoreNotifyAllObservers('DATA_SYNC_COMPLETE', syncResult);
```

### 7. Version-aware Development
```javascript
// Check version compatibility in your application
const { STATECORE_VERSION } = require('statecore');

function checkCompatibility() {
  const [major] = STATECORE_VERSION.split('.').map(Number);
  if (major < 3) {
    console.warn('This application requires StateCore v3.0+');
    return false;
  }
  return true;
}

if (checkCompatibility()) {
  // Initialize your stores
}
```

---

## 🧪 Testing

Run the test suite:

```bash
# Run tests
node test.js

# Or if you have npm scripts set up
npm test
```

### Testing Your StateCore Integration

```javascript
// test-example.js
const assert = require('assert');
const { createStatecore, StatecoreClass, STATECORE_EVENT__STATE_CHANGE } = require('statecore');

function testStateCore() {
  const store = createStatecore({ count: 0 });
  
  let observerCalled = false;
  let receivedState = null;
  
  const unsubscribe = store.statecoreAddObserver((eventName, newState) => {
    if (eventName === STATECORE_EVENT__STATE_CHANGE) {
      observerCalled = true;
      receivedState = newState;
    }
  });
  
  store.statecoreSetState({ count: 1 });
  
  assert.equal(observerCalled, true);
  assert.deepEqual(receivedState, { count: 1 });
  
  unsubscribe();
  store.statecoreDestroy();
  
  console.log('✅ All tests passed!');
}

function testStaticInstances() {
  class TestStore extends StatecoreClass {}
  
  // Test instance creation
  const store1 = TestStore.statecoreClassStaticGrabInstance('test');
  const store2 = TestStore.statecoreClassStaticGrabInstance('test');
  
  assert.equal(store1 === store2, true, 'Should return same instance');
  
  // Test conditional creation
  const nonExistent = TestStore.statecoreClassStaticGrabInstance(false, 'nonexistent');
  assert.equal(nonExistent, null, 'Should return null for non-existent instance');
  
  console.log('✅ Static instance tests passed!');
}

testStateCore();
testStaticInstances();
```

---

## 🔧 Advanced Usage Patterns

### Middleware Pattern
```javascript
class MiddlewareStore extends StatecoreClass {
  constructor() {
    super({ data: null });
    this.middleware = [];
  }

  addMiddleware(fn) {
    this.middleware.push(fn);
  }

  setState(newState) {
    let processedState = newState;
    
    // Apply middleware
    for (const middleware of this.middleware) {
      processedState = middleware(processedState, this.statecoreGetState());
    }
    
    this.statecoreSetState(processedState);
  }
}

// Usage
const store = new MiddlewareStore();
store.addMiddleware((newState, oldState) => {
  console.log('Middleware: state changing from', oldState, 'to', newState);
  return newState;
});
```

### Computed Properties Pattern
```javascript
class ComputedStore extends StatecoreClass {
  constructor() {
    super({ 
      users: [],
      filter: 'all' 
    });
  }

  get filteredUsers() {
    const { users, filter } = this.statecoreGetState();
    if (filter === 'active') return users.filter(u => u.active);
    if (filter === 'inactive') return users.filter(u => !u.active);
    return users;
  }

  get userCount() {
    return this.filteredUsers.length;
  }
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Clone the repository
2. Run tests: `node test.js`
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 👤 Author

**MrZenW**
- Website: [MrZenW.com](https://MrZenW.com)
- Email: [MrZenW@gmail.com](mailto:MrZenW@gmail.com)
- GitHub: [github.com/MrZenW](https://github.com/MrZenW)

---

## 🙏 Acknowledgments

Thanks to all contributors and users who have helped make StateCore better!
