export interface ReferrerData {
  referral_code: string;
  referral_url: string;
  current_balance: number;
  total_earned: number;
  total_referrals_count: number;
  commission_rate: string;
}

export interface ReferredUserData {
  id: string;
  user: string;
  username: string;
  avatar_url: string;
  country: string;
  plan: string;
  status: "active" | "canceled" | "past_due";
  revenue_generated: number;
  used_referral_code: string;
  has_received_first_month_discount: boolean;
  joined_at: string;
  last_payment: string;
}

export interface ReferralRewardData {
  id: string;
  referred_user: string;
  billing_event: string;
  referral_code_at_time: string;
  amount: number;
  status: "approved" | "pending" | "rejected";
  created_at: string;
}

export interface UserSettings {
  currency: string;
  language: string;
}

export interface DashboardStats {
  today_earnings: number;
  week_earnings: number;
  month_earnings: number;
  year_earnings: number;
  available_balance: number;
  pending_balance: number;
  approved_balance: number;
  total_paid: number;
  total_accumulated: number;
  mrr: number; // Monthly Recurring Revenue
  next_month_forecast: number;
  highest_commission: number;
  last_commission: number;
  avg_commission: number;
  avg_monthly_revenue: number;
  best_month: string;
}

export interface ConversionMetrics {
  total_clicks: number;
  unique_visitors: number;
  signups: number;
  active_users: number;
  subscriptions: number;
  renewals: number;
  click_to_signup_rate: number;
  signup_to_sub_rate: number;
  overall_conversion_rate: number;
  revenue_per_click: number;
  revenue_per_visitor: number;
  revenue_per_referral: number;
}
