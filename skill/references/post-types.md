# Post Types — Templates & Examples

Detailed per-type guidance. Use alongside `story-arcs.md`, `content-mix.md`, and the active user's `persona.md`.

---

## Personal (30%)

**What it's for:** Humanizing the author. Building the relationship with the reader that makes every other post type land harder.

**Length target:** 80–300 words. Personal can be very short.

**Default arc:** Classic or Quiet Reveal.

**Must have:**
- A specific scene, moment, or relationship.
- At least one detail that couldn't have been written by someone else.
- A turn — something changed, was learned, or was seen differently.

**Must not have:**
- Generic "life lessons."
- Performative vulnerability ("I cried in the boardroom today" when nothing in the story warrants that).
- A forced business takeaway. Personal posts don't need to tie back to work.

### Template A — Quiet Reveal (for reflective personal stories)

```
[Scene — 2 sentences]
[Detail — 2 sentences]
[Detail that seemed ordinary — 1 sentence]
[Turn — 1 sentence]
[Landing — 2 sentences]
```

### Template B — Classic (for stories with stakes)

```
[Hook — a moment with weight]
[Context — the situation]
[What happened — the insight or pivot]
[Resolution]
[Close — often no tidy moral]
```

### Example shape (Classic, 180 words)

> My dad taught me to drive on a 1987 Toyota Corolla with a manual transmission.
>
> I was 17. He didn't like teaching. He'd been a flight instructor in the Indian Air Force in the 70s and he had strong opinions about how to learn a machine.
>
> The first hour was brutal. I stalled eleven times. Somewhere around attempt nine, I started apologizing every time the engine choked. He interrupted me on the tenth.
>
> "Stop saying sorry. Nothing's wrong with the car. Nothing's wrong with you. The car is telling you something. Listen to it."
>
> I drove home from dinner last night. Automatic transmission, Bluetooth audio, carplay directions. I couldn't have stalled if I tried.
>
> I've been thinking all week about what he said. Half of my job now is building systems that talk to the person using them. My dad would have said: listen to what the car is telling you.
>
> I think he'd have liked the work.

---

## Work (25%)

**What it's for:** Building credibility by showing what the author actually does. The opposite of claiming expertise — demonstrating it.

**Length target:** 200–350 words.

**Default arc:** Classic.

**Must have:**
- A specific thing that was built, tried, decided, fixed, or shipped.
- The problem that made the work necessary.
- Enough detail that another practitioner could learn from it.

