interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-4">Edit Product</h1>
      <p className="text-neutral-500 text-sm">Editing product ID: {id} (Wired in Phase 5)</p>
    </main>
  );
}
