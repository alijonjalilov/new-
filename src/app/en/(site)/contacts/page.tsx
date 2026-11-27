import { ensureContent } from "@/lib/content/store";
import { ContactsPage, contactsMetadata } from "@/components/pages/contacts-page";

export const metadata = contactsMetadata("en");

export default async function Page() {
  await ensureContent();
  return <ContactsPage locale="en" />;
}
