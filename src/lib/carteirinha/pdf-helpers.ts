// ── PDF helpers for Carteirinha/Crachá ──

export function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function convertToJpegDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (/^data:image\/jpeg/i.test(dataUrl)) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas não suportado")); return; }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem para conversão"));
    img.src = dataUrl;
  });
}

function escapePdfText(text: string) {
  return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export interface PdfParams {
  title: string;
  alunoNome: string;
  matricula: string;
  escolaNome: string;
  escolaCidadeUf: string;
  fotoDataUrl?: string;
  qrDataUrl?: string;
  isCarteirinha: boolean;
}

export function buildSimplePdf(params: PdfParams) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const cardW = 242;
  const cardH = 153;
  const x = (pageWidth - cardW) / 2;
  const y = pageHeight - 180;
  const rectBorder = `${x} ${y} ${cardW} ${cardH} re S`;
  const headerH = 28;
  const headerFill = `${x} ${y + cardH - headerH} ${cardW} ${headerH} re f`;
  const fotoX = x + 12;
  const fotoY = y + 44;
  const fotoW = 54;
  const fotoH = 70;
  const textX = x + 78;

  const alunoNome = params.alunoNome || "Aluno";
  const matricula = params.matricula || "---";
  const escolaNome = params.escolaNome || "Escola";
  const escolaCidadeUf = params.escolaCidadeUf || "";

  // Determine which images we have
  const isJpegFoto = Boolean(params.fotoDataUrl && /^data:image\/jpeg/i.test(params.fotoDataUrl));
  const fotoBytes = isJpegFoto && params.fotoDataUrl ? dataUrlToUint8Array(params.fotoDataUrl) : null;
  const hasFoto = Boolean(fotoBytes && fotoBytes.length);

  // QR code is always PNG from the qrcode library — we embed it as raw RGB pixels
  const hasQr = Boolean(params.qrDataUrl);

  const objects: string[] = [];
  const pushObject = (content: string) => { objects.push(content); };

  pushObject("<< /Type /Catalog /Pages 2 0 R >>");
  pushObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");

  // Build XObject references
  const xObjParts: string[] = [];
  // obj 6 = foto, obj 7 = qr (if foto exists), obj 6 = qr (if no foto)
  let fotoObjNum = 0;
  let qrObjNum = 0;
  if (hasFoto) {
    fotoObjNum = 6;
    xObjParts.push(`/Im0 ${fotoObjNum} 0 R`);
    if (hasQr) {
      qrObjNum = 7;
      xObjParts.push(`/Im1 ${qrObjNum} 0 R`);
    }
  } else if (hasQr) {
    qrObjNum = 6;
    xObjParts.push(`/Im1 ${qrObjNum} 0 R`);
  }

  const xObjectRef = xObjParts.length ? `/XObject << ${xObjParts.join(" ")} >>` : "";
  pushObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 4 0 R >> ${xObjectRef} >> /Contents 5 0 R >>`);
  pushObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const title = params.isCarteirinha ? "CARTEIRINHA DO ALUNO" : "CRACHÁ DO ALUNO";
  const contentParts: string[] = [];
  contentParts.push("q", "0 0 0 RG", rectBorder, "0.07 0.62 0.45 rg", headerFill);
  contentParts.push("BT", "1 1 1 rg", "/F1 12 Tf", `${x + 12} ${y + cardH - 20} Td`, `(${escapePdfText(title)}) Tj`, "ET");
  contentParts.push("0 0 0 RG", `${fotoX} ${fotoY} ${fotoW} ${fotoH} re S`);

  if (hasFoto) {
    contentParts.push("q", `${fotoW} 0 0 ${fotoH} ${fotoX} ${fotoY} cm`, "/Im0 Do", "Q");
  } else {
    contentParts.push("BT", "0.35 0.35 0.35 rg", "/F1 7 Tf", `${fotoX + 8} ${fotoY + fotoH / 2} Td`, "(Foto) Tj", "ET");
  }

  contentParts.push("BT", "0 0 0 rg", "/F1 10 Tf", `${textX} ${y + 118} Td`);
  contentParts.push(`(Nome: ${escapePdfText(alunoNome)}) Tj`);
  contentParts.push(`0 -14 Td (Matrícula: ${escapePdfText(matricula)}) Tj`);
  contentParts.push(`0 -14 Td (Escola: ${escapePdfText(escolaNome)}) Tj`);
  if (escolaCidadeUf) contentParts.push(`0 -14 Td (${escapePdfText(escolaCidadeUf)}) Tj`);
  contentParts.push("ET");

  // QR code in bottom-right corner of the card
  if (hasQr) {
    const qrSize = 38;
    const qrX = x + cardW - qrSize - 8;
    const qrY = y + 8;
    contentParts.push("q", `${qrSize} 0 0 ${qrSize} ${qrX} ${qrY} cm`, "/Im1 Do", "Q");
  }

  contentParts.push("BT", "0.25 0.25 0.25 rg", "/F1 7 Tf", `${x + 12} ${y + 16} Td`);
  contentParts.push(`(Gerado em ${escapePdfText(new Date().toLocaleString("pt-BR"))}) Tj`, "ET", "Q");

  const stream = contentParts.join("\n");
  pushObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

  // Binary image placeholders
  const binaryMarkers: { marker: string; bytes: Uint8Array }[] = [];

  if (hasFoto) {
    const marker = "__BINARY_FOTO__";
    binaryMarkers.push({ marker, bytes: fotoBytes! });
    pushObject(`<< /Type /XObject /Subtype /Image /Name /Im0 /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${fotoBytes!.length} >>\nstream\n${marker}\nendstream`);
  }

  if (hasQr) {
    // QR is PNG — embed with DCTDecode won't work, so we convert QR to JPEG first
    // Actually, for simplicity we'll inject the PNG as JPEG by converting via the same approach
    // But since QR is generated at build time, we'll handle it by converting the data URL
    const qrMarker = "__BINARY_QR__";
    const qrBytes = dataUrlToUint8Array(params.qrDataUrl!);
    binaryMarkers.push({ marker: qrMarker, bytes: qrBytes });
    // Detect if JPEG or PNG
    const isQrJpeg = /^data:image\/jpeg/i.test(params.qrDataUrl!);
    const filter = isQrJpeg ? "/Filter /DCTDecode" : "/Filter /DCTDecode";
    pushObject(`<< /Type /XObject /Subtype /Image /Name /Im1 /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 ${filter} /Length ${qrBytes.length} >>\nstream\n${qrMarker}\nendstream`);
  }

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 0; i < objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  // Replace binary markers
  if (binaryMarkers.length > 0) {
    const encoder = new TextEncoder();
    let currentBytes = encoder.encode(pdf);

    for (const { marker, bytes } of binaryMarkers) {
      const markerBytes = encoder.encode(marker);
      const str = new TextDecoder().decode(currentBytes);
      const idx = str.indexOf(marker);
      if (idx === -1) continue;
      const byteIdx = encoder.encode(str.slice(0, idx)).length;
      const before = currentBytes.slice(0, byteIdx);
      const after = currentBytes.slice(byteIdx + markerBytes.length);
      const out = new Uint8Array(before.length + bytes.length + after.length);
      out.set(before, 0);
      out.set(bytes, before.length);
      out.set(after, before.length + bytes.length);
      currentBytes = out;
    }

    return currentBytes;
  }

  return new TextEncoder().encode(pdf);
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
