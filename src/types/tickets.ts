export interface Ticket {
  id: string;
  event: string;
  event_title: string;
  user: number;
  user_name: string;
  purchase: string;
  purchase_status: string;
  short_code: string;
  qr_hash: string;
  is_checked_in: boolean;
  checked_in_at: string | null;
  is_valid: boolean;
  created_at: string;
}

export interface TicketPurchase {
  id: string;
  buyer_name: string;
  event_title: string;
  total_amount: string;
  status: string;
  status_display: string;
  ticket_ids: string[];
  paid_at: string | null;
  created_at: string;
}