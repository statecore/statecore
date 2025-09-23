# Changelog

All notable changes to StateCore will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2025-09-23

### Added
- **New constant `STATECORE_VERSION`** - Runtime version checking capability
  ```javascript
  const { STATECORE_VERSION } = require('statecore');
  console.log('StateCore version:', STATECORE_VERSION); // "3.0.1"
  ```
- **Enhanced TypeScript definitions** with comprehensive type coverage
- **Static instance management overloads** for `StatecoreClass.statecoreClassStaticGrabInstance`
  - Simple signature: `(instanceName, initialState?): StatecoreClass`
  - Advanced signature: `(isGrab, instanceName, initialState?): StatecoreClass | null`
- **Version compatibility checking examples** in documentation
- **Cross-environment usage examples** (Browser, Node.js, AMD, ES Modules)
- **Advanced usage patterns** including middleware and computed properties
- **Comprehensive test coverage** for all new features

### Changed
- **BREAKING**: Renamed lifecycle methods for better clarity and consistency
  - `statecoreDiscard()` → `statecoreDestroy()`
  - `statecoreIsDiscarded()` → `statecoreIsDestroyed()`
- **BREAKING**: Renamed lifecycle event constant for consistency
  - `STATECORE_EVENT__DISCARD` → `STATECORE_EVENT__DESTROY`
  ```javascript
  // Before (v2.x)
  store.statecoreDiscard();
  if (store.statecoreIsDiscarded()) { /* ... */ }
  
  store.statecoreAddObserver((eventName) => {
    if (eventName === STATECORE_EVENT__DISCARD) {
      console.log('Store discarded');
    }
  });
  
  // After (v3.0.1)
  store.statecoreDestroy();
  if (store.statecoreIsDestroyed()) { /* ... */ }
  
  store.statecoreAddObserver((eventName) => {
    if (eventName === STATECORE_EVENT__DESTROY) {
      console.log('Store destroyed');
    }
  });
  ```

### Enhanced
- **Complete documentation overhaul** with detailed API reference
- **Improved error handling** in observer notification system
- **Better TypeScript IntelliSense support** with updated type definitions
- **Enhanced observer lifecycle management** with automatic cleanup
- **Improved static instance management** with conditional creation options
- **Better debugging capabilities** with version-aware logging
- **Cross-platform compatibility** testing and examples

### Improved
- **Observer error resilience** - Errors in one observer don't affect others
- **Memory management** with optimized state copying using `Array.slice()`
- **Performance optimizations** in observer notification loops
- **Code documentation** with comprehensive JSDoc comments
- **Error event system** with `STATECORE_EVENT__OBSERVER_ERROR` support

### Documentation
- **Complete README.md rewrite** with professional formatting
- **Added comprehensive API reference** with practical examples
- **Enhanced TypeScript usage guides** for better developer experience
- **Detailed best practices section** for optimal library usage
- **Added troubleshooting guides** and common patterns
- **Environment-specific installation instructions**
- **Advanced integration examples** for popular frameworks

### Testing
- **Enhanced test suite** with comprehensive coverage
- **Added version compatibility tests** 
- **Static instance management test cases**
- **Error handling test scenarios**
- **Observer lifecycle testing**
- **Cross-environment compatibility tests**

### Developer Experience
- **Better error messages** with more contextual information
- **Improved debugging support** with version information
- **Enhanced IDE support** through better TypeScript definitions
- **Consistent API design** across all methods
- **Clear migration guides** for version upgrades

### Package Management
- **Updated package.json** with latest version and metadata
- **Refreshed package-lock.json** for consistent dependency resolution
- **Maintained zero-dependency philosophy** for minimal footprint
- **Enhanced package metadata** for better discoverability

## [Previous Versions]

### [2.2.6] - Previous Release
- Core state management functionality
- Observer pattern implementation
- Basic TypeScript support
- Class-based API with static instance management
- Error handling in observer notifications
- Basic documentation
- Lifecycle methods: `statecoreDiscard()` and `statecoreIsDiscarded()`
- Lifecycle event: `STATECORE_EVENT__DISCARD`

---

## Migration Guide

### Upgrading from v2.x to v3.0.1

#### Breaking Changes

**1. Lifecycle Method Renaming**: The lifecycle methods have been renamed for better clarity:

```javascript
// v2.x (deprecated)
store.statecoreDiscard();
if (store.statecoreIsDiscarded()) {
  console.log('Store is discarded');
}

// v3.0.1 (new)
store.statecoreDestroy();
if (store.statecoreIsDestroyed()) {
  console.log('Store is destroyed');
}
```

**2. Lifecycle Event Constant Renaming**: The lifecycle event constant has been renamed:

