"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import JSZip from "jszip";
import {
  Upload,
  ShieldCheck,
  UserRoundX,
  FileImage,
  Layers,
  ArrowRight,
  ArrowLeft,
  Download,
  FileText,
  Trash2,
  ImageOff,
  Lock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LandingSections } from "@/components/marketing";
import { PagePreview } from "@/components/page-preview";
import { bytes } from "@/lib/utils";
import {
  parsePages,
  pdfLibrary,
  pdfOptions,
  renderPage,
  extractPage,
  makeResult,
  releaseResults,
  download,
  check,
  MAX_TOTAL_BYTES,
  type PDFDocumentProxy,
  type ImageResult,
  type Job,
  type Mode,
} from "@/lib/pdf";
type View = "choose" | "settings" | "processing" | "results";
export function Workspace() {
  const [file, setFile] = useState<File | null>(null),
    [pdf, setPdf] = useState<PDFDocumentProxy | null>(null),
    [view, setView] = useState<View>("choose"),
    [mode, setMode] = useState<Mode>("extract");
  const [loading, setLoading] = useState(false),
    [dragging, setDragging] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false),
    [password, setPassword] = useState(""),
    [passwordError, setPasswordError] = useState(false);
  const [range, setRange] = useState(""),
    [format, setFormat] = useState<"png" | "jpg">("png"),
    [scale, setScale] = useState(1.5),
    [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ImageResult[]>([]),
    [issues, setIssues] = useState<string[]>([]),
    [completed, setCompleted] = useState(0),
    [total, setTotal] = useState(0),
    [outcome, setOutcome] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set()),
    [minWidth, setMinWidth] = useState(0),
    [minHeight, setMinHeight] = useState(0),
    [small, setSmall] = useState(0),
    [hideDuplicates, setHideDuplicates] = useState(false),
    [sort, setSort] = useState("page"),
    [reverse, setReverse] = useState(false);
  const [preview, setPreview] = useState<string | null>(null),
    [actual, setActual] = useState(false),
    [zipProgress, setZipProgress] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null),
    docRef = useRef<PDFDocumentProxy | null>(null),
    loadTask = useRef<PDFDocumentLoadingTask | null>(null),
    jobRef = useRef<Job | null>(null),
    generation = useRef(0),
    hasRunRef = useRef(false),
    resultRef = useRef<ImageResult[]>([]),
    passwordCallback = useRef<((value: string) => void) | null>(null),
    previewFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const epoch = generation;
    return () => {
      epoch.current++;
      jobRef.current?.controller?.abort();
      jobRef.current?.render?.cancel();
      void loadTask.current?.destroy();
      void docRef.current?.loadingTask.destroy();
      releaseResults(resultRef.current);
    };
  }, []);
  function navigate(next: View) {
    setView(next);
    const updateHistory =
      next === "results"
        ? history.replaceState.bind(history)
        : history.pushState.bind(history);
    updateHistory(
      { pachapdf: next },
      "",
      `#${next === "settings" ? mode : next}`,
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  useEffect(() => {
    function back() {
      if (jobRef.current || loadTask.current) {
        generation.current++;
        jobRef.current?.controller?.abort();
        jobRef.current?.render?.cancel();
        jobRef.current = null;
        void loadTask.current?.destroy();
        loadTask.current = null;
        setLoading(false);
        setPasswordOpen(false);
        setPassword("");
        setZipProgress(null);
        setMessage("Operación cancelada al volver atrás.");
      }
      if (!docRef.current) {
        setView("choose");
        return;
      }
      const hash = location.hash.slice(1);
      setPreview(null);
      if (hash === "extract" || hash === "convert") {
        setMode(hash);
        setView("settings");
      } else if (hash === "results" && hasRunRef.current) setView("results");
      else setView("choose");
    }
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  function clearResults() {
    hasRunRef.current = false;
    setCompleted(0);
    setTotal(0);
    releaseResults(resultRef.current);
    resultRef.current = [];
    setResults([]);
    setSelected(new Set());
    setPreview(null);
    setIssues([]);
    setMinWidth(0);
    setMinHeight(0);
    setSmall(0);
    setHideDuplicates(false);
    setReverse(false);
    setSort("page");
    setOutcome("");
  }
  function cancel() {
    generation.current++;
    const job = jobRef.current;
    jobRef.current = null;
    if (job) {
      job.controller?.abort();
      job.render?.cancel();
    }
    void loadTask.current?.destroy();
    loadTask.current = null;
    passwordCallback.current = null;
    setPasswordOpen(false);
    setPassword("");
    setLoading(false);
    setZipProgress(null);
    clearResults();
    setError("");
    setMessage("Procesamiento cancelado. Puedes volver a intentarlo.");
    setView(pdf ? "settings" : "choose");
  }
  function reset() {
    cancel();
    void docRef.current?.loadingTask.destroy();
    docRef.current = null;
    setPdf(null);
    setFile(null);
    setRange("");
    setMessage("");
    history.pushState({}, "", "/");
    setView("choose");
    requestAnimationFrame(() => document.getElementById("cargar-pdf")?.focus());
  }
  async function openFile(chosen: File) {
    cancel();
    void docRef.current?.loadingTask.destroy();
    docRef.current = null;
    setPdf(null);
    setFile(chosen);
    setRange("");
    setMessage("");
    setError("");
    setLoading(true);
    const id = ++generation.current;
    try {
      if (chosen.size > 150 * 1024 * 1024)
        throw new Error(
          "Este PDF supera el límite preventivo de 150 MB. Divide el documento localmente e inténtalo de nuevo.",
        );
      const signature = new Uint8Array(
        await chosen.slice(0, 1024).arrayBuffer(),
      );
      if (!new TextDecoder().decode(signature).includes("%PDF-"))
        throw new Error(
          "El archivo no contiene una firma PDF válida. Selecciona otro documento.",
        );
      const lib = await pdfLibrary();
      if (id !== generation.current) return;
      const data = new Uint8Array(await chosen.arrayBuffer());
      if (id !== generation.current) return;
      const task = lib.getDocument({ data, ...pdfOptions(lib.version) });
      loadTask.current = task;
      task.onPassword = (update: (value: string) => void, reason: number) => {
        if (id !== generation.current) return;
        passwordCallback.current = update;
        setPasswordError(reason === lib.PasswordResponses.INCORRECT_PASSWORD);
        setPasswordOpen(true);
      };
      const document = await task.promise;
      if (id !== generation.current) {
        await document.loadingTask.destroy();
        return;
      }
      loadTask.current = null;
      docRef.current = document;
      setPdf(document);
      setPasswordOpen(false);
      setPassword("");
      setLoading(false);
      navigate("choose");
    } catch (e) {
      if (id !== generation.current) return;
      loadTask.current = null;
      setLoading(false);
      setPasswordOpen(false);
      setError(
        e instanceof Error &&
          !["InvalidPDFException", "UnknownErrorException"].includes(e.name)
          ? e.message
          : "No pudimos abrir este PDF. Comprueba que el archivo no esté dañado y prueba otro documento.",
      );
      setFile(null);
    }
  }
  let rangeError = "";
  let pages: number[] = [];
  try {
    pages = pdf ? parsePages(range, pdf.numPages) : [];
  } catch (e) {
    rangeError = (e as Error).message;
  }
  function choose(next: Mode) {
    setMode(next);
    setMessage("");
    setError("");
    setView("settings");
    history.pushState({}, "", `#${next}`);
  }
  function togglePage(page: number) {
    const next = new Set(pages);
    if (next.has(page)) next.delete(page);
    else next.add(page);
    setRange(next.size ? [...next].sort((a, b) => a - b).join(",") : "0");
  }
  async function process() {
    if (!pdf || rangeError) return;
    clearResults();
    setError("");
    setMessage("");
    setCompleted(0);
    setTotal(pages.length);
    navigate("processing");
    const id = ++generation.current;
    const controller = new AbortController();

    const job: Job = { signal: controller.signal, controller };
    jobRef.current = job;
    const collected: ImageResult[] = [];
    const warnings: string[] = [];
    const seen = new Set<string>();
    let accumulated = 0;
    try {
      for (const number of pages) {
        check(job.signal);
        try {
          const page = await pdf.getPage(number);
          check(job.signal);
          async function add(
            image: { blob: Blob; width: number; height: number },
            seq: number,
          ) {
            check(job.signal);
            if (accumulated + image.blob.size > MAX_TOTAL_BYTES)
              throw new Error(
                "Los resultados alcanzaron el límite preventivo de 256 MB. Procesa menos páginas.",
              );
            const result = await makeResult(
              image,
              number,
              seq,
              mode,
              mode === "extract" ? "png" : format,
              seen,
            );
            if (job.signal.aborted) {
              URL.revokeObjectURL(result.url);
              check(job.signal);
            }
            accumulated += image.blob.size;
            collected.push(result);
          }
          if (mode === "convert")
            await add(await renderPage(page, scale, format, quality, job), 1);
          else await extractPage(page, job, add, warnings);
          page.cleanup();
        } catch (e) {
          check(job.signal);
          warnings.push(`Página ${number}: ${(e as Error).message}`);
        }
        if (id !== generation.current) return;
        setCompleted((n) => n + 1);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      check(job.signal);
      if (id !== generation.current) return;
      hasRunRef.current = true;
      resultRef.current = collected;
      setResults(collected);
      setIssues(warnings);
      setOutcome(
        warnings.length ? "partial" : collected.length ? "complete" : "empty",
      );
      setSelected(new Set());
      jobRef.current = null;
      navigate("results");
    } catch (e) {
      releaseResults(collected);
      if (id !== generation.current) return;
      jobRef.current = null;
      setError(
        `No se pudo completar el proceso: ${(e as Error).message}. Prueba con menos páginas o una escala menor.`,
      );
      setView("settings");
    }
  }
  const visible = useMemo(
    () =>
      results
        .filter(
          (r) =>
            r.width >= Math.max(minWidth, small) &&
            r.height >= Math.max(minHeight, small) &&
            (!hideDuplicates || !r.duplicate),
        )
        .sort((a, b) => {
          const diff =
            sort === "size"
              ? a.width * a.height - b.width * b.height
              : sort === "bytes"
                ? a.blob.size - b.blob.size
                : a.page - b.page || a.sequence - b.sequence;
          return (
            (diff || a.page - b.page || a.sequence - b.sequence) *
            (reverse ? -1 : 1)
          );
        }),
    [results, minWidth, minHeight, small, hideDuplicates, sort, reverse],
  );
  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const allVisible =
    visible.length > 0 && visible.every((r) => selected.has(r.id));
  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of visible) {
        if (allVisible) next.delete(r.id);
        else next.add(r.id);
      }
      return next;
    });
  }
  async function zip(items: ImageResult[]) {
    if (!items.length || zipProgress !== null) return;
    const id = ++generation.current;
    const controller = new AbortController();

    const job: Job = { signal: controller.signal, controller };
    jobRef.current = job;
    setZipProgress(0);
    setError("");
    try {
      const zip = new JSZip();
      for (const r of items) {
        check(job.signal);
        zip.file(r.name, await r.blob.arrayBuffer());
      }
      const blob = await zip.generateAsync(
        { type: "blob", compression: "STORE", streamFiles: true },
        (metadata) => {
          check(job.signal);
          if (id === generation.current) setZipProgress(metadata.percent);
        },
      );
      check(job.signal);
      if (id !== generation.current) return;
      const safe = (file?.name.replace(/\.pdf$/i, "") ?? "documento")
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 70);
      download(
        blob,
        `pachapdf_${safe}_${mode}_${new Date().toISOString().slice(0, 10)}.zip`,
      );
      setMessage(`ZIP preparado con ${items.length} imágenes.`);
    } catch (e) {
      if (id === generation.current)
        setError(`No se pudo crear el ZIP: ${(e as Error).message}`);
    } finally {
      if (id === generation.current) {
        setZipProgress(null);
        jobRef.current = null;
      }
    }
  }
  function cancelZip() {
    generation.current++;
    jobRef.current?.controller?.abort();
    jobRef.current = null;
    setZipProgress(null);
    setMessage("Creación de ZIP cancelada. Los resultados siguen disponibles.");
  }
  const previewIndex = results.findIndex((r) => r.id === preview),
    current = results[previewIndex];
  const fileInput = (
    <input
      ref={input}
      id="pdf-input"
      tabIndex={-1}
      className="sr-only"
      type="file"
      accept="application/pdf,.pdf"
      aria-label="Seleccionar archivo PDF"
      onChange={(e) => {
        const chosen = e.target.files?.[0];
        e.target.value = "";
        if (chosen) void openFile(chosen);
      }}
    />
  );
  const notice = (
    <>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
    </>
  );
  const summary = pdf && file && (
    <div className="panel file-summary">
      <span className="file-icon">
        <FileText size={26} />
      </span>
      <div className="file-meta">
        <strong>{file.name}</strong>
        <p>
          {bytes(file.size)} · {pdf.numPages}{" "}
          {pdf.numPages === 1 ? "página" : "páginas"} · PDF local
        </p>
      </div>
      <div className="row">
        <Button variant="outline" onClick={() => input.current?.click()}>
          Cambiar PDF
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quitar PDF"
          onClick={reset}
        >
          <Trash2 size={19} />
        </Button>
      </div>
    </div>
  );
  return (
    <main id="main" className={!pdf ? "landing-main" : "workspace shell"}>
      {fileInput}
      {!pdf ? (
        <>
          <div className="shell">
            <section className="hero">
              <div className="eyebrow">HERRAMIENTAS PDF EN TU NAVEGADOR</div>
              <h1>
                Tus PDF, tus imágenes,
                <br />
                <span>tu privacidad.</span>
              </h1>
              <p>
                Extrae las imágenes de tus documentos o convierte cada página en
                PNG o JPG, sin subir archivos a ningún servidor.
              </p>
            </section>
            <section
              id="cargar-pdf"
              tabIndex={-1}
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files.length !== 1) {
                  setError("Selecciona un solo PDF a la vez.");
                  return;
                }
                void openFile(e.dataTransfer.files[0]);
              }}
              aria-label="Cargar PDF"
            >
              <div className="upload-icon">
                <Upload size={27} />
              </div>
              <h2>{loading ? "Abriendo tu PDF…" : "Arrastra un PDF aquí"}</h2>
              <p>
                {loading
                  ? "Comprobando el documento en tu navegador"
                  : "o selecciona un archivo desde tu dispositivo"}
              </p>
              <Button
                onClick={() => (loading ? cancel() : input.current?.click())}
              >
                <Upload size={17} />
                {loading ? "Cancelar carga" : "Seleccionar PDF"}
              </Button>
              <small>
                <Lock size={13} />
                El archivo se procesa únicamente en tu navegador
              </small>
            </section>
            <div className="privacy-row">
              <span>
                <ShieldCheck size={15} />
                Sin subidas a la red
              </span>
              <span>
                <Download size={15} />
                Descargas locales
              </span>
              <span>
                <UserRoundX size={15} />
                Sin registro
              </span>
            </div>
            <div aria-live="polite">{notice}</div>
          </div>
          <div style={{ marginTop: 70 }}>
            <LandingSections />
          </div>
        </>
      ) : (
        <>
          <div className="step-label">
            ARCHIVO <span aria-hidden="true"> / </span> HERRAMIENTA{" "}
            <span aria-hidden="true"> / </span> RESULTADOS
          </div>
          <div aria-live="polite">{notice}</div>
          {view !== "processing" && summary}
          {view === "choose" && (
            <>
              <div className="workspace-head">
                <div>
                  <h1>¿Qué quieres hacer con tu PDF?</h1>
                  <p>Elige una herramienta. Tu documento se queda contigo.</p>
                </div>
              </div>
              <div className="tools">
                <button className="tool-card" onClick={() => choose("extract")}>
                  <FileImage size={31} />
                  <h2>Extraer imágenes</h2>
                  <p>
                    Recupera objetos de imagen incrustados, con sus dimensiones
                    disponibles. Exportación reconstruida en PNG.
                  </p>
                  <span>
                    Elegir extracción{" "}
                    <ArrowRight size={16} className="inline" />
                  </span>
                </button>
                <button className="tool-card" onClick={() => choose("convert")}>
                  <Layers size={31} />
                  <h2>Convertir páginas</h2>
                  <p>
                    Transforma cada página completa, con texto y gráficos, en
                    una imagen PNG o JPG.
                  </p>
                  <span>
                    Elegir conversión{" "}
                    <ArrowRight size={16} className="inline" />
                  </span>
                </button>
              </div>
              <p className="text-sm">
                <ShieldCheck size={16} className="inline" /> Sin servicios
                externos ni guardado permanente de documentos.{" "}
                <a href="/help/#privacidad">Conoce cómo funciona</a>.
              </p>
            </>
          )}
          {view === "settings" && (
            <>
              <div className="workspace-head">
                <div>
                  <h1>
                    {mode === "extract"
                      ? "Extraer imágenes"
                      : "Convertir páginas"}
                  </h1>
                  <p>Configura la salida y elige las páginas que necesitas.</p>
                </div>
                <Button variant="ghost" onClick={() => navigate("choose")}>
                  <ArrowLeft size={16} />
                  Cambiar herramienta
                </Button>
              </div>
              <div className="settings-grid">
                <section className="panel">
                  <h2 className="text-xl mb-6">Opciones de procesamiento</h2>
                  <label className="field">
                    Páginas a procesar
                    <Input
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                      placeholder="Todas · ej. 1-3,5"
                      aria-invalid={!!rangeError}
                      aria-describedby="range-help"
                    />
                  </label>
                  <p id="range-help" className="text-xs">
                    Deja el campo vacío para todas las páginas. Ejemplo: 1-3,5.
                  </p>
                  {rangeError && (
                    <p className="notice error" role="alert">
                      {rangeError}
                    </p>
                  )}
                  {mode === "convert" ? (
                    <>
                      <div className="row">
                        <label className="field flex-1">
                          Formato
                          <select
                            aria-label="Formato"
                            value={format}
                            onChange={(e) =>
                              setFormat(e.target.value as "png" | "jpg")
                            }
                          >
                            <option value="png">
                              PNG · sin pérdida adicional
                            </option>
                            <option value="jpg">
                              JPG · archivo más ligero
                            </option>
                          </select>
                        </label>
                        <label className="field flex-1">
                          Escala
                          <select
                            aria-label="Escala"
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                          >
                            <option value="1">1× · 72 ppp</option>
                            <option value="1.5">1.5× · 108 ppp</option>
                            <option value="2">2× · 144 ppp</option>
                          </select>
                        </label>
                      </div>
                      {format === "jpg" && (
                        <label className="field">
                          Calidad JPG: {Math.round(quality * 100)} %
                          <input
                            type="range"
                            min=".5"
                            max="1"
                            step=".05"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                          />
                        </label>
                      )}
                      <div className="notice">
                        Más escala aumenta la resolución, la memoria y el peso.
                        Máximo preventivo: 24 megapíxeles por imagen y 256 MB de
                        resultados.
                      </div>
                    </>
                  ) : (
                    <div className="notice">
                      Busca imágenes incrustadas, sin renderizar la página. Los
                      píxeles decodificados se reconstruyen y exportan en PNG;
                      no se recupera universalmente el archivo original.
                      Vectores, máscaras de color y algunos grupos no son
                      extraíbles. <a href="/help/">Ver limitaciones</a>.
                    </div>
                  )}
                  <Button
                    disabled={!!rangeError || !pages.length}
                    onClick={() => void process()}
                  >
                    {mode === "extract" ? (
                      <FileImage size={18} />
                    ) : (
                      <Layers size={18} />
                    )}{" "}
                    {mode === "extract"
                      ? "Extraer imágenes"
                      : "Convertir páginas"}{" "}
                    · {pages.length}
                  </Button>
                </section>
                <section className="panel">
                  <h2 className="text-xl mb-2">Páginas del documento</h2>
                  <p className="text-xs">
                    Vista progresiva. Marca las páginas para ajustar el
                    intervalo.
                  </p>
                  <div className="page-previews">
                    {Array.from(
                      { length: Math.min(pdf.numPages, 200) },
                      (_, i) => (
                        <PagePreview
                          key={i}
                          pdf={pdf}
                          page={i + 1}
                          checked={pages.includes(i + 1)}
                          onChange={() => togglePage(i + 1)}
                        />
                      ),
                    )}
                  </div>
                  {pdf.numPages > 200 && (
                    <p className="text-xs mt-3">
                      Se muestran las primeras 200 vistas. Puedes procesar las
                      demás con el campo de páginas.
                    </p>
                  )}
                </section>
              </div>
            </>
          )}
          {view === "processing" && (
            <section className="panel progress-panel" aria-live="polite">
              <Layers size={38} />
              <h1>Estamos procesando tu PDF</h1>
              <p>{file?.name}</p>
              <p>
                {mode === "extract"
                  ? "Extracción de objetos de imagen"
                  : "Conversión de páginas"}{" "}
                · {completed} de {total} páginas completadas
              </p>
              <Progress
                value={total ? (completed / total) * 100 : 0}
                aria-label="Páginas completadas"
              />
              <p className="text-sm mt-4">
                El avance corresponde a páginas completadas, no a una estimación
                de tiempo.
              </p>
              <Button variant="outline" onClick={cancel}>
                Cancelar procesamiento
              </Button>
            </section>
          )}
          {view === "results" && (
            <>
              <div className="workspace-head">
                <div>
                  <h1>
                    {outcome === "partial"
                      ? "Resultados parciales"
                      : results.length
                        ? "Tus imágenes están listas"
                        : "Sin imágenes extraíbles"}
                  </h1>
                  <p>
                    {results.length} imágenes · {completed} páginas analizadas
                    {mode === "extract"
                      ? " · Exportaciones PNG reconstruidas"
                      : ""}
                  </p>
                </div>
                <div className="row">
                  <Button
                    variant="outline"
                    onClick={() => navigate("settings")}
                  >
                    <ArrowLeft size={16} />
                    Ajustar opciones
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("choose")}>
                    Cambiar herramienta
                  </Button>
                  <Button variant="ghost" onClick={reset}>
                    Nuevo PDF
                  </Button>
                </div>
              </div>
              {issues.length > 0 && (
                <details className="notice" open={!results.length}>
                  <summary>
                    {issues.length} incidencias · revisa las limitaciones y
                    vuelve a intentar
                  </summary>
                  <ul>
                    {issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </details>
              )}
              {!results.length ? (
                <section className="panel empty-state">
                  <ImageOff size={42} />
                  <h2>
                    {issues.length
                      ? mode === "extract"
                        ? "No pudimos extraer resultados compatibles"
                        : "No pudimos convertir las páginas"
                      : "No encontramos imágenes extraíbles en este PDF"}
                  </h2>
                  <p>
                    {issues.length
                      ? "Hubo incidencias reales durante el procesamiento. Revisa el detalle o convierte las páginas completas."
                      : "Este documento podría contener sólo texto o gráficos vectoriales. Convierte sus páginas para obtener la composición completa."}
                  </p>
                  <Button onClick={() => choose("convert")}>
                    Convertir páginas
                  </Button>
                </section>
              ) : (
                <>
                  <h2 className="sr-only">Galería de resultados</h2>
                  <div className="filters">
                    <label className="field">
                      Ancho mínimo (px)
                      <Input
                        type="number"
                        min="0"
                        value={minWidth}
                        onChange={(e) =>
                          setMinWidth(Math.max(0, Number(e.target.value)))
                        }
                      />
                    </label>
                    <label className="field">
                      Alto mínimo (px)
                      <Input
                        type="number"
                        min="0"
                        value={minHeight}
                        onChange={(e) =>
                          setMinHeight(Math.max(0, Number(e.target.value)))
                        }
                      />
                    </label>
                    <label className="field">
                      Omitir pequeñas
                      <select
                        value={small}
                        onChange={(e) => setSmall(Number(e.target.value))}
                      >
                        <option value="0">Mostrar todas</option>
                        <option value="32">Mínimo 32 × 32</option>
                        <option value="100">Mínimo 100 × 100</option>
                        <option value="250">Mínimo 250 × 250</option>
                      </select>
                    </label>
                    <label className="field">
                      Ordenar por
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="page">Página</option>
                        <option value="size">Área en píxeles</option>
                        <option value="bytes">Peso del archivo</option>
                      </select>
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setReverse(!reverse)}
                      aria-pressed={reverse}
                    >
                      {reverse ? "Descendente" : "Ascendente"}
                    </Button>
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={hideDuplicates}
                        onChange={(e) => setHideDuplicates(e.target.checked)}
                      />
                      Ocultar duplicadas
                    </label>
                  </div>
                  <div
                    className={`result-actions ${selected.size ? "has-selection" : ""}`}
                  >
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={allVisible}
                        disabled={!visible.length}
                        ref={(node) => {
                          if (node)
                            node.indeterminate =
                              !allVisible &&
                              visible.some((r) => selected.has(r.id));
                        }}
                        onChange={toggleAll}
                      />
                      Seleccionar visibles
                    </label>
                    <span className="selection-count" aria-live="polite">
                      {selected.size} seleccionadas (
                      {
                        results.filter(
                          (r) => selected.has(r.id) && !visible.includes(r),
                        ).length
                      }{" "}
                      ocultas) · {visible.length} visibles
                    </span>
                    <Button variant="outline" onClick={() => void zip(results)}>
                      ZIP todas ({results.length})
                    </Button>
                    <Button
                      disabled={!selected.size}
                      onClick={() =>
                        void zip(results.filter((r) => selected.has(r.id)))
                      }
                    >
                      <Download size={17} />
                      ZIP seleccionadas ({selected.size})
                    </Button>
                  </div>
                  {!visible.length ? (
                    <div className="panel empty-state">
                      <ImageOff size={32} />
                      <h2>No hay imágenes con estos filtros</h2>
                      <p>
                        Reduce las dimensiones o muestra las duplicadas. Tus
                        resultados se conservan.
                      </p>
                    </div>
                  ) : (
                    <div className="image-grid">
                      {visible.map((r) => (
                        <article key={r.id} className="image-card">
                          <button
                            className="image-thumb"
                            aria-label={`Ampliar ${r.name}`}
                            onClick={(e) => {
                              previewFocus.current = e.currentTarget;
                              setPreview(r.id);
                              setActual(false);
                            }}
                          >
                            <ResultThumbnail result={r} />
                          </button>
                          <div className="image-info">
                            <strong>{r.name}</strong>
                            <p>
                              Página {r.page} · {r.width} × {r.height} px
                              <br />
                              {r.format.toUpperCase()} · {bytes(r.blob.size)}
                              {r.duplicate ? " · Duplicada" : ""}
                              {r.reencoded ? " · Reconstruida" : ""}
                            </p>
                            <div className="row">
                              <label className="check-label">
                                <input
                                  type="checkbox"
                                  checked={selected.has(r.id)}
                                  onChange={() => toggle(r.id)}
                                  aria-label={`Seleccionar ${r.name}`}
                                />
                                Seleccionar
                              </label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => download(r.blob, r.name)}
                                aria-label={`Descargar ${r.name}`}
                              >
                                <Download size={15} />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          if (!open) cancel();
        }}
      >
        <DialogContent className="password-dialog">
          <DialogTitle>Este PDF requiere contraseña</DialogTitle>
          <DialogDescription>
            Se usa únicamente para abrir el documento en tu navegador.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              passwordCallback.current?.(password);
              setPassword("");
              setPasswordOpen(false);
            }}
          >
            <label className="field mt-6">
              Contraseña del PDF
              <Input
                autoFocus
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {passwordError && (
              <p className="notice error" role="alert">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            )}
            <div className="row">
              <Button type="submit" disabled={!password}>
                Abrir PDF
              </Button>
              <Button type="button" variant="outline" onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!current}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            previewFocus.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              setPreview(results[Math.max(0, previewIndex - 1)]?.id);
              e.preventDefault();
            }
            if (e.key === "ArrowRight") {
              setPreview(
                results[Math.min(results.length - 1, previewIndex + 1)]?.id,
              );
              e.preventDefault();
            }
          }}
        >
          {current && (
            <>
              <DialogTitle>Vista previa · Página {current.page}</DialogTitle>
              <DialogDescription>
                {current.name} · {current.width} × {current.height} px ·{" "}
                {bytes(current.blob.size)}
              </DialogDescription>
              <div className={`preview-stage ${actual ? "actual" : ""}`}>
                <img
                  src={current.url}
                  alt={`Resultado de página ${current.page}`}
                  onError={(e) => {
                    e.currentTarget.alt =
                      "No se pudo mostrar la imagen. Usa la descarga individual.";
                  }}
                />
              </div>
              <div className="row justify-between">
                <div className="row">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={previewIndex <= 0}
                    aria-label="Imagen anterior"
                    onClick={() => setPreview(results[previewIndex - 1].id)}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <span>
                    {previewIndex + 1} / {results.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={previewIndex >= results.length - 1}
                    aria-label="Imagen siguiente"
                    onClick={() => setPreview(results[previewIndex + 1].id)}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  aria-pressed={actual}
                  onClick={() => setActual(!actual)}
                >
                  <Maximize2 size={17} />
                  {actual ? "Encajar" : "Ver al 100 %"}
                </Button>
                <Button onClick={() => download(current.blob, current.name)}>
                  <Download size={17} />
                  Descargar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={zipProgress !== null}
        onOpenChange={(open) => {
          if (!open) cancelZip();
        }}
      >
        <DialogContent className="password-dialog">
          <DialogTitle>Preparando tu ZIP</DialogTitle>
          <DialogDescription>
            Empaquetando las imágenes localmente. Puedes cancelar antes de la
            descarga.
          </DialogDescription>
          <Progress
            value={zipProgress ?? 0}
            aria-label="Progreso del ZIP"
            className="my-6"
          />
          <p aria-live="polite">{Math.floor(zipProgress ?? 0)} % completado</p>
          <Button variant="outline" onClick={cancelZip}>
            Cancelar ZIP
          </Button>
        </DialogContent>
      </Dialog>
      <span className="sr-only" aria-live="polite">
        {loading
          ? "Abriendo documento"
          : pdf
            ? `PDF abierto: ${pdf.numPages} páginas`
            : ""}
      </span>
    </main>
  );
}
function ResultThumbnail({ result }: { result: ImageResult }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="text-sm">
      <ImageOff size={26} />
      Vista no disponible · abre o descarga la imagen
    </span>
  ) : (
    <img
      src={result.url}
      loading="lazy"
      alt={`Imagen de la página ${result.page}`}
      onError={() => setFailed(true)}
    />
  );
}
