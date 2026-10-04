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

# Architecture rules
- Roles live in `user_roles` checked via `has_role()`; first signup becomes admin — prevents privilege escalation.
- Portal/admin data reads go through the browser client with RLS — access is enforced in the database.
- AI chat streams from `/api/chat` server route via the AI gateway — keeps the key server-side.
