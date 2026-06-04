import { useEffect, useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import {
  getBookings,
  cancelBooking,
} from "../../../services/user/tiketService";

export default function TiketSaya() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const res = await getBookings();
    setTickets(res.data);
  };

  const handleCancel = async (id) => {
    await cancelBooking(id);
    loadTickets();
  };

  return (
    <UserPrivateLayout>
      <h1 className="text-3xl font-bold mb-6">
        Tiket Saya
      </h1>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="font-bold">
              {ticket.gunung}
            </h2>

            <p>{ticket.tanggal}</p>

            <p>Status : {ticket.status}</p>

            <button
              onClick={() =>
                handleCancel(ticket.id)
              }
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
            >
              Batalkan
            </button>
          </div>
        ))}
      </div>
    </UserPrivateLayout>
  );
}