import EditAnimalPageClient from './EditAnimalPageClient';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditAnimalPageClient id={id} />;
}
