// Croftly database types (Prompt 2).
// Mirrors supabase/migrations/0001_init.sql + 0002_rls.sql.
// Hand-authored (no live DB yet); regenerate with
//   supabase gen types typescript --linked > lib/supabase/types.ts
// once a project is connected, and keep this in sync with the migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---- Enum unions (also exported for app use) ----
export type ColdChainClass = "ambient" | "chilled" | "highly_perishable";
export type Cadence = "weekly" | "fortnightly";
export type Adventurousness = "exact" | "balanced" | "surprise";
export type PriorityPreference =
  | "best_value"
  | "freshest_closest"
  | "support_specific";
export type SubstitutionRule =
  | "never"
  | "within_category"
  | "anything_within_budget";
export type FulfilmentType = "collection" | "courier";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      areas: {
        Row: { id: string; name: string; region: string; created_at: string };
        Insert: { id?: string; name: string; region: string; created_at?: string };
        Update: { id?: string; name?: string; region?: string; created_at?: string };
        Relationships: [];
      };
      collection_points: {
        Row: { id: string; area_id: string; name: string; address: string; created_at: string };
        Insert: { id?: string; area_id: string; name: string; address: string; created_at?: string };
        Update: { id?: string; area_id?: string; name?: string; address?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "collection_points_area_id_fkey"; columns: ["area_id"]; referencedRelation: "areas"; referencedColumns: ["id"] },
        ];
      };
      producers: {
        Row: { id: string; user_id: string | null; name: string; area_id: string | null; story: string | null; bio: string | null; created_at: string };
        Insert: { id?: string; user_id?: string | null; name: string; area_id?: string | null; story?: string | null; bio?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string | null; name?: string; area_id?: string | null; story?: string | null; bio?: string | null; created_at?: string };
        Relationships: [
          { foreignKeyName: "producers_area_id_fkey"; columns: ["area_id"]; referencedRelation: "areas"; referencedColumns: ["id"] },
        ];
      };
      products: {
        Row: {
          id: string;
          producer_id: string;
          name: string;
          category: string;
          cold_chain_class: ColdChainClass;
          price_pence: number;
          price_floor_pence: number | null;
          unit: string;
          variable_weight_min: number | null;
          variable_weight_max: number | null;
          available_from: string | null;
          available_to: string | null;
          is_glut: boolean;
          glut_clearing_price_pence: number | null;
          quantity_available: number;
          allergens: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          producer_id: string;
          name: string;
          category: string;
          cold_chain_class: ColdChainClass;
          price_pence: number;
          price_floor_pence?: number | null;
          unit: string;
          variable_weight_min?: number | null;
          variable_weight_max?: number | null;
          available_from?: string | null;
          available_to?: string | null;
          is_glut?: boolean;
          glut_clearing_price_pence?: number | null;
          quantity_available?: number;
          allergens?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          producer_id?: string;
          name?: string;
          category?: string;
          cold_chain_class?: ColdChainClass;
          price_pence?: number;
          price_floor_pence?: number | null;
          unit?: string;
          variable_weight_min?: number | null;
          variable_weight_max?: number | null;
          available_from?: string | null;
          available_to?: string | null;
          is_glut?: boolean;
          glut_clearing_price_pence?: number | null;
          quantity_available?: number;
          allergens?: Json;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "products_producer_id_fkey"; columns: ["producer_id"]; referencedRelation: "producers"; referencedColumns: ["id"] },
        ];
      };
      households: {
        Row: { id: string; user_id: string; area_id: string | null; name: string; address_line: string | null; city: string | null; postcode: string | null; lat: number | null; lng: number | null; contact_name: string | null; contact_phone: string | null; created_at: string };
        Insert: { id?: string; user_id: string; area_id?: string | null; name: string; address_line?: string | null; city?: string | null; postcode?: string | null; lat?: number | null; lng?: number | null; contact_name?: string | null; contact_phone?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; area_id?: string | null; name?: string; address_line?: string | null; city?: string | null; postcode?: string | null; lat?: number | null; lng?: number | null; contact_name?: string | null; contact_phone?: string | null; created_at?: string };
        Relationships: [
          { foreignKeyName: "households_area_id_fkey"; columns: ["area_id"]; referencedRelation: "areas"; referencedColumns: ["id"] },
        ];
      };
      producer_pickup: {
        Row: { producer_id: string; address_line: string; city: string; postcode: string; lat: number | null; lng: number | null; contact_name: string | null; contact_phone: string | null; created_at: string };
        Insert: { producer_id: string; address_line: string; city: string; postcode: string; lat?: number | null; lng?: number | null; contact_name?: string | null; contact_phone?: string | null; created_at?: string };
        Update: { producer_id?: string; address_line?: string; city?: string; postcode?: string; lat?: number | null; lng?: number | null; contact_name?: string | null; contact_phone?: string | null; created_at?: string };
        Relationships: [
          { foreignKeyName: "producer_pickup_producer_id_fkey"; columns: ["producer_id"]; referencedRelation: "producers"; referencedColumns: ["id"] },
        ];
      };
      courier_jobs: {
        Row: { id: string; order_id: string; producer_id: string; provider: string; provider_job_id: string | null; tracking_url: string | null; status: string; fee_pence: number; created_at: string };
        Insert: { id?: string; order_id: string; producer_id: string; provider: string; provider_job_id?: string | null; tracking_url?: string | null; status?: string; fee_pence?: number; created_at?: string };
        Update: { id?: string; order_id?: string; producer_id?: string; provider?: string; provider_job_id?: string | null; tracking_url?: string | null; status?: string; fee_pence?: number; created_at?: string };
        Relationships: [
          { foreignKeyName: "courier_jobs_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "courier_jobs_producer_id_fkey"; columns: ["producer_id"]; referencedRelation: "producers"; referencedColumns: ["id"] },
        ];
      };
      intent_profiles: {
        Row: {
          id: string;
          household_id: string;
          budget_pence: number;
          cadence: Cadence;
          household_size: number;
          likes: Json;
          dislikes: Json;
          hard_allergens: Json;
          adventurousness: Adventurousness;
          priority_preference: PriorityPreference;
          substitution_rule: SubstitutionRule;
          fulfilment_pref: FulfilmentType;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          budget_pence: number;
          cadence?: Cadence;
          household_size?: number;
          likes?: Json;
          dislikes?: Json;
          hard_allergens?: Json;
          adventurousness?: Adventurousness;
          priority_preference?: PriorityPreference;
          substitution_rule?: SubstitutionRule;
          fulfilment_pref?: FulfilmentType;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          budget_pence?: number;
          cadence?: Cadence;
          household_size?: number;
          likes?: Json;
          dislikes?: Json;
          hard_allergens?: Json;
          adventurousness?: Adventurousness;
          priority_preference?: PriorityPreference;
          substitution_rule?: SubstitutionRule;
          fulfilment_pref?: FulfilmentType;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "intent_profiles_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
      orders: {
        Row: {
          id: string;
          household_id: string;
          status: OrderStatus;
          fulfilment_type: FulfilmentType;
          collection_point_id: string | null;
          delivery_fee_pence: number;
          courier_provider: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          status?: OrderStatus;
          fulfilment_type: FulfilmentType;
          collection_point_id?: string | null;
          delivery_fee_pence?: number;
          courier_provider?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          status?: OrderStatus;
          fulfilment_type?: FulfilmentType;
          collection_point_id?: string | null;
          delivery_fee_pence?: number;
          courier_provider?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "orders_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_collection_point_id_fkey"; columns: ["collection_point_id"]; referencedRelation: "collection_points"; referencedColumns: ["id"] },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          producer_id: string;
          qty: number;
          line_price_pence: number;
          commission_rate: number;
          commission_pence: number;
          farmer_pence: number;
          is_glut: boolean;
          is_forward: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          producer_id: string;
          qty: number;
          line_price_pence: number;
          commission_rate: number;
          commission_pence: number;
          farmer_pence: number;
          is_glut?: boolean;
          is_forward?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          producer_id?: string;
          qty?: number;
          line_price_pence?: number;
          commission_rate?: number;
          commission_pence?: number;
          farmer_pence?: number;
          is_glut?: boolean;
          is_forward?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_product_id_fkey"; columns: ["product_id"]; referencedRelation: "products"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_producer_id_fkey"; columns: ["producer_id"]; referencedRelation: "producers"; referencedColumns: ["id"] },
        ];
      };
      payouts: {
        Row: { id: string; order_id: string; producer_id: string; farmer_pence: number; platform_pence: number; courier_pence: number; created_at: string };
        Insert: { id?: string; order_id: string; producer_id: string; farmer_pence: number; platform_pence: number; courier_pence?: number; created_at?: string };
        Update: { id?: string; order_id?: string; producer_id?: string; farmer_pence?: number; platform_pence?: number; courier_pence?: number; created_at?: string };
        Relationships: [
          { foreignKeyName: "payouts_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "payouts_producer_id_fkey"; columns: ["producer_id"]; referencedRelation: "producers"; referencedColumns: ["id"] },
        ];
      };
      forward_demand: {
        Row: { id: string; product_category: string; area_id: string; target_window: string; household_count: number; implied_qty: number; created_at: string };
        Insert: { id?: string; product_category: string; area_id: string; target_window: string; household_count?: number; implied_qty?: number; created_at?: string };
        Update: { id?: string; product_category?: string; area_id?: string; target_window?: string; household_count?: number; implied_qty?: number; created_at?: string };
        Relationships: [
          { foreignKeyName: "forward_demand_area_id_fkey"; columns: ["area_id"]; referencedRelation: "areas"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      cold_chain_class: ColdChainClass;
      cadence: Cadence;
      adventurousness: Adventurousness;
      priority_preference: PriorityPreference;
      substitution_rule: SubstitutionRule;
      fulfilment_type: FulfilmentType;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience row aliases
type PublicTables = Database["public"]["Tables"];
export type Area = PublicTables["areas"]["Row"];
export type CollectionPoint = PublicTables["collection_points"]["Row"];
export type Producer = PublicTables["producers"]["Row"];
export type Product = PublicTables["products"]["Row"];
export type Household = PublicTables["households"]["Row"];
export type IntentProfile = PublicTables["intent_profiles"]["Row"];
export type Order = PublicTables["orders"]["Row"];
export type OrderItem = PublicTables["order_items"]["Row"];
export type Payout = PublicTables["payouts"]["Row"];
export type ForwardDemand = PublicTables["forward_demand"]["Row"];
export type ProducerPickup = PublicTables["producer_pickup"]["Row"];
export type CourierJob = PublicTables["courier_jobs"]["Row"];
