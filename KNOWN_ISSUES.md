# Known Issues

## Nested Component Wrapper Issue

### Problem
Components that have nested child components (parent-child component relationships) do not work correctly when wrapped with CPT wrappers. This appears to be related to how CSS selectors and React Context are set up in PrimeReact.

### Affected Components

The following component pairs are known to have this issue:

1. **Accordion / AccordionTab**
   - `CPTAccordion` with `CPTAccordionTab` children
   - **Workaround**: Use PrimeReact `Accordion` and `AccordionTab` directly

2. **TabView / TabPanel**
   - `CPTTabView` with `CPTTabPanel` children
   - **Workaround**: Use PrimeReact `TabView` and `TabPanel` directly

### Root Cause

PrimeReact components that use parent-child relationships rely on:
- React Context for communication between parent and children
- CSS class selectors that expect direct parent-child relationships
- Component type checking that may not recognize wrapped components

When we wrap these components, the wrapper function component breaks the expected component hierarchy, causing:
- CSS selectors to fail (e.g., `.p-accordion .p-accordion-tab` may not match)
- React Context to not properly propagate
- Component type checking to fail

### Example of the Issue

**Non-Working (CPT Wrapper):**
```tsx
import { CPTAccordion, CPTAccordionTab } from '@cpt-group/cpt-prime-react';

<CPTAccordion>
  <CPTAccordionTab header="Header">
    Content
  </CPTAccordionTab>
</CPTAccordion>
```

**Working (Direct PrimeReact):**
```tsx
import { Accordion, AccordionTab } from 'primereact/accordion';

<Accordion>
  <AccordionTab header="Header">
    Content
  </AccordionTab>
</Accordion>
```

### Potential Solutions (To Be Investigated)

1. **Use React.forwardRef**: May help with component type recognition
2. **Modify CSS Selectors**: Update PrimeReact theme CSS to account for wrapper components
3. **Context Provider Pattern**: Create a custom context provider that bridges the gap
4. **Component Composition**: Instead of wrapping, use a different composition pattern
5. **Direct Export**: For these specific components, export the PrimeReact components directly with CPT names (no wrapper)

### Status

- **Date Identified**: 2025-01-27
- **Priority**: Medium (workaround available - use PrimeReact directly)
- **Status**: Needs investigation and fix

### Related Files

- `src/components/CPTAccordion.tsx`
- `src/components/CPTAccordionTab.tsx`
- `src/components/CPTTabView.tsx`
- `src/components/CPTTabPanel.tsx`

