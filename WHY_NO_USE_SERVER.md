# ~~Why We Don't Use `'use server'`~~ → WE NOW DO! 🎉

**UPDATE:** This project now uses TRUE React Server Components with `vite-plugin-react-server`!

See `RSC_IMPLEMENTATION.md` for the full implementation details.

---

# Original Document (Historical Context)

## The Short Answer

`'use server'` and `'use client'` directives **require a special bundler/framework** that understands React Server Components (RSC). This project uses traditional SSR with Vite, which doesn't support RSC.

## What Would Happen If We Added `'use server'`?

```tsx
// src/demos/ServerComponentsDemo.tsx

'use server'  // ❌ This would be IGNORED by Vite

async function submitOrder(formData: { product: string; quantity: number }) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, orderId: 'abc123' };
}
```

**Result:** Nothing would change. Vite would:
1. Treat it as a regular string (not a directive)
2. Bundle this function into the client JavaScript
3. Execute it in the browser, not on the server

## What `'use server'` Actually Does (in Next.js)

When you use `'use server'` in Next.js App Router:

```tsx
// app/actions.ts (Next.js)
'use server'

export async function submitOrder(formData: FormData) {
  // This code ONLY runs on the server
  const db = await connectToDatabase() // ✅ Safe to use secrets
  await db.orders.create({
    product: formData.get('product'),
    userId: await getServerSession()  // ✅ Server-only auth
  })
  return { success: true }
}
```

Next.js's bundler:
1. **Removes this code** from the client bundle
2. **Creates an API endpoint** (e.g., `/api/actions/submitOrder`)
3. **Generates a client stub** that calls this endpoint
4. **Serializes** arguments and return values automatically

## Current Project Architecture

### What We Have (Traditional SSR):

```
┌─────────────────────────────────────────────────┐
│ 1. SERVER (Node.js)                             │
│    - Runs all components once                   │
│    - Generates HTML                             │
│    - Sends HTML to browser                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. BROWSER                                      │
│    - Receives HTML (visible immediately)        │
│    - Downloads JavaScript bundle (ALL code)     │
│    - Runs all components again (hydration)      │
│    - Components become interactive              │
└─────────────────────────────────────────────────┘
```

**Problem:** All code ships to the browser, including:
- `submitOrder()` function
- `fetchServerData()` function
- Everything else

### What True RSC Would Look Like:

```
┌─────────────────────────────────────────────────┐
│ SERVER COMPONENTS (server-only)                 │
│    - Run ONLY on server                         │
│    - NOT in client bundle                       │
│    - Can use databases, secrets, filesystem     │
│                                                  │
│ SERVER ACTIONS ('use server')                   │
│    - Functions that run ONLY on server          │
│    - Client gets auto-generated API endpoints   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ CLIENT COMPONENTS ('use client')                │
│    - Interactive components                     │
│    - Sent to browser                            │
│    - Can call Server Actions                    │
└─────────────────────────────────────────────────┘
```

## How to Actually Use RSC

### Option 1: Use Next.js App Router

```bash
npx create-next-app@latest my-rsc-app
cd my-rsc-app
```

Then you can write:

```tsx
// app/page.tsx (Server Component by default)
import { db } from '@/lib/database'

export default async function ProductsPage() {
  // ✅ This runs ONLY on server
  const products = await db.products.findMany()

  return <ProductList products={products} />
}
```

```tsx
// app/actions.ts
'use server'

export async function createOrder(formData: FormData) {
  // ✅ This runs ONLY on server
  const order = await db.orders.create({...})
  return order
}
```

```tsx
// components/OrderForm.tsx
'use client'

import { createOrder } from '@/app/actions'

export function OrderForm() {
  return (
    <form action={createOrder}>
      {/* Form automatically calls server action */}
    </form>
  )
}
```

### Option 2: Build Custom RSC Setup

You would need to implement:
1. **Bundler plugin** that:
   - Detects `'use server'` and `'use client'` directives
   - Splits code into server/client bundles
   - Generates API endpoints for Server Actions
   - Creates client stubs

2. **Server runtime** that:
   - Executes Server Components
   - Handles Server Action requests
   - Streams RSC payload to client

3. **Client runtime** that:
   - Understands RSC payload format
   - Renders Server Component output
   - Manages Client Components

This is extremely complex - that's why frameworks like Next.js exist!

## Why This Demo Is Still Useful

Even without true RSC, this demo teaches:
1. ✅ The **mental model** of Server vs Client Components
2. ✅ When you'd use `'use server'` vs `'use client'`
3. ✅ The **benefits** of running code only on server
4. ✅ How **component composition** works in RSC
5. ✅ The **difference** between SSR and RSC

When you move to Next.js, you'll understand exactly why and how to use these features!

## Summary

| Feature | This Project (Vite SSR) | Next.js App Router |
|---------|------------------------|-------------------|
| `'use server'` | ❌ Ignored, no effect | ✅ Works, creates server-only functions |
| `'use client'` | ❌ Ignored, no effect | ✅ Works, marks client components |
| Server Components | ❌ All components are universal | ✅ Default, run only on server |
| SSR | ✅ Yes (renderToString) | ✅ Yes (plus RSC) |
| Hydration | ✅ Yes | ✅ Yes |
| Code splitting (server/client) | ❌ No, all code goes to client | ✅ Yes, automatic |

**Bottom line:** We don't use `'use server'` because Vite doesn't know what to do with it. It would be ignored and have no effect. To actually use RSC features, you need Next.js or a similar RSC-enabled framework.
