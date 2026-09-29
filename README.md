# KailieFitness

Landing page for KailieFitness digital training programs.

**Live:** https://rajgopalpandilwar.github.io/kailiefitness/
**Repo:** https://github.com/RajgopalPandilwar/kailiefitness

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The page. Markup + all CSS inline. |
| `config.js` | **The only file you edit.** Payment links, prices, support email. |
| `checkout.js` | Wires every `Buy Now` button to its link. Handles nav, FAQ, toast. |
| `thank-you.html` | Post-payment page buyers land on. |

No build step, no dependencies, no server. Push a change and it's live in ~30s.

## Go live in 5 minutes

1. **Create a free Razorpay account** — <https://razorpay.com>. India-only KYC,
   no monthly fee, ~2% per transaction. Handles UPI, cards and netbanking.
2. **Create a payment link per program** — Razorpay dashboard →
   *Payments → Payment Links → Create Link*. Set the amount, description and
   "What happens after payment" → redirect to `thank-you.html`.
3. **Paste the links into `config.js`** — one URL per program.
4. **Set `READY: true`** in `config.js`.
5. **Push** — `git add -A && git commit -m "live" && git push`.
6. **Put the download on `thank-you.html`** — replace the dashed
   `OWNER ACTION REQUIRED` box with your real PDF link.

While `READY` is `false`, Buy Now buttons show a "not configured" toast rather
than silently doing nothing, so you never take a payment you can't deliver.

## Editing prices or content

Prices live in two places that must agree: the `price` / `was` fields in
`config.js`, and the `.price__now` / `.price__was` spans in `index.html`. The
bundle's "value" figure is the sum of the four solo prices — currently
2,499 + 3,499 + 1,899 + 2,899 = 10,796, minus 5,999 = **4,797 saved**.

## Hosting

GitHub Pages on the free plan: no bandwidth cap that matters at this scale, no
card required, no expiry. It stays up as long as the repo does.

## Design system

Tokens follow the spec at <https://gitreverse.com/designs/kailiefitness-com>:

- `#CBAD62` gold accent · `#0A0A0A` jet black · `#9CA3AF` muted links
- Bebas Neue headings (96px hero, 60px sections) · Inter body (20px)
- 0px radius everywhere, flat fills, no shadows, gold borders for emphasis
- 4px spacing base unit
