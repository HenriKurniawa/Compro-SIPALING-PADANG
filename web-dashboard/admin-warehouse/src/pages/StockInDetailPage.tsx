import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWarehouse, rupiah } from '../context/WarehouseContext';
import { Card, Button, Table, Modal } from '../components/ui';
import type { Column } from '../components/ui';
import type { StockInItem } from '../types';
import { ArrowLeft, Clock, Trash2, Printer } from 'lucide-react';

export const StockInDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { stockIns, menus, deleteStockIn } = useWarehouse();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const batch = stockIns.find((b) => b.id === id);

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-lg font-extrabold text-[#4A1515]">Batch Tidak Ditemukan</h2>
        <p className="text-xs text-[#7A534B] mt-1">
          Data batch stok masuk dengan ID "{id}" tidak tersedia.
        </p>
        <Button variant="orange" size="sm" className="mt-4" onClick={() => navigate('/stock-in')}>
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const totalPortions = batch.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const handleDelete = () => {
    deleteStockIn(batch.id);
    navigate('/stock-in');
  };

  const columns: Column<StockInItem>[] = [
    {
      header: 'Nama Menu',
      accessor: 'menu',
      render: (item) => <span className="font-extrabold text-[#4A1515]">{item.menu}</span>,
    },
    {
      header: 'Harga Satuan',
      render: (item) => {
        const menuItem = menus.find((m) => m.name === item.menu);
        return (
          <span className="text-xs text-[#7A534B]">
            {menuItem ? rupiah(menuItem.price) : '-'}
          </span>
        );
      },
    },
    {
      header: 'Jumlah Porsi',
      align: 'right',
      render: (item) => (
        <span className="font-extrabold text-[#331A15]">{item.qty} Porsi</span>
      ),
    },
    {
      header: 'Subtotal Nilai',
      align: 'right',
      render: (item) => {
        const menuItem = menus.find((m) => m.name === item.menu);
        const subtotal = (menuItem?.price || 0) * item.qty;
        return <span className="font-bold text-[#F47716]">{rupiah(subtotal)}</span>;
      },
    },
  ];

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#4A1515]">Detail Batch {batch.id}</h1>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                Telah Diterima
              </span>
            </div>
            <p className="text-xs text-[#7A534B] flex items-center gap-1 mt-0.5">
              <Clock size={12} /> {batch.date} pukul {batch.time} WIB · Petugas: {batch.by}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            title="Cetak Surat Penerimaan"
          >
            <Printer size={15} />
            <span>Cetak</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            title="Hapus Batch"
          >
            <Trash2 size={15} />
            <span>Hapus</span>
          </Button>
        </div>
      </div>

      {/* Rincian Menu Table */}
      <Card title="Rincian Makanan Matang Diterima">
        <Table
          columns={columns}
          data={batch.items}
          keyExtractor={(item) => item.menu}
        />

        <div className="mt-4 p-4 rounded-2xl bg-[#FFFBF5] border border-[#EADBCE] flex items-center justify-between">
          <span className="text-sm font-extrabold text-[#4A1515]">Total Porsi Dalam Batch:</span>
          <span className="text-xl font-black text-[#F47716]">{totalPortions} Porsi</span>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Batch Stok Masuk"
        subtitle={`ID Batch: ${batch.id}`}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Ya, Hapus Data
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#331A15] leading-relaxed">
          Apakah kamu yakin ingin menghapus data batch stok masuk ini? Penghapusan akan mengurangi
          stok gudang sebesar <strong className="font-bold">{totalPortions} porsi</strong>.
        </p>
      </Modal>
    </div>
  );
};
