import type { OrderStatus } from "@/lib/supabase/types";

// Map an on-demand courier's job/delivery status onto Croftly's order_status enum.
// Covers both Uber Direct (lead) and Stuart (fallback) status vocabularies so the
// webhook + tracking work regardless of which provider carried the leg. Unknown
// statuses fall back to "confirmed".
const STATUS_MAP: Record<string, OrderStatus> = {
  // --- shared / scheduled ---
  new: "confirmed",
  scheduled: "confirmed",
  pending: "confirmed",
  // --- heading to / at pickup ---
  pickup: "preparing", // Uber: courier en route to pickup
  picking: "preparing", // Stuart
  almost_picking: "preparing",
  waiting_at_pickup: "preparing",
  in_progress: "preparing",
  // --- picked up / en route to dropoff ---
  pickup_complete: "out_for_delivery", // Uber
  dropoff: "out_for_delivery", // Uber
  delivering: "out_for_delivery", // Stuart
  almost_delivering: "out_for_delivery",
  waiting_at_dropoff: "out_for_delivery",
  // --- done ---
  delivered: "delivered",
  finished: "delivered",
  // --- terminal-negative ---
  cancelled: "cancelled",
  canceled: "cancelled",
  returned: "cancelled",
  expired: "cancelled",
  failed: "cancelled",
};

export function mapCourierStatus(status: string): OrderStatus {
  return STATUS_MAP[status] ?? "confirmed";
}
