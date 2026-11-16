import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { StatCard, Card, MenuPill, StatusBadge, Button } from '../components/ui';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  PlusCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, menus, warehouseStock, stockIns, stockOuts, riders } = useWarehouse();
  const navigate = useNavigate();

  // Computations
  const totalStockAvailable = Object.values(warehouseStock).reduce((a, b) => a + b, 0);

  const totalStockInQty = stockIns.reduce(
    (acc, batch) => acc + batch.items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    0
  );

  const totalStockOutQty = stockOuts.reduce(
    (acc, batch) => acc + batch.items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Ringkasan & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#4A1515]">
            Halo, {user?.name || 'Admin Kertajaya'} 👋
          </h1>
          <p className="text-xs text-[#7A534B] mt-1">
            Ringkasan ketersediaan stok fisik gudang dan distribusi ke gerobak rider.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="orange"
            size="sm"
            onClick={() => navigate('/stock-in/new')}
          >
            <PlusCircle size={15} />
            <span>Input Stok Masuk</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/stock-out/new')}
          >
            <ArrowUpFromLine size={15} />
            <span>Alokasi ke Rider</span>
          </Button>
        </div>
      </div>

      {/* 2. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stok Gudang"
          value={`${totalStockAvailable.toLocaleString('id-ID')} Porsi`}
          subtitle="Sisa stok riil siap distribusi"
          icon={<Package size={20} />}
          variant="maroon"
        />

        <StatCard
          title="Stok Masuk"
          value={`${totalStockInQty.toLocaleString('id-ID')} Porsi`}
          subtitle="Total penerimaan batch dapur"
          icon={<ArrowDownToLine size={20} />}
          variant="default"
        />

        <StatCard
          title="Stok Didistribusi"
          value={`${totalStockOutQty.toLocaleString('id-ID')} Porsi`}
          subtitle="Total alokasi ke gerobak"
          icon={<ArrowUpFromLine size={20} />}
          variant="orange"
        />

        <StatCard
          title="Rider Terafiliasi"
          value={`${riders.length} Gerobak`}
          subtitle="Armada operasional aktif"
          icon={<Users size={20} />}
          variant="default"
        />
      </div>

      {/* 3. Sisa Stok Riil per Menu (Kartu Visual) */}
      <Card
        title="Sisa Stok Riil per Menu di Gudang"
        subtitle="Dihitung otomatis: Total Stok Masuk dikurangi Total Stok Keluar"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {menus.map((menu) => {
            const stock = warehouseStock[menu.name] || 0;
            const isLow = stock < 50;

            return (
              <div
                key={menu.name}
                className="p-4 rounded-2xl border border-[#EADBCE] bg-[#FFFBF5] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="font-extrabold text-sm text-[#4A1515]">{menu.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLow
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}
                  >
                    {isLow ? 'Menipis' : 'Aman'}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#331A15]">
                    {stock.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-semibold text-[#7A534B]">porsi</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Dua Kolom: Riwayat Stok Masuk & Stok Keluar Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Penerimaan Stok Masuk Terakhir */}
        <Card
          title="Riwayat Stok Masuk Terbaru"
          subtitle="Penerimaan bahan matang dari Dapur Pusat"
          action={
            <button
              onClick={() => navigate('/stock-in')}
              className="text-xs font-bold text-[#F47716] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          }
        >
          <div className="flex flex-col gap-3">
            {stockIns.slice(0, 3).map((batch) => {
              const totalBatchQty = batch.items.reduce((s, i) => sumSafe(s, i.qty), 0);
              return (
                <div
                  key={batch.id}
                  onClick={() => navigate(`/stock-in/${batch.id}`)}
                  className="p-3.5 rounded-2xl border border-[#EADBCE] bg-white hover:bg-[#FAF6F0] cursor-pointer transition-none flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4A1515]">{batch.id}</span>
                    <span className="text-[#7A534B] flex items-center gap-1">
                      <Clock size={12} /> {batch.date} {batch.time}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {batch.items.map((item, idx) => (
                      <MenuPill key={idx} name={item.menu} qty={item.qty} />
                    ))}
                  </div>
                  <div className="text-[11px] text-[#7A534B] flex justify-between pt-1 border-t border-[#F0E6DE]">
                    <span>Petugas: {batch.by}</span>
                    <span className="font-bold text-[#331A15]">Total: {totalBatchQty} Porsi</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Kolom 2: Alokasi Stok Keluar Terakhir */}
        <Card
          title="Distribusi Stok Keluar Terbaru"
          subtitle="Alokasi menu ke masing-masing armada gerobak"
          action={
            <button
              onClick={() => navigate('/stock-out')}
              className="text-xs font-bold text-[#F47716] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          }
        >
          <div className="flex flex-col gap-3">
            {stockOuts.slice(0, 3).map((batch) => {
              const rider = riders.find((r) => r.id === batch.riderId);
              const totalBatchQty = batch.items.reduce((s, i) => sumSafe(s, i.qty), 0);
              return (
                <div
                  key={batch.id}
                  onClick={() => navigate(`/stock-out/${batch.id}`)}
                  className="p-3.5 rounded-2xl border border-[#EADBCE] bg-white hover:bg-[#FAF6F0] cursor-pointer transition-none flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4A1515]">{batch.id}</span>
                    <StatusBadge status={batch.status} />
                  </div>
                  <div className="text-xs font-extrabold text-[#331A15]">
                    {rider?.name || 'Rider'} ({batch.gerobak})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {batch.items.map((item, idx) => (
                      <MenuPill key={idx} name={item.menu} qty={item.qty} />
                    ))}
                  </div>
                  <div className="text-[11px] text-[#7A534B] flex justify-between pt-1 border-t border-[#F0E6DE]">
                    <span>Tanggal: {batch.date}</span>
                    <span className="font-bold text-[#331A15]">Total: {totalBatchQty} Porsi</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

const sumSafe = (a: number, b: number) => Number(a || 0) + Number(b || 0);
