import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";
export type Mode = "extract" | "convert";
export interface ImageResult {
  id: string;
  page: number;
  sequence: number;
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: "png" | "jpg";
  hash: string;
  duplicate: boolean;
  reencoded: boolean;
}
export interface Job {
  signal: AbortSignal;
  controller?: AbortController;
  render?: RenderTask;
}
export const MAX_PIXELS = 24_000_000;
export const MAX_TOTAL_BYTES = 256 * 1024 * 1024;
export function check(signal: AbortSignal) {
  if (signal.aborted)
    throw new DOMException("Operación cancelada", "AbortError");
}
export function parsePages(value: string, total: number): number[] {
  if (!value.trim()) {
    if (total > 1000)
      throw new Error(
        "Procesa como máximo 1000 páginas por lote. Escribe un intervalo más pequeño.",
      );
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const selected = new Set<number>();
  if (value.length > 10000) throw new Error("El intervalo es demasiado largo.");
  for (const token of value.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match)
      throw new Error("Usa un intervalo como 1-3,5, sin comas vacías.");
    const a = Number(match[1]),
      b = Number(match[2] ?? a);
    if (
      !Number.isSafeInteger(a) ||
      !Number.isSafeInteger(b) ||
      a < 1 ||
      b < a ||
      b > total
    )
      throw new Error(`Elige páginas entre 1 y ${total}, en orden ascendente.`);
    if (b - a + 1 > 1000)
      throw new Error("Procesa como máximo 1000 páginas por lote.");
    for (let n = a; n <= b; n++) selected.add(n);
    if (selected.size > 1000)
      throw new Error("Procesa como máximo 1000 páginas por lote.");
  }
  return [...selected].sort((a, b) => a - b);
}
export async function pdfLibrary() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/${pdfjs.version}/pdf.worker.min.mjs`;
  return pdfjs;
}
export function pdfOptions(version: string) {
  const base = `/pdfjs/${version}/`;
  return {
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    iccUrl: `${base}iccs/`,
    isEvalSupported: false,
    stopAtErrors: true,
    canvasMaxAreaInBytes: MAX_PIXELS * 4,
  };
}
export function canvasFor(width: number, height: number) {
  width = Math.ceil(width);
  height = Math.ceil(height);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1 ||
    width > 16384 ||
    height > 16384 ||
    width * height > MAX_PIXELS
  )
    throw new Error(
      "La imagen supera el límite de 24 megapíxeles o 16384 px por lado. Reduce la escala o elige otra página.",
    );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
export async function canvasBlob(
  canvas: HTMLCanvasElement,
  format: "png" | "jpg",
  quality = 0.9,
) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(
              new Error("No se pudo crear la imagen. Prueba con menor escala."),
            ),
      format === "jpg" ? "image/jpeg" : "image/png",
      quality,
    ),
  );
}
export async function renderPage(
  page: PDFPageProxy,
  scale: number,
  format: "png" | "jpg",
  quality: number,
  job: Job,
) {
  check(job.signal);
  const viewport = page.getViewport({ scale });
  const canvas = canvasFor(viewport.width, viewport.height);
  try {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Tu navegador no puede crear el lienzo.");
    job.render = page.render({
      canvas,
      canvasContext: context,
      viewport,
      background: "#ffffff",
    });
    await job.render.promise;
    check(job.signal);
    return {
      blob: await canvasBlob(canvas, format, quality),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    job.render = undefined;
    canvas.width = canvas.height = 0;
  }
}
interface PdfImage {
  width: number;
  height: number;
  bitmap?: ImageBitmap;
  data?: Uint8Array | Uint8ClampedArray;
  kind?: number;
}
export async function imageBlob(image: PdfImage) {
  if (!image) throw new Error("Objeto de imagen no disponible.");
  const { width, height, data, kind, bitmap } = image;
  const canvas = canvasFor(width, height);
  try {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo crear el lienzo.");
    if (bitmap) context.drawImage(bitmap, 0, 0);
    else if (data) {
      const pixels = new Uint8ClampedArray(width * height * 4);
      if (kind === 3) {
        if (data.length !== pixels.length)
          throw new Error("Datos RGBA incompletos.");
        pixels.set(data);
      } else if (kind === 2) {
        if (data.length !== width * height * 3)
          throw new Error("Datos RGB incompletos.");
        for (let i = 0, j = 0; i < pixels.length; i += 4, j += 3) {
          pixels[i] = data[j];
          pixels[i + 1] = data[j + 1];
          pixels[i + 2] = data[j + 2];
          pixels[i + 3] = 255;
        }
      } else if (kind === 1) {
        const stride = Math.ceil(width / 8);
        if (data.length < stride * height)
          throw new Error("Datos monocromos incompletos.");
        for (let y = 0; y < height; y++)
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4,
              v = data[y * stride + (x >> 3)] & (128 >> (x % 8)) ? 255 : 0;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
            pixels[i + 3] = 255;
          }
      } else if (data.length === width * height) {
        for (let i = 0; i < data.length; i++) {
          pixels[i * 4] = pixels[i * 4 + 1] = pixels[i * 4 + 2] = data[i];
          pixels[i * 4 + 3] = 255;
        }
      } else
        throw new Error(
          `Representación de imagen no compatible (tipo ${kind ?? "desconocido"}).`,
        );
      context.putImageData(new ImageData(pixels, width, height), 0, 0);
    } else
      throw new Error(
        "La imagen no contiene píxeles decodificados compatibles.",
      );
    return { blob: await canvasBlob(canvas, "png"), width, height };
  } finally {
    canvas.width = canvas.height = 0;
  }
}
function objectFor(
  page: PDFPageProxy,
  id: string,
  signal: AbortSignal,
): Promise<PdfImage> {
  return new Promise((resolve, reject) => {
    const store = id.startsWith("g_") ? page.commonObjs : page.objs;
    const timeout = setTimeout(
      () => finish(new Error("El objeto no pudo decodificarse a tiempo.")),
      15000,
    );
    const abort = () => finish(new DOMException("Cancelado", "AbortError"));
    const finish = (error?: unknown, value?: PdfImage) => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      if (error) reject(error);
      else resolve(value!);
    };
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) {
      abort();
      return;
    }
    try {
      store.get(
        id,
        (value: PdfImage) => finish(undefined, value),
        (error: unknown) => finish(error),
      );
    } catch (e) {
      finish(e);
    }
  });
}
export async function extractPage(
  page: PDFPageProxy,
  job: Job,
  onImage: (
    image: { blob: Blob; width: number; height: number },
    sequence: number,
  ) => Promise<void>,
  issues: string[],
) {
  const { OPS } = await pdfLibrary();
  const ops = await page.getOperatorList();
  check(job.signal);
  let seq = 0;
  for (let i = 0; i < ops.fnArray.length; i++) {
    check(job.signal);
    const op = ops.fnArray[i],
      args = ops.argsArray[i];
    try {
      let img: PdfImage | undefined;
      if (op === OPS.paintImageXObject || op === OPS.paintImageXObjectRepeat)
        img = await objectFor(page, args[0], job.signal);
      else if (op === OPS.paintInlineImageXObject) img = args[0];
      else if (op === OPS.paintInlineImageXObjectGroup) {
        issues.push(
          `Página ${page.pageNumber}, objeto ${i + 1}: grupo de imágenes inline no compatible; convierte la página.`,
        );
        continue;
      } else if (
        [
          OPS.paintImageMaskXObject,
          OPS.paintImageMaskXObjectGroup,
          OPS.paintImageMaskXObjectRepeat,
          OPS.paintSolidColorImageMask,
        ].includes(op)
      ) {
        issues.push(
          `Página ${page.pageNumber}, objeto ${i + 1}: máscara de color dependiente de la composición; no se exportó por separado.`,
        );
        continue;
      }
      if (img) {
        seq++;
        await onImage(await imageBlob(img), seq);
      }
    } catch (error) {
      check(job.signal);
      issues.push(
        `Página ${page.pageNumber}, objeto ${i + 1}: ${error instanceof Error ? error.message : "no compatible"}`,
      );
    }
  }
}
export async function makeResult(
  image: { blob: Blob; width: number; height: number },
  page: number,
  sequence: number,
  mode: Mode,
  format: "png" | "jpg",
  seen: Set<string>,
): Promise<ImageResult> {
  const hash = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", await image.blob.arrayBuffer()),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
  const duplicate = seen.has(hash);
  seen.add(hash);
  const p = String(page).padStart(3, "0"),
    s = String(sequence).padStart(3, "0");
  return {
    ...image,
    id: `${mode}-${p}-${s}`,
    page,
    sequence,
    format,
    hash,
    duplicate,
    reencoded: mode === "extract",
    name:
      mode === "extract"
        ? `pachapdf_extract_p${p}_img${s}.png`
        : `pachapdf_page_${p}.${format}`,
    url: URL.createObjectURL(image.blob),
  };
}
export function releaseResults(results: ImageResult[]) {
  for (const r of results) URL.revokeObjectURL(r.url);
}
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export type { PDFDocumentProxy };
