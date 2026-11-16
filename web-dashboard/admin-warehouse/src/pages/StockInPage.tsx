import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { Table, Button, MenuPill, Card } from '../components/ui';
import type { Column } from '../components/ui';
import type { StockInBatch } from '../types';
import { PlusCircle, Search, Clock, ChevronRight } from 'lucide-react';

export const StockInPage: React.FC = () => {
  const { stockIns } = useWarehouse();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = stockIns.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.by.toLowerCase().includes(q) ||
      b.date.includes(q) ||
      b.items.some((i) => i.menu.toLowerCase().includes(q))
    );
  });

  const columns: Column<StockInBatch>[] = [
    {
      header: 'ID Batch',
      accessor: 'id',
      render: (b) => <span className="font-extrabold text-[#4A1515]">{b.id}</span>,
    },
    {
      header: 'Waktu Terima',
      render: (b) => (
        <span className="text-xs text-[#7A534B] flex items-center gap-1 font-mono">
          <Clock size={13} /> {b.date} {b.time}
        </span>
      ),
    },
    {
      header: 'Penerima',
      accessor: 'by',
      render: (b) => <span className="font-semibold text-xs text-[#331A15]">{b.by}</span>,
    },
    {
      header: 'Menu Yang Diterima',
      render: (b) => (
        <div className="flex flex-wrap gap-1.5 py-1">
          {b.items.map((item, idx) => (
            <MenuPill key={idx} name={item.menu} qty={item.qty} />
          ))}
        </div>
      ),
    },
    {
      header: 'Total Porsi',
      align: 'right',
      render: (b) => {
        const total = b.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
        return <span className="font-extrabold text-sm text-[#4A1515]">{total} Porsi</span>;
      },
    },
    {
      header: 'Aksi',
      align: 'center',
      render: (b) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/stock-in/${b.id}`);
          }}
          className="p-1.5 rounded-lg text-[#F47716] hover:bg-[#FFF5EC] cursor-pointer"
          title="Lihat Detail"
        >
          <ChevronRight size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#4A1515]">Riwayat Stok Masuk</h1>
          <p className="text-xs text-[#7A534B] mt-1">
            Daftar pengiriman porsi makanan matang dari Dapur Pusat ke Gudang.
          </p>
        </div>

        <Button variant="orange" size="sm" onClick={() => navigate('/stock-in/new')}>
          <PlusCircle size={15} />
          <span>Input Stok Masuk Baru</span>
        </Button>
      </div>

      {/* Filter / Search Card */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-[#7A534B]" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID Batch, penerima, atau menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#EADBCE] text-xs font-medium outline-none focus:border-[#F47716]"
            />
          </div>
        </div>
      </Card>

      {/* Table Content */}
      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => navigate(`/stock-in/${item.id}`)}
      />
    </div>
  );
};
