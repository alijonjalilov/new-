export interface BookingNotification {
  number: number;
  id: string;
  eventTypeLabel: string;
  clientName: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  comment?: string | null;
  summary: { label: string; value: string }[];
  adminUrl?: string;
}

export interface NotificationChannel {
  name: string;
  isConfigured(): boolean;
  send(n: BookingNotification): Promise<void>;
}