```javascript
// v2.x (deprecated)
const { STATECORE_EVENT__DISCARD } = require('statecore');

store.statecoreAddObserver((eventName) => {
  if (eventName === STATECORE_EVENT__DISCARD) {
    console.log('Store discarded');
  }
});

// v3.0.1 (new)
const { STATECORE_EVENT__DESTROY } = require('statecore');

store.statecoreAddObserver((eventName) => {
  if (eventName === STATECORE_EVENT__DESTROY) {
    console.log('Store destroyed');
  }
});
```

**Migration Steps**:
1. Replace all instances of `statecoreDiscard()` with `statecoreDestroy()`
2. Replace all instances of `statecoreIsDiscarded()` with `statecoreIsDestroyed()`
3. Replace all instances of `STATECORE_EVENT__DISCARD` with `STATECORE_EVENT__DESTROY`
4. Update any TypeScript type references if using custom interfaces

#### New Features Available
- Access to version information via `STATECORE_VERSION`
- Enhanced TypeScript support with improved type definitions
- Better error handling with more detailed error events
- Improved static instance management with conditional creation

#### Recommended Updates
```javascript
// Before (v2.x)
const { createStatecore, STATECORE_EVENT__DISCARD } = require('statecore');
const store = createStatecore({ count: 0 });

store.statecoreAddObserver((eventName) => {
  if (eventName === STATECORE_EVENT__DISCARD) {
    console.log('Store discarded');
  }
});

store.statecoreDiscard(); // OLD METHOD

// After (v3.0.1 - enhanced with version checking)
const { 
  createStatecore, 
  STATECORE_EVENT__DESTROY, 
  STATECORE_VERSION 
} = require('statecore');

console.log('Using StateCore version:', STATECORE_VERSION);
const store = createStatecore({ count: 0 });

store.statecoreAddObserver((eventName) => {
  if (eventName === STATECORE_EVENT__DESTROY) {
    console.log('Store destroyed');
  }
});

store.statecoreDestroy(); // NEW METHOD
```

#### TypeScript Projects
Update your imports and method calls:
```typescript
import { 
  createStatecore, 
  StatecoreClass,
  Statecore,
  STATECORE_VERSION,
  STATECORE_EVENT__DESTROY  // Updated constant name
} from 'statecore';

// Update interface implementations if you have custom ones
interface MyStore extends Statecore {
  // statecoreDiscard(): void;     // OLD
  // statecoreIsDiscarded(): boolean;  // OLD
  statecoreDestroy(): void;        // NEW
  statecoreIsDestroyed(): boolean; // NEW
}
```

#### Automated Migration
You can use find-and-replace to update your codebase:
- Find: `statecoreDiscard()`
- Replace: `statecoreDestroy()`
- Find: `statecoreIsDiscarded()`
- Replace: `statecoreIsDestroyed()`
- Find: `STATECORE_EVENT__DISCARD`
- Replace: `STATECORE_EVENT__DESTROY`

#### Complete Migration Example
```javascript
// v2.x code
const { 
  createStatecore, 
  STATECORE_EVENT__STATE_CHANGE,
  STATECORE_EVENT__DISCARD  // OLD
} = require('statecore');

const store = createStatecore({ data: null });

store.statecoreAddObserver((eventName, ...args) => {
  switch (eventName) {
    case STATECORE_EVENT__STATE_CHANGE:
      console.log('State changed');
      break;
    case STATECORE_EVENT__DISCARD:  // OLD
      console.log('Store discarded');
      break;
  }
});

// Later...
if (!store.statecoreIsDiscarded()) {  // OLD
  store.statecoreSetState({ data: 'new value' });
}
store.statecoreDiscard();  // OLD

// v3.0.1 code
const { 
  createStatecore, 
  STATECORE_EVENT__STATE_CHANGE,
  STATECORE_EVENT__DESTROY,  // NEW
  STATECORE_VERSION
} = require('statecore');

console.log('StateCore version:', STATECORE_VERSION);
const store = createStatecore({ data: null });

store.statecoreAddObserver((eventName, ...args) => {
  switch (eventName) {
    case STATECORE_EVENT__STATE_CHANGE:
      console.log('State changed');
      break;
    case STATECORE_EVENT__DESTROY:  // NEW
      console.log('Store destroyed');
      break;
  }
});

// Later...
if (!store.statecoreIsDestroyed()) {  // NEW
  store.statecoreSetState({ data: 'new value' });
}
store.statecoreDestroy();  // NEW
```

## Support

- **Issues**: [GitHub Issues](https://github.com/MrZenW/statecore/issues)
- **Documentation**: [README.md](./README.md)
- **Email**: [MrZenW@gmail.com](mailto:MrZenW@gmail.com)

## License

MIT License - see [LICENSE](./LICENSE) file for details.