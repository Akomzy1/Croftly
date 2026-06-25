# /lib/fulfilment — collection + courier orchestration

The platform **orchestrates** logistics; it never owns or employs a fleet (CLAUDE.md rule 2).

- **Collection** (free): household picks a `collection_point` in their area. £0 delivery.
- **Courier delivery**: `matchCourier.ts` — a deterministic, MOCKED courier-match for the
  prototype. Filters viable couriers by the box's cold-chain class (the most perishable item
  sets the class) and returns the cheapest viable mock courier (name, fee, ETA). No LLM.

`// PRODUCTION:` the mock is replaced by a real aggregator (EasyPost/Sendcloud) for ambient +
an on-demand API (Uber Direct/Stuart) for chilled. The platform owns the delivery promise and
shows order status/tracking regardless of who carries the box. Built in Prompt 8.
