import { useEffect, useState } from "react";
import * as Updates from "expo-updates";

export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "done"
  | "error";

export const useAppUpdate = () => {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    // Jangan jalankan saat development
    if (__DEV__) return;
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      setStatus("checking");
      const result = await Updates.checkForUpdateAsync();

      if (result.isAvailable) {
        setStatus("available");
        setUpdateMessage("Pembaruan baru tersedia! Restart untuk menerapkan.");
      } else {
        setStatus("idle");
      }
    } catch {
      // Gagal cek update — abaikan saja, tidak perlu ganggu user
      setStatus("idle");
    }
  };

  const downloadAndRestart = async () => {
    try {
      setStatus("downloading");
      await Updates.fetchUpdateAsync();
      setStatus("done");
      // Tunggu sebentar agar animasi selesai, baru restart
      setTimeout(async () => {
        await Updates.reloadAsync();
      }, 1000);
    } catch {
      setStatus("error");
      setUpdateMessage("Gagal mengunduh pembaruan. Coba lagi nanti.");
    }
  };

  const dismiss = () => {
    setStatus("idle");
    setUpdateMessage("");
  };

  return { status, updateMessage, downloadAndRestart, dismiss };
};
