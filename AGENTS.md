<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The admin UI is the original site's compiled bundle, served unchanged: `/` returns src/original-shell.html and the code lives in public/assets. Why: the user required a pixel-identical UI and no source code was available. The UI calls POST /api/cloud ({action,...}) and POST /api/upload; when those are missing it falls back to its built-in browser-only demo data.

## Change approval

- Before creating, editing, or deleting any project file, state the planned files and the intended change, then wait for an explicit approval in the current conversation.
- Reading files, searching, and inspecting git status do not need that approval.
- A git commit still needs its own summary and a separate explicit approval. A push, pull request, merge, or other GitHub-side change needs yet another explicit approval. The phrase `同意推送` approves only the previously approved commit.
- Do not rewrite published history, force-push, or push `main` directly.
