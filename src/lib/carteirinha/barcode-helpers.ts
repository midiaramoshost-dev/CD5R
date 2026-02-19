import JsBarcode from "jsbarcode";

/**
 * Generate a barcode as a data URL (PNG) from a text value.
 * Uses Code128 encoding by default.
 */
export function generateBarcodeDataUrl(
  value: string,
  options?: {
    width?: number;
    height?: number;
    fontSize?: number;
    displayValue?: boolean;
    format?: string;
  }
): string {
  const canvas = document.createElement("canvas");
  try {
    JsBarcode(canvas, value, {
      format: options?.format || "CODE128",
      width: options?.width || 1.5,
      height: options?.height || 30,
      fontSize: options?.fontSize || 10,
      displayValue: options?.displayValue ?? true,
      margin: 2,
      background: "#ffffff",
      lineColor: "#000000",
    });
    return canvas.toDataURL("image/png");
  } catch {
    // Fallback for invalid characters
    JsBarcode(canvas, "000000", {
      format: "CODE128",
      width: 1.5,
      height: 30,
      fontSize: 10,
      displayValue: true,
      margin: 2,
    });
    return canvas.toDataURL("image/png");
  }
}