**Must not have:**
- Vague "we're innovating in [space]" claims.
- A launch announcement dressed as a work post (that's Promotional).
- Credit-hogging. If a team shipped it, say so.

### Template

```
[Hook — the moment of stakes, a number, or a before-state]
[Context — what the problem was, why it was hard]
[The work — what was actually done, with specifics]
[Resolution — what changed, what broke, what held]
[Close — what was learned, what's next]
[Hashtags — 2–3, relevant]
```

### Example shape (220 words)

> Three months ago, our workflow canvas had a rendering bug. Users with 40+ nodes saw a ~800ms freeze when dragging.
>
> The naive fix was to throttle the drag events. We tried it. It worked for 40 nodes, broke at 80. Then 80 became 150.
>
> What actually fixed it: stop re-rendering the edges on every drag frame.
>
> Our previous implementation recomputed every Bézier curve on every mouseMove event. With 150 nodes and ~250 edges, that's a lot of math per frame. The trick was realizing only the edges attached to the dragging node actually need to recompute. The other 240 edges haven't moved.
>
> We split the edge render into two layers: "moving edges" (recomputed per frame) and "static edges" (rendered once, transformed only when zoom changes). Dropped re-render time by 94%.
>
> The lesson isn't "cache things." It was that we'd been thinking about the problem at the wrong granularity. The whole canvas didn't need to re-render. A small subset did.
>
> Most performance work is like this. You don't need to be clever about the common case — you need to find the thing you're repeatedly doing that you didn't have to do at all.
>
> #FrontendEngineering #ReactFlow #PushEngage

---

## Thought-leadership (20%)

**What it's for:** Advancing a point of view. Taking a position.

**Length target:** 200–400 words.

**Default arc:** Frame-Break.

**Must have:**
- A clear claim, stated early.
- Evidence the author has actually seen (experience, data, specific observation).
- Willingness to concede — "I could be wrong about this if..."

**Must not have:**
- Contrarianism for its own sake (see Outlaw shadow side).
- Unfalsifiable claims ("culture is everything" — what would disprove this?).
- Punching at specific named competitors or people.

### Template

```
[Frame — the received wisdom, stated fairly]
[Tension — why the frame is incomplete]
[Evidence — the specific thing the author has seen]
[Reframe — the new lens]
[Concession — what would change the author's mind]
[Close — an invitation to push back]
```

### Example shape (260 words)

> Most push notification strategy advice tells you to optimize for open rate.
>
> I don't think open rate is the right metric for most teams, and I want to explain why.
>
> Push has two jobs. One is to move people into the app (opens). The other is to remind people the product exists and is working for them (ambient recall). Open rate only measures the first job.
>
> We have a B2C customer — media brand, 2M subscribers — whose open rate is ~3%. Industry average is 5–7%. By open-rate logic, their push program is underperforming.
>
> But when we look at their DAU retention curve, subscribers who receive push have 22% higher 30-day retention than those who don't, even when they never tap a notification. The push itself is doing work. It just isn't doing the work that opens measure.
>
> If we optimize this customer for open rate, we have to reduce send frequency. Which will reduce ambient recall. Which will drop retention. Which will lose them money.
>
> The reframe: measure push on *downstream retention*, not opens. Then optimize for the frequency and timing that produces the retention curve you want, even if opens go down.
>
> I could be wrong about this in two ways: (1) a better attribution model might show opens drive the retention, not ambient recall; (2) some products have push programs where opens genuinely are the whole story.
>
> Curious to hear from anyone who's measured this. Especially the cases that contradict it.
>
> #PushNotifications #LifecycleMarketing

---

## Educational (15%)

**What it's for:** Teaching. Pure signal, no performance.

**Length target:** 250–450 words.

**Default arc:** Classic, or Quiet Reveal for concept-first topics.

**Must have:**
- A clearly-scoped "thing" being taught.
- Structure — usually 3–5 numbered or bulleted sub-points.
- A specific before/after — what the reader can do after reading that they couldn't before.

**Must not have:**
- Listicles with no connecting argument. "10 things about X" where the 10 things don't build on each other.
- Oversimplification that will mislead the reader.
- Teaching-to-teach ("Let me walk you through...") — get to the substance.

### Template

```
[Hook — the confusion being cleared up, or the skill being taught]
[Why this matters — 1–2 lines of motivation]
[The teaching — 3–5 sub-points, each with a concrete example]
[Common mistake to avoid]
[Close — next step or further reading]
```

### Example shape (360 words, abbreviated structure only)

> Most first-time managers think their job is to make decisions.
>
> It's not. Your job is to make sure decisions get made, by the right person, at the right level, with enough context.
>
> Here's the distinction, with four cases you'll see in your first month:
>
> 1. **Low-stakes, frequent, within the team's expertise.** Don't make the call. Don't even be in the room. Let the team run it.
>
> 2. **High-stakes, infrequent, within your team's expertise but crosses other teams.** Your job is to surface it to peer teams, not to decide it. The decision should be made in a room with the affected stakeholders.
>
> 3. **High-stakes, requires context only you have.** Make the call. Explain your reasoning. Be willing to change it if someone on the team shows you a better frame.
>
> 4. **High-stakes, nobody has the context yet.** Your job is to *get* the context — not to fake a decision. This is the trap. First-time managers feel pressure to "be decisive." It's almost always better to say "I don't know enough yet. Give me until Friday."
>
> The mistake most first-time managers make is collapsing all four cases into case 3 — making every call themselves. The team learns to wait. The manager becomes a bottleneck. Everything slows down.
>
> Takeaway: next time something lands on your desk, ask "whose decision is this actually?" before you ask "what's the right answer?"
>
> #Management #LeadershipDevelopment

---

## Promotional (10%)

**What it's for:** Directly promoting a product, feature, hire, event, or case study.

**Length target:** 150–300 words.

**Default arc:** Classic — problem, solution, ask.

**Must have:**
- A genuine audience problem, not a product feature dressed as one.
- A specific thing being promoted.
- A clear, low-friction ask.

**Must not have:**
- Generic "we're excited to announce" openers.
- Feature lists without context.
- Begging for engagement.

### Template

```
[Hook — the customer problem, stated in the customer's words]
[Context — why this problem matters, what existed before]
[The thing being promoted — what it is, what it does]
[Proof — a specific result, number, or customer quote]
[The ask — one link or CTA]
[Hashtags]
```

### Example shape (200 words)

> If you've ever set up a push notification drip campaign, you know this pain:
>
> The campaign in tool A. The logic in tool B. The trigger in tool C. And the mental model of how it all connects only lives in your head.
>
> We just shipped PushEngage Workflows — a visual canvas where you design triggers, delays, conditional branches, A/B splits, and exit rules in one place.
>
> Drag a trigger node. Connect it to a delay. Connect that to a decision. Test it. Publish it.
>
> Two things I'm proud of:
>
> One: it handles 50,000-subscriber workflows without lag. Our frontend team rewrote the rendering layer from scratch to get there.
>
> Two: the decision-tree nodes actually use the attributes in your subscriber data. No hand-mapping required.
>
> One of our beta customers moved three separate workflows into Workflows v1 last month and said the mental-overhead reduction was the biggest win. Not the features — the single place.
>
> If you run push campaigns, try it: [link]
>
> Happy to answer questions in the comments.
>
> #MarketingAutomation #PushEngage

---

## Length discipline summary

| Type | Min | Max | Typical |
|---|---|---|---|
| Personal | 80 | 300 | 180 |
| Work | 150 | 400 | 250 |
| Thought-leadership | 200 | 400 | 280 |
| Educational | 250 | 500 | 350 |
| Promotional | 150 | 300 | 200 |

If a draft lands outside the Min–Max window, rewrite before emitting. Length isn't arbitrary — each type's weight needs its typical range to land.
