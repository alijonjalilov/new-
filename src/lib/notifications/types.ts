export interface BookingNotification {
  number: number;
  id: string;
  eventTypeLabel: string;
  clientName: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  extraPhones?: string[];
  comment?: string | null;
  summary: { label: string; value: string }[];
  adminUrl?: string;
  /** Предупреждение: дата и время пересекаются с подтверждённой заявкой */
  warning?: string | null;
}

export interface NotificationChannel {
  name: string;
  isConfigured(): boolean;
  send(n: BookingNotification): Promise<void>;
}
