import React, { useState } from 'react';
import { useWarehouse, rupiah } from '../context/WarehouseContext';
import { Card, StatCard, Table, MenuPill } from '../components/ui';
import type { Column } from '../components/ui';
import type { PurchaseReport } from '../types';
import { DollarSign, ShoppingBag, TrendingUp, Search } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { purchases, riders } = useWarehouse();
  const [search, setSearch] = useState('');

  const filtered = purchases.filter((p) => {
    const rider = riders.find((r) => r.id === p.riderId);
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.date.includes(q) ||
      (rider && rider.name.toLowerCase().includes(q))
    );
  });

  const totalRevenue = purchases.reduce(
    (sum, p) =>
      sum + p.items.reduce((itemSum, i) => itemSum + Number(i.price || 0) * Number(i.qty || 0), 0),
    0
  );

  const totalPortionsSold = purchases.reduce(
    (sum, p) => sum + p.items.reduce((itemSum, i) => itemSum + Number(i.qty || 0), 0),
    0
  );

  const columns: Column<PurchaseReport>[] = [
    {
      header: 'ID Laporan',
      accessor: 'id',
      render: (p) => <span className="font-extrabold text-[#4A1515]">{p.id}</span>,
    },
    {
      header: 'Tanggal Setor',
      accessor: 'date',
      render: (p) => <span className="text-xs text-[#7A534B] font-mono">{p.date}</span>,
    },
    {
      header: 'Rider Bertugas',
      render: (p) => {
        const rider = riders.find((r) => r.id === p.riderId);
        return (
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#331A15]">
              {rider?.name || 'Rider'}
            </span>
            <span className="text-[11px] text-[#F47716] font-semibold">
              {rider?.gerobak || '-'}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Menu Terjual',
      render: (p) => (
        <div className="flex flex-wrap gap-1.5 py-1">
          {p.items.map((item, idx) => (
            <MenuPill key={idx} name={item.menu} qty={`${item.qty} terjual`} />
          ))}
        </div>
      ),
    },
    {
      header: 'Porsi Terjual',
      align: 'right',
      render: (p) => {
        const total = p.items.reduce((s, i) => s + Number(i.qty || 0), 0);
        return <span className="font-extrabold text-xs text-[#331A15]">{total} Porsi</span>;
      },
    },
    {
      header: 'Total Setoran Tunai',
      align: 'right',
      render: (p) => {
        const total = p.items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
        return <span className="font-black text-sm text-[#F47716]">{rupiah(total)}</span>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#4A1515]">Laporan Setoran & Penjualan</h1>
        <p className="text-xs text-[#7A534B] mt-1">
          Rekapitulasi penjualan makanan padang dan uang setoran yang diterima dari masing-masing rider.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Uang Setoran"
          value={rupiah(totalRevenue)}
          subtitle="Akumulasi pendapatan diterima gudang"
          icon={<DollarSign size={20} />}
          variant="maroon"
        />

        <StatCard
          title="Porsi Makanan Terjual"
          value={`${totalPortionsSold.toLocaleString('id-ID')} Porsi`}
          subtitle="Total porsi laku dibeli konsumen"
          icon={<ShoppingBag size={20} />}
          variant="orange"
        />

        <StatCard
          title="Rata-rata per Gerobak"
          value={rupiah(riders.length > 0 ? Math.round(totalRevenue / riders.length) : 0)}
          subtitle="Omzet rata-rata armada aktif"
          icon={<TrendingUp size={20} />}
          variant="default"
        />
      </div>

      {/* Search / Filter Card */}
      <Card>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-[#7A534B]" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID Laporan, nama rider, atau tanggal..."
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
        keyExtractor={(p) => p.id}
      />
    </div>
  );
};
