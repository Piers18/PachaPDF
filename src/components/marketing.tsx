import React from 'react';
import {
  ShieldCheck,
  Download,
  UserX,
  FileImage,
  Layers,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lock,
  FileArchive,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Upload,
  Info,
  Sliders,
  Search,
  Zap,
} from 'lucide-react';

export interface MarketingProps {
  className?: string;
}

/**
 * LandingSections
 * Secciones complementarias de la landing page (montadas tras la dropzone #cargar-pdf):
 * 1. Ventajas comprobables (Privacidad local, Descargas directas/ZIP, Sin registro)
 * 2. Bloque de dos herramientas con microcopy claro y CTAs a #cargar-pdf (id="herramientas")
 * 3. Cómo funciona en 3 pasos: Sube, Elige, Descarga (id="como-funciona")
 * 4. Preguntas frecuentes accesibles (id="preguntas")
 */
export function LandingSections({ className = '' }: MarketingProps) {
  return (
    <div className={`w-full flex flex-col gap-20 sm:gap-24 md:gap-28 ${className}`}>
      {/* 1. VENTAJAS COMPROBABLES */}
      <section
        aria-labelledby="ventajas-titulo"
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            Garantías de privacidad
          </span>
          <h2
            id="ventajas-titulo"
            className="text-2xl sm:text-3xl font-extrabold text-[#21182A] dark:text-[#F7F3F9] tracking-tight"
          >
            Ventajas comprobables en cada procesamiento
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE]">
            Herramientas centradas en la seguridad de tus documentos y la agilidad de uso en tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Privacidad en tu navegador */}
          <div className="flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm transition-all hover:border-[#55166A]/40 dark:hover:border-[#00CEB0]/40">
            <div className="w-12 h-12 rounded-[14px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0] mb-5">
              <ShieldCheck className="w-6 h-6 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Privacidad en tu navegador
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Tus archivos no se envían a servidores remotos. Toda la lectura, extracción y renderizado se realiza localmente en tu propio dispositivo.
            </p>
          </div>

          {/* Card 2: Descargas */}
          <div className="flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm transition-all hover:border-[#55166A]/40 dark:hover:border-[#00CEB0]/40">
            <div className="w-12 h-12 rounded-[14px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0] mb-5">
              <Download className="w-6 h-6 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Descargas individuales o en ZIP
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Descarga imágenes una a una según las necesites o empaqueta selecciones completas en un archivo ZIP generado localmente en tu equipo.
            </p>
          </div>

          {/* Card 3: Sin registro */}
          <div className="flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm transition-all hover:border-[#55166A]/40 dark:hover:border-[#00CEB0]/40">
            <div className="w-12 h-12 rounded-[14px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0] mb-5">
              <UserX className="w-6 h-6 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Sin registro ni formularios
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Comienza a trabajar de inmediato sin crear cuentas, sin introducir correos electrónicos y sin recopilación de datos de contacto.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DOS HERRAMIENTAS (id="herramientas") */}
      <section
        id="herramientas"
        aria-labelledby="herramientas-titulo"
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0] mb-3">
            <Sliders className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            Capacidades especializadas
          </span>
          <h2
            id="herramientas-titulo"
            className="text-2xl sm:text-3xl font-extrabold text-[#21182A] dark:text-[#F7F3F9] tracking-tight"
          >
            Dos herramientas, una sola experiencia
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE]">
            Elige la herramienta adecuada según si requieres aislar imágenes fotográficas o renderizar páginas completas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Herramienta 1: Extraer imágenes incrustadas */}
          <div className="flex flex-col justify-between bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0]">
                  <FileImage className="w-6 h-6 text-[#55166A] dark:text-[#00CEB0]" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF9FC] dark:bg-[#160F1D] text-[#665E6E] dark:text-[#C9BDCE] border border-[#E9E3ED] dark:border-[#45354E]">
                  Imágenes independientes
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-3">
                Extraer imágenes incrustadas
              </h3>
              <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed mb-6">
                Recupera las imágenes fotográficas y recursos visuales almacenados dentro del documento. Extrae cada imagen de forma independiente sin incluir el texto ni los márgenes de la página.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#21182A] dark:text-[#F7F3F9]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Aísla imágenes fotográficas sin texto circundante</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Muestra la página de origen y las dimensiones en píxeles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Exporta en formato PNG cuando la imagen requiere recomposición</span>
                </li>
              </ul>
            </div>

            <div>
              <a
                href="#cargar-pdf"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-[12px] bg-[#55166A] text-white font-medium text-sm transition-colors hover:bg-[#3A0D4C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#160F1D]"
              >
                <span>Probar ahora</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Herramienta 2: Convertir páginas a imágenes */}
          <div className="flex flex-col justify-between bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0]">
                  <Layers className="w-6 h-6 text-[#55166A] dark:text-[#00CEB0]" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#FAF9FC] dark:bg-[#160F1D] text-[#665E6E] dark:text-[#C9BDCE] border border-[#E9E3ED] dark:border-[#45354E]">
                  Páginas completas
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-3">
                Convertir páginas a imágenes
              </h3>
              <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed mb-6">
                Genera una imagen completa de cada página en formato PNG o JPG. Indicado para documentos compuestos por texto, tablas, diagramas o gráficos vectoriales donde todo el contenido debe permanecer unido.
              </p>

              <ul className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#21182A] dark:text-[#F7F3F9]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Elección entre formato PNG o JPG con control de calidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Selector de escala: 1× (72 DPI estándar), 1.5× (108 DPI) y 2× (144 DPI)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Procesamiento de todo el documento o de páginas específicas</span>
                </li>
              </ul>
            </div>

            <div>
              <a
                href="#cargar-pdf"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-[12px] bg-[#55166A] text-white font-medium text-sm transition-colors hover:bg-[#3A0D4C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#160F1D]"
              >
                <span>Probar ahora</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CÓMO FUNCIONA (id="como-funciona") */}
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-titulo"
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0] mb-3">
            <Zap className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            Flujo ágil
          </span>
          <h2
            id="como-funciona-titulo"
            className="text-2xl sm:text-3xl font-extrabold text-[#21182A] dark:text-[#F7F3F9] tracking-tight"
          >
            ¿Cómo funciona PachaPDF?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE]">
            Tres pasos transparentes para procesar tus documentos directamente en tu navegador.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Paso 1: Sube */}
          <div className="relative flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#007562] dark:text-[#00CEB0] bg-[#00CEB0]/10 px-2.5 py-1 rounded-full">
                Paso 1
              </span>
              <Upload className="w-5 h-5 text-[#665E6E] dark:text-[#C9BDCE]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Sube tu archivo PDF
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Arrastra tu documento o selecciónalo desde tu dispositivo en la zona superior para comenzar.
            </p>
          </div>

          {/* Paso 2: Elige */}
          <div className="relative flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#007562] dark:text-[#00CEB0] bg-[#00CEB0]/10 px-2.5 py-1 rounded-full">
                Paso 2
              </span>
              <Sliders className="w-5 h-5 text-[#665E6E] dark:text-[#C9BDCE]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Elige modo y opciones
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Selecciona si deseas extraer imágenes incrustadas o convertir páginas completas, ajustando rangos o formato de salida.
            </p>
          </div>

          {/* Paso 3: Descarga */}
          <div className="relative flex flex-col bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#007562] dark:text-[#00CEB0] bg-[#00CEB0]/10 px-2.5 py-1 rounded-full">
                Paso 3
              </span>
              <Download className="w-5 h-5 text-[#665E6E] dark:text-[#C9BDCE]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] mb-2">
              Revisa y descarga resultados
            </h3>
            <p className="text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Examina la vista previa de las imágenes y descárgalas de forma individual o en un archivo ZIP.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#cargar-pdf"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[44px] rounded-[12px] bg-[#55166A] text-white font-medium text-sm transition-colors hover:bg-[#3A0D4C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#160F1D]"
          >
            <span>Subir PDF ahora</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* 4. PREGUNTAS FRECUENTES (id="preguntas") */}
      <section
        id="preguntas"
        aria-labelledby="preguntas-titulo"
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0] mb-3">
            <HelpCircle className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
            Preguntas frecuentes
          </span>
          <h2
            id="preguntas-titulo"
            className="text-2xl sm:text-3xl font-extrabold text-[#21182A] dark:text-[#F7F3F9] tracking-tight"
          >
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE]">
            Respuestas directas sobre el funcionamiento, privacidad y opciones de PachaPDF.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* FAQ 1 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Cómo se garantiza que mis documentos no se suben a ningún servidor?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                PachaPDF se ejecuta íntegramente en el navegador web de tu equipo. El archivo seleccionado se procesa en la memoria local de tu dispositivo, sin servidores intermedios de conversión ni llamadas de subida a la red.
              </p>
              <p>
                Cualquier usuario puede auditar este comportamiento abriendo las herramientas de desarrollador del navegador (tecla F12), pestaña Red (Network), comprobando que no se transfieren datos del documento hacia servidores externos.
              </p>
            </div>
          </details>

          {/* FAQ 2 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Cuál es la diferencia entre extraer imágenes y convertir páginas?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                <strong>Extraer imágenes incrustadas</strong> busca fotografías y recursos gráficos independientes dentro del PDF, recuperándolos sin el texto ni los márgenes circundantes.
              </p>
              <p>
                <strong>Convertir páginas</strong> genera una imagen completa de cada hoja del documento, unificando texto, fuentes tipográficas, vectores y fondos tal como se visualizan en pantalla.
              </p>
            </div>
          </details>

          {/* FAQ 3 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Por qué algunas imágenes extraídas se guardan en formato PNG?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                En muchos PDF, las imágenes se almacenan como muestras de color sin encabezados de archivo estándar o acompañadas de máscaras de transparencia.
              </p>
              <p>
                Al procesarlas en el navegador, se reconstruye la imagen en memoria y se exporta como PNG para conservar su resolución y transparencia. La imagen preserva la calidad visible, aunque constituye una exportación en PNG y no necesariamente el archivo binario anterior con sus metadatos de cámara originales.
              </p>
            </div>
          </details>

          {/* FAQ 4 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Qué ocurre si la extracción no encuentra imágenes en mi archivo?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                Si tu documento está compuesto únicamente por texto, tablas, diagramas o curvas vectoriales, no contiene mapas de bits compatibles para extraer.
              </p>
              <p>
                En ese caso, la aplicación te permite alternar hacia el modo &ldquo;Convertir páginas&rdquo;, el cual genera imágenes completas de las hojas deseadas.
              </p>
            </div>
          </details>

          {/* FAQ 5 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Cómo influye la escala y el tamaño del archivo en el rendimiento?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                Al ejecutarse en el navegador, la velocidad y capacidad dependen de la memoria RAM de tu dispositivo. Una mayor escala (como 2× / 144 DPI) genera imágenes más grandes y nítidas, requiriendo más memoria gráfica durante la conversión.
              </p>
              <p>
                Para documentos extensos, se sugiere seleccionar rangos de páginas acotados o utilizar la escala estándar de 1× (72 DPI).
              </p>
            </div>
          </details>

          {/* FAQ 6 */}
          <details className="group bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-5 sm:p-6 transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none text-base sm:text-lg font-bold text-[#21182A] dark:text-[#F7F3F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded-[8px]">
              <span>¿Cómo se generan las descargas en archivo ZIP?</span>
              <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-[#55166A] dark:text-[#00CEB0]">
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              </span>
            </summary>
            <div className="mt-4 text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed border-t border-[#E9E3ED] dark:border-[#45354E] pt-4 space-y-2">
              <p>
                El archivo comprimido ZIP se crea directamente en la memoria de tu navegador, empaquetando los archivos seleccionados con nombres ordenados por página y número de imagen antes de iniciar la descarga a tu equipo.
              </p>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

/**
 * HelpContent
 * Contenido informativo exhaustivo para la ruta /help y la sección de privacidad.
 * Incluye id="privacidad", explicaciones técnicas rigurosas sobre:
 * - Extracción de objetos vs render de página
 * - Reconstrucción de imágenes PNG y fidelidad
 * - Formatos no soportados, máscaras y vectores
 * - Memoria de canvas (72, 108, 144 DPI a base 72dpi) y documentos protegidos
 * - Generación de ZIP local
 */
export function HelpContent({ className = '' }: MarketingProps) {
  return (
    <article className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}>
      {/* Encabezado principal */}
      <header className="mb-12 border-b border-[#E9E3ED] dark:border-[#45354E] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0] mb-3">
          <Info className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
          Documentación técnica y privacidad
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#21182A] dark:text-[#F7F3F9] tracking-tight">
          Centro de Ayuda, Privacidad y Limitaciones
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#665E6E] dark:text-[#C9BDCE] max-w-3xl leading-relaxed">
          Guía técnica sobre el funcionamiento de PachaPDF, la gestión de memoria en el navegador, las diferencias entre métodos y los límites de extracción en el estándar PDF.
        </p>
      </header>

      {/* SECCIÓN 1: POLÍTICA Y ARQUITECTURA DE PRIVACIDAD LOCAL (id="privacidad") */}
      <section
        id="privacidad"
        aria-labelledby="privacidad-titulo"
        className="mb-16 scroll-mt-20 bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-10 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[12px] bg-[#F4EBF7] dark:bg-[#2D1B36] flex items-center justify-center text-[#55166A] dark:text-[#00CEB0]">
            <ShieldCheck className="w-5 h-5 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
          </div>
          <div>
            <h2 id="privacidad-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9]">
              Arquitectura de privacidad del lado del cliente
            </h2>
            <p className="text-xs sm:text-sm text-[#007562] dark:text-[#00CEB0] font-medium">
              Procesamiento local en el navegador · Cero transferencias a servidores
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
          <p>
            PachaPDF opera íntegramente en el navegador web del usuario. No cuenta con un backend de conversión ni transfiere tus documentos a servidores externos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-[14px] bg-[#FAF9FC] dark:bg-[#160F1D] border border-[#E9E3ED] dark:border-[#45354E]">
              <h3 className="font-semibold text-xs sm:text-sm text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
                Ciclo de vida en memoria de la sesión
              </h3>
              <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE]">
                Los documentos se leen en la memoria temporal de la pestaña activa. Al cambiar de PDF o cerrar la ventana, las referencias a los datos temporales son revocadas y liberadas por el recolector de memoria del navegador.
              </p>
            </div>

            <div className="p-4 rounded-[14px] bg-[#FAF9FC] dark:bg-[#160F1D] border border-[#E9E3ED] dark:border-[#45354E]">
              <h3 className="font-semibold text-xs sm:text-sm text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2 mb-1.5">
                <Search className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
                Auditoría en herramientas de desarrollador
              </h3>
              <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE]">
                Puedes comprobar la ausencia de tráfico saliente abriendo las Herramientas de Desarrollador de tu navegador (<kbd className="px-1 py-0.5 text-xs font-mono bg-black/5 dark:bg-white/10 rounded">F12</kbd>), pestaña <strong>Red (Network)</strong>. Durante la carga y procesamiento no se efectúa ninguna petición de subida con tus archivos.
              </p>
            </div>
          </div>

          <p>
            No se emplean servicios externos de telemetría que capturen nombres de documentos ni su contenido. Las preferencias locales mínimas (como el tema de color claro u oscuro) se guardan estrictamente en tu navegador sin datos identificatorios.
          </p>
        </div>
      </section>

      {/* SECCIÓN 2: DIFERENCIA TÉCNICA - EXTRACCIÓN VS CONVERSIÓN */}
      <section aria-labelledby="diferencias-titulo" className="mb-16 scroll-mt-20">
        <h2 id="diferencias-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-4">
          Diferencias entre extracción de imágenes y conversión de páginas
        </h2>
        <p className="text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed mb-6">
          Comprender la estructura interna de un PDF te ayudará a elegir la herramienta óptima para cada caso:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna A: Extracción */}
          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <FileImage className="w-5 h-5 text-[#55166A] dark:text-[#00CEB0]" aria-hidden="true" />
              <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9]">
                Extraer imágenes incrustadas
              </h3>
            </div>
            <p className="text-xs text-[#007562] dark:text-[#00CEB0] font-medium mb-4">
              Objetivo: Recuperar objetos de imagen independientes
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              <p>
                Inspecciona la lista de recursos internos del PDF para ubicar y extraer las imágenes colocadas en el documento.
              </p>
              <div className="border-l-2 border-[#55166A] dark:border-[#00CEB0] pl-3 py-1 text-xs">
                <strong>¿Cuándo usarlo?</strong> Para recuperar fotografías o imágenes individuales sin el texto ni los márgenes circundantes.
              </div>
              <div className="border-l-2 border-[#E9E3ED] dark:border-[#45354E] pl-3 py-1 text-xs">
                <strong>Límites:</strong> No extrae textos, logotipos vectoriales en curvas ni trazados tipográficos. Si una página sólo tiene texto o vectores, reportará que no hay imágenes compatibles.
              </div>
            </div>
          </div>

          {/* Columna B: Conversión */}
          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-[#55166A] dark:text-[#00CEB0]" aria-hidden="true" />
              <h3 className="text-lg font-bold text-[#21182A] dark:text-[#F7F3F9]">
                Convertir páginas completas
              </h3>
            </div>
            <p className="text-xs text-[#007562] dark:text-[#00CEB0] font-medium mb-4">
              Objetivo: Renderizar la página completa a un lienzo gráfico
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              <p>
                Interpreta la composición visual de la página (fuentes, vectores, tablas y fondos) y dibuja el contenido completo en formato PNG o JPG.
              </p>
              <div className="border-l-2 border-[#55166A] dark:border-[#00CEB0] pl-3 py-1 text-xs">
                <strong>¿Cuándo usarlo?</strong> Para presentaciones, infografías vectoriales, formularios o páginas mixtas que deben conservarse exactamente como se leen en pantalla.
              </div>
              <div className="border-l-2 border-[#E9E3ED] dark:border-[#45354E] pl-3 py-1 text-xs">
                <strong>Límites:</strong> No separa elementos aislados. Asimismo, una página puede experimentar errores de conversión si contiene estructuras dañadas o si el navegador agota la memoria disponible.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: FIDELIDAD Y EXPORTACIÓN PNG RECONSTRUIDA */}
      <section aria-labelledby="fidelidad-titulo" className="mb-16 scroll-mt-20">
        <h2 id="fidelidad-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-4">
          Exportación de imágenes y fidelidad técnica
        </h2>
        <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
          <p>
            En el estándar PDF, los datos de imagen se almacenan habitualmente como flujos de muestras de color comprimidos mediante algoritmos internos. Al procesarlos en el navegador, se sintetiza un nuevo contenedor de imagen estándar (como PNG) para permitir su descarga y uso en cualquier visor.
          </p>
          <div className="p-4 rounded-[14px] bg-[#FAF9FC] dark:bg-[#160F1D] border border-[#E9E3ED] dark:border-[#45354E] text-xs sm:text-sm">
            <h3 className="font-semibold text-[#21182A] dark:text-[#F7F3F9] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#007562] dark:text-[#00CEB0]" aria-hidden="true" />
              Alcance de la fidelidad de exportación
            </h3>
            <p>
              El archivo descargado mantiene la resolución en píxeles y el aspecto visual visible en el documento. Sin embargo, no se garantiza una correspondencia bit a bit con el archivo fotográfico original anterior a la maquetación del PDF, ya que los metadatos EXIF de la cámara o los comentarios binarios originales suelen descartarse durante la generación del documento.
            </p>
            <p className="mt-2">
              Asimismo, la conversión de perfiles de color hacia el espacio sRGB estándar del navegador puede introducir ajustes menores de tono en documentos con configuraciones cromáticas avanzadas.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: LIMITACIONES TÉCNICAS Y CASOS NO SOPORTADOS */}
      <section aria-labelledby="limitaciones-titulo" className="mb-16 scroll-mt-20">
        <h2 id="limitaciones-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-4">
          Limitaciones del formato PDF y casos no compatibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#007562] dark:bg-[#00CEB0]"></span>
              Gráficos vectoriales y trazados
            </h3>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Los logotipos vectoriales, curvas geométricas y trazados tipográficos no son imágenes de mapa de bits. No pueden extraerse como fotos aisladas; para capturarlos se debe utilizar <strong>Convertir páginas</strong>.
            </p>
          </div>

          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#007562] dark:bg-[#00CEB0]"></span>
              Máscaras de transparencia complejas
            </h3>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Ciertos documentos utilizan máscaras de recorte o máscaras de opacidad no estándares. Si la máscara no puede procesarse directamente en el navegador, la aplicación reportará un aviso de extracción parcial.
            </p>
          </div>

          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#007562] dark:bg-[#00CEB0]"></span>
              Espacios de color especiales
            </h3>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Imágenes con perfiles CMYK de imprenta se mapean al espacio de color sRGB del navegador, lo que puede originar leves variaciones de tono en comparación con impresiones profesionales.
            </p>
          </div>

          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#007562] dark:bg-[#00CEB0]"></span>
              Imágenes fragmentadas en franjas
            </h3>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Algunos escáneres dividen una página en varias tiras horizontales contiguas. El extractor identificará cada tira como una imagen independiente. Si necesitas la página completa unificada, utiliza el modo de conversión.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: GESTIÓN DE MEMORIA, ESCALA Y RENDIMIENTO */}
      <section aria-labelledby="memoria-titulo" className="mb-16 scroll-mt-20">
        <h2 id="memoria-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-4">
          Uso de memoria, resolución y escala
        </h2>
        <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 sm:p-8 space-y-4 text-sm sm:text-base text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
          <p>
            En la conversión de páginas, PDF.js toma como referencia la base estándar de 72 puntos por pulgada (DPI) del formato PDF. El consumo de memoria del búfer gráfico varía según las dimensiones y la escala elegida, calculándose mediante la fórmula:
          </p>

          <div className="p-3 bg-[#FAF9FC] dark:bg-[#160F1D] border border-[#E9E3ED] dark:border-[#45354E] rounded-[10px] font-mono text-xs text-[#21182A] dark:text-[#F7F3F9]">
            Memoria del búfer de lienzo (MiB) = (ancho_px × alto_px × 4 bytes RGBA) / 1024²
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Comparación de escala y memoria"
            className="overflow-x-auto my-4 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#211429]"
          >
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E9E3ED] dark:border-[#45354E] text-[#21182A] dark:text-[#F7F3F9]">
                  <th className="py-2.5 pr-4 font-bold">Escala</th>
                  <th className="py-2.5 px-4 font-bold">Densidad equivalente</th>
                  <th className="py-2.5 px-4 font-bold">Dimensiones típicas A4 (595 × 842 pt)</th>
                  <th className="py-2.5 px-4 font-bold">Búfer de lienzo estimado</th>
                  <th className="py-2.5 pl-4 font-bold">Uso recomendado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E3ED] dark:divide-[#45354E]">
                <tr>
                  <td className="py-3 pr-4 font-medium text-[#21182A] dark:text-[#F7F3F9]">1×</td>
                  <td className="py-3 px-4">72 DPI</td>
                  <td className="py-3 px-4">595 × 842 px</td>
                  <td className="py-3 px-4">~1.91 MiB</td>
                  <td className="py-3 pl-4">Documentos largos, lectura en pantalla, dispositivos móviles</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[#21182A] dark:text-[#F7F3F9]">1.5×</td>
                  <td className="py-3 px-4">108 DPI</td>
                  <td className="py-3 px-4">893 × 1263 px</td>
                  <td className="py-3 px-4">~4.30 MiB</td>
                  <td className="py-3 pl-4">Equilibrio entre nitidez y consumo de memoria</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-[#21182A] dark:text-[#F7F3F9]">2×</td>
                  <td className="py-3 px-4">144 DPI</td>
                  <td className="py-3 px-4">1190 × 1684 px</td>
                  <td className="py-3 px-4">~7.64 MiB</td>
                  <td className="py-3 pl-4">Mayor nitidez para letras pequeñas o impresión</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#FAF9FC] dark:bg-[#160F1D] border border-[#E9E3ED] dark:border-[#45354E] rounded-[12px] text-xs space-y-1.5">
            <p className="font-semibold text-[#21182A] dark:text-[#F7F3F9]">
              Alcance de la estimación de memoria:
            </p>
            <p className="text-[#665E6E] dark:text-[#C9BDCE]">
              Estos valores corresponden <strong>únicamente al búfer de píxeles sin comprimir del elemento canvas</strong> generado para cada página. No representan el consumo de memoria total del navegador, el cual incluye además el motor PDF.js, tablas tipográficas incrustadas, árboles del DOM y la recolección de basura del sistema.
            </p>
            <p className="text-[#665E6E] dark:text-[#C9BDCE]">
              Para documentos con un número elevado de páginas o dispositivos con memoria ajustada, se sugiere procesar intervalos específicos (ejemplo: <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-xs">1-10</code>) para evitar ralentizaciones.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: PDF CIFRADOS Y ARCHIVOS ZIP */}
      <section aria-labelledby="cifrado-zip-titulo" className="mb-8 scroll-mt-20">
        <h2 id="cifrado-zip-titulo" className="text-xl sm:text-2xl font-bold text-[#21182A] dark:text-[#F7F3F9] mb-4">
          PDF con contraseña y descargas ZIP locales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#55166A] dark:text-[#00CEB0]">
              <Lock className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9]">
                PDF protegidos con contraseña
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Si tu documento requiere contraseña de apertura, el descifrado se procesa de forma estrictamente local en el navegador. La contraseña no se almacena en almacenamiento permanente ni se envía a redes externas.
            </p>
          </div>

          <div className="bg-white dark:bg-[#211429] border border-[#E9E3ED] dark:border-[#45354E] rounded-[20px] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#55166A] dark:text-[#00CEB0]">
              <FileArchive className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-bold text-base text-[#21182A] dark:text-[#F7F3F9]">
                Empaquetado ZIP en tu equipo
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Las descargas por lotes se compilan directamente en el navegador del usuario. Las imágenes seleccionadas se empaquetan en memoria y se entregan al sistema de descargas de tu dispositivo sin recurrir a servidores remotos.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}

/**
 * AppFooter
 * Pie de página global con año dinámico, enlace corporativo seguro a https://pachatech.pro/,
 * enlace a /help#privacidad y atribución institucional a PachaTech.
 */
export function AppFooter({ className = '' }: MarketingProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={`w-full bg-[#FAF9FC] dark:bg-[#160F1D] border-t border-[#E9E3ED] dark:border-[#45354E] transition-colors ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Columna 1: Marca y Filosofía */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#55166A] dark:text-[#F7F3F9]">
                PachaPDF
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F4EBF7] dark:bg-[#2D1B36] text-[#55166A] dark:text-[#00CEB0]">
                by PachaTech
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Tus PDF, tus imágenes, tu privacidad. Herramientas de extracción y conversión ejecutadas íntegramente en el navegador, sin intermediación de servidores.
            </p>
          </div>

          {/* Columna 2: Navegación de herramientas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#21182A] dark:text-[#F7F3F9]">
              Herramientas
            </h3>
            <ul className="space-y-2 text-sm text-[#665E6E] dark:text-[#C9BDCE]">
              <li>
                <a
                  href="/#herramientas"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Extraer imágenes incrustadas
                </a>
              </li>
              <li>
                <a
                  href="/#herramientas"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Convertir páginas a PNG/JPG
                </a>
              </li>
              <li>
                <a
                  href="/#como-funciona"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a
                  href="/#cargar-pdf"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Cargar documento
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Documentación y Privacidad */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#21182A] dark:text-[#F7F3F9]">
              Soporte y Garantías
            </h3>
            <ul className="space-y-2 text-sm text-[#665E6E] dark:text-[#C9BDCE]">
              <li>
                <a
                  href="/help"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a
                  href="/help#privacidad"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Garantía de privacidad local
                </a>
              </li>
              <li>
                <a
                  href="/#preguntas"
                  className="hover:text-[#55166A] dark:hover:text-[#00CEB0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded py-1 inline-block"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Atribución PachaTech */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#21182A] dark:text-[#F7F3F9]">
              Acerca de PachaTech
            </h3>
            <p className="text-xs sm:text-sm text-[#665E6E] dark:text-[#C9BDCE] leading-relaxed">
              Diseñado y desarrollado por <strong>PachaTech</strong>. Enfocados en herramientas web centradas en la privacidad, la eficiencia y el control de los datos del usuario.
            </p>
            <div className="pt-1">
              <a
                href="https://pachatech.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#55166A] dark:text-[#00CEB0] hover:text-[#3A0D4C] dark:hover:text-[#00CEB0]/80 transition-colors py-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CEB0] rounded"
              >
                <span>Visitar pachatech.pro</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior de copyright y comprobación */}
        <div className="pt-8 border-t border-[#E9E3ED] dark:border-[#45354E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#665E6E] dark:text-[#C9BDCE]">
          <p>
            &copy; {currentYear} PachaPDF &middot; by PachaTech. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#007562] dark:bg-[#00CEB0]"></span>
            <span>Procesamiento local en el navegador &middot; Sin transferencias a la red</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
