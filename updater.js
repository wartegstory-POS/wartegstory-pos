import { Capacitor } from "@capacitor/core";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

const REPO = "wartegstory-POS/wartegstory-pos";
const LOCAL_VERSION = __WEB_VERSION__;

function newer(remote, local) {
  const a = remote.split(".").map(Number);
  const b = local.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }

  return false;
}

async function checkUpdate(manual = false) {
  if (!Capacitor.isNativePlatform()) return;

  if (window.wartegUpdateBusy) return;
  window.wartegUpdateBusy = true;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { cache: "no-store" }
    );

    if (response.status === 404) {
      if (manual) alert("Belum ada rilis update.");
      return;
    }

    if (!response.ok) {
      throw new Error(`GitHub HTTP ${response.status}`);
    }

    const release = await response.json();
    const version = release.tag_name.replace(/^v/, "");

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error("Format versi release tidak valid.");
    }

    if (!newer(version, LOCAL_VERSION)) {
      if (manual) alert(`Versi ${LOCAL_VERSION} sudah terbaru.`);
      return;
    }

    const asset = release.assets.find(
      item => item.name === "web-update.zip"
    );

    if (!asset) {
      if (manual) alert("Paket pembaruan belum tersedia.");
      return;
    }

    if (!confirm(
      `Update ${version} tersedia.\n\nDownload sekarang?`
    )) return;

    const bundle = await CapacitorUpdater.download({
      url: asset.browser_download_url,
      version
    });

    if (confirm(
      "Update selesai didownload.\n\n" +
      "Selesaikan dan simpan transaksi sebelum lanjut.\n" +
      "Muat ulang aplikasi sekarang?"
    )) {
      await CapacitorUpdater.set({ id: bundle.id });
    }
  } catch (error) {
    console.error("Warteg updater:", error);

    if (manual) {
      alert("Update gagal: " + error.message);
    }
  } finally {
    window.wartegUpdateBusy = false;
  }
}

async function startUpdater() {
  if (!Capacitor.isNativePlatform()) return;

  await CapacitorUpdater.notifyAppReady();

  const button = document.createElement("button");
  button.textContent = `Cek Update • ${LOCAL_VERSION}`;
  button.style.cssText =
    "position:fixed;bottom:12px;right:12px;" +
    "z-index:99999;font-size:12px;padding:9px 12px;" +
    "background:#fff3e5;color:#76000b;" +
    "border:1px solid #a20013;border-radius:10px;";

  button.onclick = () => checkUpdate(true);
  document.body.appendChild(button);

  setTimeout(() => checkUpdate(false), 5000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    startUpdater().catch(console.error);
  }, { once: true });
} else {
  startUpdater().catch(console.error);
}
