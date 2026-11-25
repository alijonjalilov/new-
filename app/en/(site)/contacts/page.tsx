import { ContactsPage, contactsMetadata } from "@/components/pages/contacts-page";

export const metadata = contactsMetadata("en");

export default function Page() {
  return <ContactsPage locale="en" />;
}
