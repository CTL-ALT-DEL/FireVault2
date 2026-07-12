# FireVault Build 0.76.1

Accounts Quick Access and Navigation Hardening.

- Remembers Accounts search, filter, sorting, and scroll position for the current app session.
- Adds an inline Favorite star to each account card without opening Account Detail.
- Shows when an account was last opened.
- Enter opens the first visible search result; Escape clears search; Arrow Down focuses the first result.
- Adds a visible Reset control whenever the Accounts view is filtered or sorted.
- Records account recency only when entering Account Detail, not on every tab render.
- Permanently preserves structural app classes during saves, preventing the bottom navigation from disappearing after Favorite changes or other account updates.
- Keeps Settings-only chrome limited to the Settings route.
- Preserves the existing FireVault vault key and all account data.
