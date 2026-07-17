import AnimalDetailPage from './AnimalDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnimalDetailPage id={id} />;
}