export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image?: string;
          available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total: number;
          delivery_address: string;
          delivery_time: string | null;
          created_at: string;
          updated_at: string;
          delivery_person_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: string;
          total: number;
          delivery_address: string;
          delivery_time?: string | null;
          created_at?: string;
          updated_at?: string;
          delivery_person_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
          total?: number;
          delivery_address?: string;
          delivery_time?: string | null;
          created_at?: string;
          updated_at?: string;
          delivery_person_id?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          food_item_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
