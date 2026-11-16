import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { Table, Button, MenuPill, StatusBadge, Card } from '../components/ui';
import type { Column } from '../components/ui';
import type { StockOutBatch } from '../types';
import { PlusCircle, Search, ChevronRight } from 'lucide-react';

export const StockOutPage: React.FC = () => {
  const { stockOuts, riders } = useWarehouse();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = stockOuts.filter((b) => {
    const rider = riders.find((r) => r.id === b.riderId);
    const q = search.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.gerobak.toLowerCase().includes(q) ||
      (rider && rider.name.toLowerCase().includes(q)) ||
      b.items.some((i) => i.menu.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<StockOutBatch>[] = [
    {
      header: 'ID Batch',
      accessor: 'id',
      render: (b) => <span className="font-extrabold text-[#4A1515]">{b.id}</span>,
    },
    {
      header: 'Tanggal',
      accessor: 'date',
      render: (b) => <span className="text-xs text-[#7A534B] font-mono">{b.date}</span>,
    },
    {
      header: 'Rider & Gerobak',
      render: (b) => {
        const rider = riders.find((r) => r.id === b.riderId);
        return (
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#331A15]">
              {rider?.name || 'Rider'}
            </span>
            <span className="text-[11px] text-[#F47716] font-semibold">{b.gerobak}</span>
          </div>
        );
      },
    },
    {
      header: 'Menu Dialokasikan',
      render: (b) => (
        <div className="flex flex-wrap gap-1.5 py-1">
          {b.items.map((item, idx) => (
            <MenuPill key={idx} name={item.menu} qty={item.qty} />
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (b) => <StatusBadge status={b.status} />,
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
            navigate(`/stock-out/${b.id}`);
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
          <h1 className="text-2xl font-extrabold text-[#4A1515]">Distribusi Stok Keluar</h1>
          <p className="text-xs text-[#7A534B] mt-1">
            Alokasi jatah porsi makanan matang ke masing-masing gerobak rider.
          </p>
        </div>

        <Button variant="orange" size="sm" onClick={() => navigate('/stock-out/new')}>
          <PlusCircle size={15} />
          <span>Alokasi Stok ke Rider</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3 text-[#7A534B]" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID Batch, nama rider, gerobak, atau menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#EADBCE] text-xs font-medium outline-none focus:border-[#F47716]"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'Berjalan', 'Selesai'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-none cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#F47716] text-white border-[#F47716]'
                    : 'bg-white border-[#EADBCE] text-[#7A534B] hover:bg-[#FAF6F0]'
                }`}
              >
                {st === 'ALL' ? 'Semua Status' : st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table Content */}
      <Table
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => navigate(`/stock-out/${item.id}`)}
      />
    </div>
  );
};
