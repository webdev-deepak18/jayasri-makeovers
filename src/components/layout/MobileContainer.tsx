export default function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center w-full font-sans text-neutral-900">
      {/* 
        This is the core constraint. The app acts like a mobile app 
        on all devices. Max width (max-w-md) ensures a phone-like aspect ratio.
      */}
      <div className="w-full max-w-md bg-white shadow-2xl relative min-h-screen overflow-x-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
