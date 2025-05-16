import { ItemForm } from "../../components/items/ItemForm";

export default function CreateItem() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Create New Item</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new item to the inventory. Fill in the details below.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ItemForm mode="create" />
      </div>
    </div>
  );
}
