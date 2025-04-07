import React, { useEffect, useState } from "react";
import Quagga from "quagga";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
}

const BarcodeScannerComponent: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();

  const handleDetected = (data: Quagga.BarCodeResult) => {
    if (data?.codeResult?.code) {
      onScan(data.codeResult.code);
      stopScanner();
      setScanning(false);
    }
  };

  const startScanner = (fallback = false) => {
    const constraints = fallback
      ? {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      : {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#barcode-scanner-preview") as Element,
          constraints,
        },
        decoder: {
          readers: [
            "ean_reader",
            "code_128_reader",
            "ean_8_reader",
            "upc_reader",
          ],
        },
        locate: true,
        locator: {
          patchSize: "large",
          halfSample: false,
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          stopScanner();

          if (err.name === "NotReadableError" && !fallback) {
            console.log("Przełączenie na user-facing kamerę...");
            startScanner(true);
          }

          return;
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(handleDetected);
  };

  const stopScanner = () => {
    try {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    } catch (err) {
      console.error("Error while stopping Quagga:", err);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        if (videoDevices.length > 0) {
          setDeviceId(videoDevices[videoDevices.length - 1].deviceId);
        }
      })
      .catch((err) => {
        console.error("enumerateDevices error:", err);
      });
  }, []);

  useEffect(() => {
    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {scanning ? (
        <div className="relative w-full h-full">
          <div
            id="barcode-scanner-preview"
            className="w-full h-96 bg-gray-800"
          />
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
