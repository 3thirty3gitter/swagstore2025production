interface TenantDetailPageProps {
  params: Promise<{ tenantId: string }>;
}

export default async function TenantDetailPage({ params }: TenantDetailPageProps) {
  const { tenantId } = await params;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Tenant: {tenantId}</h1>
      <p>Tenant details coming soon...</p>
    </div>
  );
}
