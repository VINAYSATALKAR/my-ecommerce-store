import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}