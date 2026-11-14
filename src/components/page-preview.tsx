"use client";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "@/lib/pdf";
import { renderPage, type Job } from "@/lib/pdf";
export function PagePreview({
  pdf,
  page,
  checked,
  onChange,
}: {
  pdf: PDFDocumentProxy;
  page: number;
  checked: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const job: Job = { signal: controller.signal };
    let objectUrl = "";
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        try {
          const p = await pdf.getPage(page);
          const viewport = p.getViewport({ scale: 1 });
          const image = await renderPage(
            p,
            Math.min(140 / viewport.width, 160 / viewport.height),
            "jpg",
            0.65,
            job,
          );
          if (controller.signal.aborted) return;
          objectUrl = URL.createObjectURL(image.blob);
          setUrl(objectUrl);
        } catch {
          if (!controller.signal.aborted) setFailed(true);
        }
      },
      { rootMargin: "100px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      controller.abort();
      job.render?.cancel();
      observer.disconnect();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdf, page]);
  return (
    <div ref={ref} className="page-preview">
      {url ? (
        <img src={url} alt={`Vista de página ${page}`} loading="lazy" />
      ) : (
        <div style={{ height: 95, display: "grid", placeItems: "center" }}>
          {failed ? "Vista no disponible" : "Preparando vista…"}
        </div>
      )}
      <label className="check-label">
        <input type="checkbox" checked={checked} onChange={onChange} />
        Página {page}
      </label>
    </div>
  );
}
