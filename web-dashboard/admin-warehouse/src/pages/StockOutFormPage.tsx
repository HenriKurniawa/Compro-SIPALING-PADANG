import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { Card, Button, Select, Input } from '../components/ui';
import { ArrowLeft, Save, Plus, Minus, AlertCircle } from 'lucide-react';

export const StockOutFormPage: React.FC = () => {
  const { riders, menus, warehouseStock, addStockOut } = useWarehouse();
  const navigate = useNavigate();

  const now = new Date();
  const defaultDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const [date, setDate] = useState(defaultDate);
  const [selectedRiderId, setSelectedRiderId] = useState(riders[0]?.id || '');
  const status: 'Berjalan' = 'Berjalan';

  const selectedRider = riders.find((r) => r.id === selectedRiderId);

  // Quantities
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    menus.forEach((m) => {
      initial[m.name] = 0;
    });
    return initial;
  });

  const [error, setError] = useState('');

  const handleQtyChange = (menuName: string, val: number) => {
    const available = warehouseStock[menuName] || 0;
    const clamped = Math.max(0, Math.min(val, available));
    setQuantities((prev) => ({
      ...prev,
      [menuName]: clamped,
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

    if (!selectedRider) {
      setError('Harap pilih rider tujuan alokasi.');
      return;
    }

    addStockOut({
      date,
      riderId: selectedRider.id,
      gerobak: selectedRider.gerobak,
      status,
      items,
    });

    navigate('/stock-out');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/stock-out')}
            className="p-2 rounded-xl bg-white border border-[#EADBCE] text-[#331A15] hover:bg-[#FAF6F0] cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#4A1515]">Form Alokasi Stok ke Rider</h1>
            <p className="text-xs text-[#7A534B]">
              Distribusikan stok makanan matang gudang ke gerobak keliling rider.
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
        {/* Info Rider Card */}
        <Card title="Penerima Alokasi & Tanggal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Pilih Rider"
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              options={riders.map((r) => ({
                value: r.id,
                label: `${r.name} (${r.gerobak})`,
              }))}
            />

            <Input
              label="Nomor Gerobak"
              value={selectedRider?.gerobak || '-'}
              readOnly
              className="bg-[#FAF6F0]"
            />

            <Input
              label="Tanggal Alokasi"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </Card>

        {/* Input Jumlah Menu */}
        <Card
          title="Rincian Menu Yang Dialokasikan"
          subtitle="Masukkan porsi yang dibebankan ke gerobak (maksimum sesuai stok gudang)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menus.map((menu) => {
              const currentQty = quantities[menu.name] || 0;
              const available = warehouseStock[menu.name] || 0;

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
                      Tersedia di Gudang:{' '}
                      <strong className="text-[#F47716] font-bold">{available} porsi</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(menu.name, currentQty - 5)}
                      disabled={currentQty <= 0}
                      className="w-8 h-8 rounded-lg border border-[#EADBCE] bg-white text-[#4A1515] font-bold flex items-center justify-center hover:bg-[#FAF6F0] disabled:opacity-40 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>

                    <input
                      type="number"
                      min={0}
                      max={available}
                      value={currentQty === 0 ? '' : currentQty}
                      placeholder="0"
                      onChange={(e) => handleQtyChange(menu.name, parseInt(e.target.value) || 0)}
                      className="w-16 py-1 px-2 text-center text-sm font-extrabold rounded-lg border border-[#EADBCE] bg-white text-[#331A15] outline-none focus:border-[#F47716]"
                    />

                    <button
                      type="button"
                      onClick={() => handleQtyChange(menu.name, currentQty + 5)}
                      disabled={currentQty >= available}
                      className="w-8 h-8 rounded-lg border border-[#EADBCE] bg-white text-[#4A1515] font-bold flex items-center justify-center hover:bg-[#FAF6F0] disabled:opacity-40 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#FFF5EC] border border-[#F8D7C4] flex items-center justify-between">
            <span className="text-sm font-extrabold text-[#4A1515]">Total Porsi Alokasi:</span>
            <span className="text-xl font-black text-[#F47716]">{totalPortions} Porsi</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/stock-out')}
          >
            Batal
          </Button>
          <Button type="submit" variant="orange" size="md">
            <Save size={16} />
            <span>Simpan & Alokasikan</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
