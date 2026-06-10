export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "customer" | "vendor" | "rider"
          full_name: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: "customer" | "vendor" | "rider"
          full_name?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: "customer" | "vendor" | "rider"
          full_name?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          profile_id: string
          name: string
          address: string
          is_active: boolean
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          address: string
          is_active?: boolean
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          address?: string
          is_active?: boolean
          rating?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          name: string
          description: string | null
          price: number
          is_veg: boolean
          is_available: boolean
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          name: string
          description?: string | null
          price: number
          is_veg?: boolean
          is_available?: boolean
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          name?: string
          description?: string | null
          price?: number
          is_veg?: boolean
          is_available?: boolean
          image_url?: string | null
          created_at?: string
        }
      }
      riders: {
        Row: {
          id: string
          profile_id: string
          vehicle_type: string | null
          license_plate: string | null
          current_status: "offline" | "available" | "busy"
          current_location: Json | null
          last_location_update: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          vehicle_type?: string | null
          license_plate?: string | null
          current_status?: "offline" | "available" | "busy"
          current_location?: Json | null
          last_location_update?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          vehicle_type?: string | null
          license_plate?: string | null
          current_status?: "offline" | "available" | "busy"
          current_location?: Json | null
          last_location_update?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          vendor_id: string
          rider_id: string | null
          status: "pending" | "accepted" | "preparing" | "ready" | "assigned" | "picked_up" | "delivered" | "cancelled"
          total_amount: number
          delivery_address: string
          delivery_fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          vendor_id: string
          rider_id?: string | null
          status?: "pending" | "accepted" | "preparing" | "ready" | "assigned" | "picked_up" | "delivered" | "cancelled"
          total_amount: number
          delivery_address: string
          delivery_fee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          vendor_id?: string
          rider_id?: string | null
          status?: "pending" | "accepted" | "preparing" | "ready" | "assigned" | "picked_up" | "delivered" | "cancelled"
          total_amount?: number
          delivery_address?: string
          delivery_fee?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          special_instructions: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          price_at_time: number
          special_instructions?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_time?: number
          special_instructions?: string | null
        }
      }
    }
  }
}
