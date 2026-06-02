import React, { useEffect, useState } from "react";
import {
  getBookings,
  cancelBooking,
  downloadBookingPdf,
} from "../../../services/user";

export default function TiketSaya() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await downloadBookingPdf(id);

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `booking-${id}.pdf`
      );

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tiket Saya</h2>

      {bookings.length === 0 ? (
        <p>Belum ada booking.</p>
      ) : (
        bookings.map((item) => (
          <div
            key={item.id}
            className="card p-3 mb-3"
          >
            <h5>{item.gunung?.nama}</h5>

            <p>
              Tanggal: {item.tanggal_naik}
            </p>

            <p>
              Status: {item.status}
            </p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  handleCancel(item.id)
                }
              >
                Batalkan
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  handleDownload(item.id)
                }
              >
                Download PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}