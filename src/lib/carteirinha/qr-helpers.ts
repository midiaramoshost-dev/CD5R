import QRCode from "qrcode";
import { convertToJpegDataUrl } from "./pdf-helpers";

export interface QrData {
  nome: string;
  matricula: string;
  escola: string;
}

export function buildQrPayload(data: QrData): string {
  return JSON.stringify({
    tipo: "carteirinha_aluno",
    nome: data.nome,
    matricula: data.matricula,
    escola: data.escola,
    emitido: new Date().toISOString().slice(0, 10),
  });
}

/**
 * Generate a QR code as a data URL (PNG).
 */
export async function generateQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: 200,
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}

/**
 * Generate a QR code as JPEG data URL (for PDF embedding via DCTDecode).
 */
export async function generateQrJpegDataUrl(payload: string): Promise<string> {
  const pngDataUrl = await generateQrDataUrl(payload);
  return convertToJpegDataUrl(pngDataUrl);
}
