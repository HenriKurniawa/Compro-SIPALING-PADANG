import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { Card, Button, Input } from '../components/ui';
import { ArrowLeft, Save, Plus, Minus, AlertCircle } from 'lucide-react';

export const StockInFormPage: React.FC = () => {
  const { user, menus, addStockIn } = useWarehouse();
  const navigate = useNavigate();

  const now = new Date();
  const defaultDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const defaultTime = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [by, setBy] = useState(user?.name || 'Admin Kertajaya');

  // Quantities for each menu
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    menus.forEach((m) => {
      initial[m.name] = 0;
    });
    return initial;
  });

  const [error, setError] = useState('');

  const handleQtyChange = (menuName: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [menuName]: Math.max(0, val),
    }));
  };

  const totalPortions = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([menu, qty]) => ({ menu, qty }));

    if (items.length === 0) {
      setError('Harap masukkan jumlah porsi minimal pada salah satu menu.');
      return;
    }

    addStockIn({
      date,
      time,
      by,
      items,
    });

    navigate('/stock-in');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/stock-in')}
            className="p-2 rounded-xl bg-white border border-[#EADBCE] text-[#331A15] hover:bg-[#FAF6F0] cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#4A1515]">Form Stok Masuk Baru</h1>
            <p className="text-xs text-[#7A534B]">
              Catat porsi makanan matang yang baru tiba dari Dapur Pusat.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Info Batch Card */}
        <Card title="Informasi Penerimaan Batch">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tanggal Masuk"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 16 Nov 2026"
            />
            <Input
              label="Waktu Terima"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 05:30"
            />
            <Input
              label="Petugas Penerima"
              value={by}
              onChange={(e) => setBy(e.target.value)}
              placeholder="Nama Petugas"
            />
          </div>
        </Card>

        {/* Input Jumlah Menu */}
        <Card
          title="Rincian Jumlah Menu Diterima"
          subtitle="Masukkan jumlah porsi untuk setiap menu Padang yang datang"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menus.map((menu) => {
              const currentQty = quantities[menu.name] || 0;
              return (
                <div
                  key={menu.name}
                  className="p-4 rounded-2xl border border-[#EADBCE] bg-[#FFFBF5] flex items-center justify-between"
                >
                  <div>
                    <span className="font-extrabold text-sm text-[#4A1515] block">
                      {menu.name}
                    </span>
                    <span className="text-xs text-[#7A534B]">
                      Rp {menu.price.toLocaleString('id-ID')} / porsi
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(menu.name, currentQty - 10)}
                      className="w-8 h-8 rounded-lg border border-[#EADBCE] bg-white text-[#4A1515] font-bold flex items-center justify-center hover:bg-[#FAF6F0] cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min={0}
                      value={currentQty === 0 ? '' : currentQty}
                      placeholder="0"
                      onChange={(e) => handleQtyChange(menu.name, parseInt(e.target.value) || 0)}
                      className="w-16 py-1 px-2 text-center text-sm font-extrabold rounded-lg border border-[#EADBCE] bg-white text-[#331A15] outline-none focus:border-[#F47716]"
                    />

                    <button
                      type="button"
                      onClick={() => handleQtyChange(menu.name, currentQty + 10)}
                      className="w-8 h-8 rounded-lg border border-[#EADBCE] bg-white text-[#4A1515] font-bold flex items-center justify-center hover:bg-[#FAF6F0] cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF5EC] border border-[#F8D7C4] flex items-center justify-between">
            <span className="text-sm font-extrabold text-[#4A1515]">Total Porsi Masuk:</span>
            <span className="text-xl font-black text-[#F47716]">{totalPortions} Porsi</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/stock-in')}
          >
            Batal
          </Button>
          <Button type="submit" variant="orange" size="md">
            <Save size={16} />
            <span>Simpan Stok Masuk</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
