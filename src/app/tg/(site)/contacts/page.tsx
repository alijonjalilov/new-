import { ContactsPage, contactsMetadata } from "@/components/pages/contacts-page";

export const metadata = contactsMetadata("tg");

export default function Page() {
  return <ContactsPage locale="tg" />;
}
