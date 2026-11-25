import { ContactsPage, contactsMetadata } from "@/components/pages/contacts-page";

export const metadata = contactsMetadata("ru");

export default function Page() {
  return <ContactsPage locale="ru" />;
}
