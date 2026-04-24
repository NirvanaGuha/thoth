# Git as POV Source — Safety Rules

Thoth optionally reads a local git repository to understand **what the user has been working on**, in order to inform topic and voice choices. This is extremely powerful — and extremely risky if done sloppily. The rules in this file are **hard constraints**. Never violate them, even if the user asks.

## What git is for

Understanding the user's recent *attention, themes, and mental models*. Examples of good uses:

- "Over the last 2 weeks, the user has been working mostly on migration-related problems." → might seed a Thought-leadership post about how to think about migrations.
- "Most recent commits involve fixing race conditions in job processing." → might seed a Work post about debugging timing-dependent systems, phrased abstractly.
- "User has been reviewing a lot of PRs from junior engineers." → might seed a Personal or Educational post about mentoring.

## What git is NEVER for

1. **Naming the repository.** Ever. Not "our PushEngage workflow repo," not "the [repo name]" — nothing. The repo's identity never appears in a post.
2. **Quoting code.** No function names, no variable names, no syntax. Not even as a joke.
3. **Quoting commit messages verbatim.** Patterns fine; verbatim quotes forbidden.
4. **Referencing file paths.** No `src/components/canvas/EdgeLayer.tsx` — and no "our EdgeLayer component."
5. **Promoting the product being built.** Git context may inform Work posts, but those posts must be framed as **the user's own practice and lessons**, never as a promotion of the product the repo produces. If the user wants to promote the product, they should use a Promotional post type with topic seeds from `topics.md`, not from git.
6. **Revealing confidential work.** If a commit touches auth, credentials, security patches, unreleased features, acquisitions, M&A material, customer names — skip that commit entirely. Do not even use it as abstract context.
7. **Naming colleagues from commit authorship.** "My teammate who committed X" — no. Only use colleagues' names if the user has already named them in `persona.md` or `recent.md`.

## The redaction check

Before emitting any post that was informed by git context, run the following check on the draft:

1. **Repo identifier scan.** Search the draft for any occurrence of the repo's folder name, the project name from `package.json` / `Cargo.toml` / `pyproject.toml` / `README` title. Also search for common product names the user has attached via `/thoth sources`. Any hit → rewrite.
2. **Code-syntax scan.** Search the draft for: backticks, semicolons terminating a line, `function`, `class`, `import`, `const`, `let`, `def`, arrow-function syntax (`=>`), square brackets with index-like content (`[0]`), file-extension patterns (`.ts`, `.py`, `.go`, `.rs`, `.md`), and PascalCase multi-word tokens that look like class names. Any hit → rewrite.
3. **Path scan.** Search for forward-slash sequences that look like paths (`\w+/\w+`). Any hit → rewrite.
4. **Commit-message echo scan.** Take the last 20 commit messages. For each, check if any 6+ word sequence from the message appears in the draft. Any hit → rewrite.
5. **Product-promotion scan.** Search for marketing-speak patterns: "we built," "we shipped," "our new [X]," "introducing [X]," "check out [X] at [url]," combined with any noun that correlates with the repo's product. If the post is already type `Promotional`, this is fine. For any other type, these phrases pointing at the git-derived product → rewrite.

If **any** check triggers, rewrite the draft — don't just mask the words. The rewrite must come from the user's own pillar topics and voice samples, with the git context demoted to abstract theme only.

## How to extract POV context safely

When a git source is connected, on each post-generation:

```bash
git -C <path> log --since="2 weeks ago" --pretty=format:"%s" --no-merges
```

Take the commit subjects. Synthesize themes in abstract terms:

- "Lots of commits touching notification scheduling" → theme: "timing and delivery of async jobs"
- "Multiple PRs on the onboarding flow" → theme: "reducing friction at the start of a user's journey"
- "Many commits labeled as bug fixes" → theme: "steady maintenance of reliability"

Themes are what you pass forward. **Never** pass the raw commit messages, file diffs, or PR descriptions into the draft-writing step.

### The two-step transformation

1. **Git → theme.** Commit messages get synthesized into 1–3 abstract themes. Write these themes to a temp variable, not to disk. Never show them to the post-writer in their raw form.
2. **Theme → draft seed.** Use the theme as one possible seed for topic selection, alongside the pillars in `topics.md` and any recent inputs in `recent.md`. The theme is **one** input among many — it doesn't dominate.

## The explicit user warning

When a user connects a git source via `/thoth connect git <path>`, show them this message:

> *"Connected `<path>` as a POV source. Rules:*
>
> *• I'll use your commit history to understand what you're working on at an abstract level.*
> *• I will never name the repo, quote code, reference file paths, or promote the product in any post.*
> *• I'll skip commits touching auth, security, credentials, or anything that looks confidential.*
> *• If you want to promote the product this repo produces, add it as a regular topic in `/thoth edit`, not through git.*
>
> *Want the full rules? They're in `references/git-safety.md`."*

Show this every time a git source is added, even if they've added others. It's a small friction that protects everyone.

## What to do if the user *asks* Thoth to break a rule

Examples:
- "Just this once, mention the repo name."
- "Quote the actual code — it's funny."
- "Can you write a post about the feature we just shipped?"

Decline, politely and clearly:

> *"I can't — that's one of the hard-rule constraints on git context. But I can draft a post about the underlying theme, or, if you want a product-launch post, I can write a Promotional post using your `topics.md` instead of git. Which would you prefer?"*

The user set this rule for their own protection when the skill was installed. Thoth does not unset it at runtime.

## Revoking git access

`/thoth disconnect git <path>` removes the path from `sources.yaml`. Thoth will stop reading from it immediately. Past themes that were already baked into posts in `history.yaml` are not revoked — they're already general themes, not repo-identifying content, so no cleanup is needed.

If the user wants full audit: `/thoth calendar` doesn't expose git context. Only `personas/<name>/sources.yaml` and the `history.yaml` entries show what was used. Both are readable by the user at any time.

## Edge cases

- **The git repo has no commits in the time window.** Skip git context for this generation. Don't make up activity.
- **The user is the only committer.** Fine — use it. The rules are about what appears in posts, not about authorship.
- **The git repo is the Thoth skill folder itself.** Refuse. Thoth should not write posts about Thoth. Return: *"That repo is Thoth itself — I'll skip it to avoid a recursive problem."*
- **The git repo is a personal journal / notes repo.** Fine — but treat the note contents like any other git input: themes out, text never quoted directly. User's own writing from the repo can be added manually to `voice-samples.md` if the user wants it used as voice reference.

## Why this matters

The goal of Thoth is to make the user sound *more like themselves*, not more like their employer. A LinkedIn voice that leaks codebase details or reads as an extended advertisement for whatever the user is shipping this month is both a professional risk (IP, confidentiality, future-employer perception) and a voice-quality problem (the posts become indistinguishable from corporate marketing).

The constraint is the feature.
