import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { Card, Table, StatusBadge } from '../components/ui';
import type { Column } from '../components/ui';
import type { Rider } from '../types';
import { Phone, Search, Users } from 'lucide-react';

export const RidersPage: React.FC = () => {
  const { riders } = useWarehouse();
  const [search, setSearch] = useState('');

  const filtered = riders.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.gerobak.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  const columns: Column<Rider>[] = [
    {
      header: 'ID Rider',
      accessor: 'id',
      render: (r) => <span className="font-extrabold text-[#4A1515]">{r.id}</span>,
    },
    {
      header: 'Nama Rider',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FFF5EC] border border-[#F8D7C4] text-[#F47716] font-bold text-xs flex items-center justify-center">
            {r.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-bold text-sm text-[#331A15]">{r.name}</span>
        </div>
      ),
    },
    {
      header: 'Gerobak Ditugaskan',
      accessor: 'gerobak',
      render: (r) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#EADBCE] text-xs font-bold text-[#4A1515]">
          {r.gerobak}
        </span>
      ),
    },
    {
      header: 'No. WhatsApp / HP',
      accessor: 'phone',
      render: (r) => (
        <a
          href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1E5C16] hover:underline"
        >
          <Phone size={13} /> {r.phone}
        </a>
      ),
    },
    {
      header: 'Status Armada',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#4A1515]">Rider & Gerobak Binaan</h1>
        <p className="text-xs text-[#7A534B] mt-1">
          Daftar kontak rider dan gerobak binaan gudang yang beroperasi menerima alokasi menu.
        </p>
      </div>

      {/* Info Notice Card */}
      <div className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#F8D7C4] flex items-center gap-3">
        <Users size={20} className="text-[#F47716] flex-shrink-0" />
        <p className="text-xs text-[#331A15] leading-relaxed">
          <strong className="font-bold text-[#4A1515]">Catatan Distribusi:</strong> Pemantauan radar
          posisi live GPS gerobak di lapangan dikelola langsung oleh unit <strong>Koordinator Lapangan (Korlap)</strong>.
          Halaman ini khusus memuat identitas armada untuk verifikasi alokasi stok dan serah terima setoran.
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-[#7A534B]" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama rider, nomor gerobak, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#EADBCE] text-xs font-medium outline-none focus:border-[#F47716]"
          />
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
      />
    </div>
  );
};
