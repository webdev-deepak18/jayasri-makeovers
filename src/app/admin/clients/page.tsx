import { getClients } from "@/actions/orders";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export const revalidate = 0;

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="p-4 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">Clients ({clients.length})</h1>
        <p className="text-sm text-neutral-500 font-poppins">All unique clients extracted from your orders</p>
      </div>

      <div className="space-y-3">
        {clients.map((client, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="font-playfair font-bold text-xl text-neutral-900 leading-tight mb-2">{client.client_name}</h3>
              <div className="flex flex-col gap-1 text-xs text-brand-secondary font-semibold font-poppins tracking-wide">
                <a href={`tel:${client.phone_number}`} className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                  <PhoneIcon className="w-4 h-4" />
                  {client.phone_number}
                </a>
                <div className="flex items-center gap-1.5 line-clamp-1 truncate w-[200px]">
                  <MapPinIcon className="w-4 h-4" />
                  {client.location}
                </div>
              </div>
            </div>
            
            <a href={`tel:${client.phone_number}`} className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors shadow-sm border border-green-200">
              <PhoneIcon className="w-5 h-5" />
            </a>
          </div>
        ))}

        {clients.length === 0 && (
          <div className="p-12 text-center text-neutral-400 bg-white rounded-xl border border-dashed border-neutral-200">
            <p className="font-poppins">No clients found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
