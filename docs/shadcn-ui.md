# shadcn/ui Documentation

This project uses [shadcn/ui](https://ui.shadcn.com) - a collection of reusable components built on top of Radix UI and Tailwind CSS.

## 📦 Adding New Components

To add a new shadcn/ui component to the project, use the following command:

```bash
npx shadcn-ui add [component-name]
```

### Examples

```bash
# Add individual components
npx shadcn-ui add button
npx shadcn-ui add card  
npx shadcn-ui add dialog
npx shadcn-ui add dropdown-menu

# Add multiple components at once
npx shadcn-ui add button card dialog
```

### Available Components

Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) to see all available components.

### Currently Installed Components

The following components are already available in this project:
- `alert`
- `avatar` 
- `button`
- `card`
- `dialog`
- `dropdown-menu`
- `hover-card`
- `input`
- `label`
- `navigation-menu`
- `popover`
- `separator`
- `sheet`
- `textarea`
- `toast`
- `toaster`

## 🌙 Dark Mode Toggle Pattern

This project includes a complete dark mode implementation with system preference detection.

### Theme Provider Setup

The app is wrapped with a `ThemeProvider` that supports three modes:
- `light` - Light theme
- `dark` - Dark theme  
- `system` - Follows system preference

```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="caspian-ui-theme">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using the Theme Toggle Component

Import and use the `ThemeToggle` component:

```tsx
import { ThemeToggle } from './components/ThemeToggle';

function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1>My App</h1>
      <ThemeToggle />
    </div>
  );
}
```

### Accessing Theme in Components

Use the `useTheme` hook to access and control the theme:

```tsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### Theme-Aware Styling

Components automatically respond to theme changes through CSS classes:

```tsx
// The theme provider automatically adds 'dark' or 'light' class to html element
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content that adapts to theme
</div>
```

## 📥 Import Conventions

### UI Components

Import UI components from the centralized index file:

```tsx
// ✅ Preferred - Import from index
import { Button, Card, Dialog } from '@/components/ui';

// ✅ Alternative - Direct imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### Path Aliases

The project uses the following path aliases (configured in `components.json`):

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/lib/utils`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`

### Examples

```tsx
// Import UI components
import { Button, Card, CardContent } from '@/components/ui';

// Import utilities
import { cn } from '@/lib/utils';

// Import custom components
import { ThemeToggle } from '@/components/ThemeToggle';

// Import hooks
import { useTheme } from '@/context/ThemeContext';

function ExampleComponent() {
  return (
    <Card className={cn("p-4", "hover:shadow-lg")}>
      <CardContent>
        <Button variant="outline">
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🔧 Configuration

The shadcn/ui configuration is stored in `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/style.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## 📚 Additional Resources

- **Official Documentation**: [ui.shadcn.com](https://ui.shadcn.com)
- **Component Gallery**: [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- **Examples**: [ui.shadcn.com/examples](https://ui.shadcn.com/examples)
- **GitHub Repository**: [github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- **Themes**: [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
- **Color Customization**: [ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)

## ⚡ Quick Start Checklist

1. **Add a new component**: `npx shadcn-ui add [component-name]`
2. **Import the component**: `import { ComponentName } from '@/components/ui';`
3. **Use in your JSX**: `<ComponentName />`
4. **Apply dark mode styles**: Use `dark:` prefix in Tailwind classes
5. **Check the documentation**: Visit [ui.shadcn.com](https://ui.shadcn.com) for component APIs

---

For questions or issues with shadcn/ui components, refer to the [official documentation](https://ui.shadcn.com) or check the component source files in `src/components/ui/`.
