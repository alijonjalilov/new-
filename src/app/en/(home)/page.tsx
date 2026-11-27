import { ensureContent } from "@/lib/content/store";
import { HomeRoute, homeMetadata } from "@/components/pages/home-route";

export const metadata = homeMetadata("en");

type Props = { searchParams: Promise<{ design?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  await ensureContent();
  return <HomeRoute locale="en" searchParams={searchParams} />;
}
