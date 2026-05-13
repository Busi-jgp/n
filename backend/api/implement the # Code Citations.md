implement the # Code Citations

## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```


## License: unknown
https://github.com/EduardNovik/movieTone/blob/d6c5e8db64a47850afc754d937cfd8379aa2ceca/be/README.md

```
Perfect. I now have a complete audit. Here's my analysis and fix plan:

## AUDIT FINDINGS

### ✅ CLEAN (Web-Only)
- **Root `/src/`** - Pure React with Vite (main.tsx, App.tsx) - GOOD
- **Root `/index.html`** - Clean HTML5 entry - GOOD
- **`vite.config.ts`** - Correct Vite + React setup - GOOD
- **`/shared/api-zod/`** - Pure TypeScript API schemas - GOOD
- **`/shared/api-client-react/`** - Pure TypeScript API client - GOOD

### ❌ EXPO/REACT NATIVE CODE (Must Remove)
**Location: `/frontend/app/`** (entirely)
- `SafetyMap.native.tsx` - Direct Expo imports (@expo/vector-icons, expo-haptics, expo-location, react-native-maps)
- `SafetyMap.web.tsx` - React Native imports (ScrollView, Platform from react-native)
- `SafetyMap.tsx` - React Native Platform module
- `KeyboardAwareScrollViewCompat.tsx` - react-native-keyboard-controller
- `utils/messaging.ts` - expo-sms module
- `context/AppContext.tsx` - @react-native-async-storage/async-storage
- `static-build/` folder - Android/iOS build artifacts
- `components/ErrorBoundary.tsx`, `IncidentCard.tsx`, `ContactPickerModal.tsx` - Likely React Native components

### ⚠️ CONFIG ISSUES
1. **tsconfig references** are tangled - frontend/app is referenced but not actually used by the web build
2. **vite.config.ts paths** include frontend/app which should be removed
3. **.gitignore** still references .expo, .expo-shared artifacts
4. **package.json workspaces** includes frontend/app which won't be used

---

## FIX PLAN (Precise Actions)

### STEP 1: DELETE THESE DIRECTORIES
```
frontend/app/           (entire Expo app directory)
  - components/
  - context/
  - hooks/
  - utils/
  - data/
  - constants/
  - assets/
  - static-build/       (Android/iOS builds)
  - node_modules/
  - package.json
  - tsconfig.json
  - .gitignore
```

### STEP 2: MODIFY THESE FILES

**[ROOT] `package.json`** - Remove frontend/app from workspaces
```diff
  "workspaces": [
    "backend/*",
-   "frontend/api-client-react",
+   "frontend/api-client-react"
  ],
```

**[ROOT] `vite.config.ts`** - Remove frontend/app references
```diff
- "@workspace/api-client-react": path.resolve(__dirname, "./frontend/api-client-react/src"),
```

**[ROOT] `tsconfig.base.json`** - Simplify paths
```diff
  "paths": {
    "@/*": ["./src/*"],
-   "@workspace/api-client-react": ["./frontend/api-client-react/src"],
    "@workspace/api-zod": ["./shared/api-zod/src"]
  }
```

**[ROOT] `tsconfig.json`** - Remove frontend/app reference
```diff
  "references": [
-   {
-     "path": "./frontend/api-client-react"
-   },
    {
      "path": "./shared/api-zod"
    }
  ]
```

**[ROOT] `.gitignore`** - Remove Expo artifacts
```diff
- .expo
- .expo-shared
  build/
- # Expo/React Native
- static-build/
```

**[FRONTEND] `frontend/api-client-react/package.json`** - If it has Expo dependencies, remove them (verify current state)

---

## CORRECTED CONFIG FILES

### vite.config.ts (CORRECTED)
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const port = Number(process.env.PORT ?? 5173);

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@workspace/api-zod": path.resolve(__dirname, "./shared/api-zod/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: "terser",
  },
  server: {
    port,
    host: true,
    strictPort: false,
  },
});
```

### tsconfig.base.json (CORRECTED)
```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": false,
    "noImplicitReturns": true,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": false,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "skipLibCheck": true,
    "target": "es2022",
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "customConditions": ["workspace"],
    "paths": {
      "@/*": ["./src/*"],
      "@workspace/api-zod": ["./shared/api-zod/src"]
    }
  }
}
```

### tsconfig.json (CORRECTED)
```json
{
  "extends": "./tsconfig.base.json",
  "compileOnSave": false,
  "files": [],
  "references": [
    {
      "path": "./shared/api-zod"
    }
  ]
}
```

### tsconfig.web.json (KEEP BUT SIMPLIFY)
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict
```

