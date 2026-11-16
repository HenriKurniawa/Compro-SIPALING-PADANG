const panel = 'bg-white shadow-[0_2px_10px_rgba(61,17,13,0.14)]';

export const MapLegend = () => (
  <div className={`rounded-[14px] px-3.5 py-3.5 ${panel}`}>
    <p className="text-[13px] font-bold text-maroon-900">Keterangan</p>
    <ul className="mt-1.5 space-y-1.5 text-[13px] text-ink">
      <li className="flex items-center gap-2">
        <span className="size-3.5 rounded-[5px] bg-maroon-700" />
        Aktif (sedang bekerja)
      </li>
      <li className="flex items-center gap-2">
        <span className="size-3.5 rounded-[5px] bg-idle-dot" />
        Tidak aktif
      </li>
    </ul>
  </div>
);

export const ZoomControls = ({ onZoomIn, onZoomOut }: { onZoomIn: () => void; onZoomOut: () => void }) => (
  <div className={`flex w-11 flex-col overflow-hidden rounded-xl ${panel}`}>
    <button
      type="button"
      onClick={onZoomIn}
      aria-label="Perbesar peta"
      className="flex h-11 cursor-pointer items-center justify-center border-b border-sand text-[22px] font-bold text-maroon-900 hover:bg-cream"
    >
      +
    </button>
    <button
      type="button"
      onClick={onZoomOut}
      aria-label="Perkecil peta"
      className="flex h-11 cursor-pointer items-center justify-center text-[22px] font-bold text-maroon-900 hover:bg-cream"
    >
      −
    </button>
  </div>
);

export const ShowAllButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-11 cursor-pointer rounded-xl px-4 text-sm font-bold text-maroon-900 hover:bg-cream ${panel}`}
  >
    Tampilkan semua rider
  </button>
);
