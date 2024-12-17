import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BarcodeScanner from "react-qr-barcode-scanner";
import { Flashlight, FlashlightOff } from "lucide-react";

const BarcodeScannerComponent = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const [scanning, setScanning] = useState(false);
  const [torch, setTorch] = useState(false);

  const handleScan = (result: any) => {
    if (result) {
      onScan(result.text);
      setScanning(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const toggleTorch = () => {
    setTorch((prevTorch) => !prevTorch);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {scanning ? (
        <div className="relative w-full h-full">
          <BarcodeScanner
            onUpdate={(err, result) => {
              if (result) handleScan(result);
              else if (err) handleError(err);
            }}
            torch={torch}
          />
          <div className="absolute top-2 left-2">
            <button
              onClick={toggleTorch}
              className="p-2 rounded-full bg-gray-800 text-white shadow-md"
              aria-label="Toggle Torch"
            >
              {torch ? <Flashlight size={24} /> : <FlashlightOff size={24} />}
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button onClick={() => setScanning(false)}>
              Zakończ skanowanie
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setScanning(true)}>Rozpocznij skanowanie</Button>
      )}
    </div>
  );
};

export default BarcodeScannerComponent;
