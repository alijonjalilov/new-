import { HomeRoute, homeMetadata } from "@/components/pages/home-route";

export const metadata = homeMetadata("ru");

type Props = { searchParams: Promise<{ design?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  return <HomeRoute locale="ru" searchParams={searchParams} />;
}
