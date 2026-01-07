import GenreResultsClient from "./GenreResultsClient";

export default function Page({
  searchParams,
}: {
  searchParams?: { g?: string };
}) {
  return <GenreResultsClient g={searchParams?.g} />;
}
