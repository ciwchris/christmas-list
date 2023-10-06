# create-svelte

## Scafolding the DB

First make sure you are logged in:

```bash
npx supabase login
```

Then update  the types

```bash
npm run update-types
```

## References

- [Use TypeScript with SvelteKit and Supabase](https://blog.robino.dev/posts/supabase-sveltekit)
- Optional: [Sync db](https://supabase.com/docs/guides/getting-started/tutorials/with-svelte)
- [Tailwind](https://tailwindcss.com/docs/guides/sveltekit)
- [DaisyUI](https://daisyui.com/docs/install/)

## Pull database schema

This requires docker.

```
npx supabase link --project-ref <project-ref>
npx supabase pull
```

Supabase only allows 2 login attempts before they block an IP for 30 minutes. To unblock immediately run:

```
npx supabase network-bans get --project-ref <project-ref> --experimental
npx supabase network-bans remove --db-unban-ip <ip-address> --project-ref <project-ref> --experimental
```

## Development builds

```bash
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
