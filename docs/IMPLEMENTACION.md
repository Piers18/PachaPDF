# Implementación y evidencia — PachaPDF

Fecha de verificación: 13 de noviembre de 2026. La instrucción actual sustituye Angular por **Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui**. El paquete original en `docs/PachaPDF_entrega/` se conserva intacto. No hay publicación pública ni URL de producción configurada.

## Arquitectura entregada

- `src/app/layout.tsx`, `page.tsx`, `help/page.tsx`: páginas estáticas, SEO básico, cabecera y pie global. No hay APIs, server actions, autenticación, base de datos o telemetría.
- `src/components/workspace.tsx`: carga, contraseña, configuración, procesamiento, galería, filtros, selección, diálogos y ZIP; estado exclusivamente en memoria. Las vistas usan fragmentos de URL; volver atrás conserva el documento y cancela trabajo activo. Recargar o salir del documento descarta el workspace.
- `src/lib/pdf.ts`: importación diferida de PDF.js, selección de páginas, límites de canvas, render, adaptación de objetos de imagen, SHA-256 y descargas Blob.
- `src/components/page-preview.tsx`: miniaturas de página mediante IntersectionObserver, render reducido y cleanup al desmontar. Se muestran hasta 200 páginas; el campo de intervalos permite procesar páginas posteriores.
- `src/components/ui/`: Input/Progress/Checkbox generados con shadcn CLI; Button con CVA/Slot y Dialog sobre Radix. Dialog aporta foco atrapado, Escape y restauración de foco. Se usan controles nativos etiquetados para selección y formularios.
- `src/components/marketing.tsx`: LandingSections, HelpContent y AppFooter integrados según contrato; desarrollado por Antigravity. Los ajustes de accesibilidad de su tabla y los enlaces globales se coordinaron sin sobrescribir el archivo.
- `scripts/pdf-assets.mjs`: copia todos los recursos PDF.js a la ruta local de su versión. Worker, CMaps, fuentes estándar, WASM, ICC y decodificadores proceden de `pdfjs-dist@6.5.438`; la licencia también se distribuye localmente.

El logo de `public/brand/pachapdf-logo-aprobado.png` es una copia exacta. Se conserva el documento blanco. Los favicons 16/32/48/180/192/512 usan el arte completo redimensionado con fondo blanco; **el recorte/limpieza supervisados de favicon están pendientes**. No se generó un logo nuevo. Fuente `Inter` si existe instalada; fallback system-ui sin red.

## Matriz HU01–HU40

“Implementada” significa que existe el comportamiento y la evidencia indicada para el alcance comprobado. No implica compatibilidad universal con toda codificación, navegador o tecnología asistiva. “Parcial” identifica una limitación concreta o una validación requerida todavía pendiente; no se oculta como historia completa.

| HU | Estado | Comportamiento y evidencia |
|---|---|---|
| HU01 | Implementada | File input real; pruebas `extract objects`, `text empty` y `local AES256` abren fixtures desde disco. |
| HU02 | Implementada | Drop real con DataTransfer/File, estado visual dragover; prueba `actual drag drop`. |
| HU03 | Implementada | Firma `%PDF-` en primeros 1024 bytes y apertura PDF.js; fixtures sin firma y corrupto rechazados con reintento. |
| HU04 | Implementada | Nombre, tamaño File.size y PDF.numPages reales; `images.pdf` muestra 2 páginas; bytes/formato de resultados comprobados. |
| HU05 | Implementada | Cambiar/quitar destruyen loadingTask/documento, vacían selección y revocan URLs; prueba `object URL lifecycle` vuelve a cero URLs tras reemplazo. |
| HU06 | Implementada | Corrupto pasa firma pero falla apertura real; aviso recuperable y carga posterior correcta en `text empty`. |
| HU07 | Implementada | Diálogo de contraseña local; AES-256, clave incorrecta/correcta y Escape probados en `local AES256`. |
| HU08 | Implementada | Operator list + objs/commonObjs, sin render de página para extracción; JPEG/Flate/alfa/gris/mono probados; máscara produce incidencia y fixture mixto conserva resultado parcial. |
| HU09 | Implementada | Cada objeto conserva página y secuencia; fixtures de dos páginas muestran origen 1/2 con nombres únicos. |
| HU10 | Parcial | Conserva dimensiones y píxeles decodificados mediante PNG sin pérdida adicional de JPEG; alfa comprobado. No conserva streams comprimidos originales, perfiles de color ni todas las composiciones; salida siempre indicada como reconstruida. |
| HU11 | Implementada | Texto/vectores produce estado vacío y botón de conversión; error de máscara produce incidencia, no un vacío silencioso. |
| HU12 | Implementada | Parser estricto, límites antes de expansión; `1-2` válido y rango enorme inválido/deshabilitado en `extract objects`. Máximo 1000 páginas/lote. |
| HU13 | Implementada | Ancho y alto mínimos conservan sólo resultados compatibles; pruebas de 100 px ancho y 90 px alto. |
| HU14 | Implementada | Umbral de lado mínimo 32/100/250 configurable sin borrar resultados; filtro 100 probado en `visible selection`. |
| HU15 | Implementada | SHA-256 de exportaciones; tres copias JPEG producen dos duplicadas marcadas; ocultación probada. Detecta igualdad del resultado exportado, no semejanza perceptual. |
| HU16 | Implementada | page.render/canvas separado; página de texto/vectores y página rotada generan imágenes reales. |
| HU17 | Implementada | PNG y JPG descargados; firmas binarias `89504e47…` y `ffd8`, MIME/extensiones y dimensiones comprobados con sharp. |
| HU18 | Implementada | Escala 1×/1.5×/2× y calidad JPG llegan a canvas.toBlob; salida rotada cambia de 300×400 a 600×800 a 2×. Límite 64 MP rechazado y reintento 4000×4000 a 1× correcto. |
| HU19 | Implementada | Rango de conversión `2` genera sólo `pachapdf_page_002.jpg`; orden natural único en parsePages. |
| HU20 | Parcial | Miniaturas progresivas y checkboxes ajustan rango; primera vista comprobada. La galería de configuración limita vistas a primeras 200 páginas; páginas posteriores se eligen por campo de rango. |
| HU21 | Implementada | Galería de blobs reales, imágenes lazy y fallback onError; conteos 0/1/2/4/80 comprobados y capturas 360/768/1280. Fallo de miniatura tiene fallback implementado, sin fixture específico que lo fuerce. |
| HU22 | Implementada | Modal Radix con anterior/siguiente, encajar/100 %, Escape y devolución de foco; prueba `extract objects` y Tab dentro de modal en `keyboard trap`. |
| HU23 | Implementada | Página, ancho/alto, PNG/JPG y Blob.size visibles; JPEG 160×100, alfa 80×60 y salidas de página verificadas. |
| HU24 | Implementada | Checkbox por resultado; dos seleccionadas producen ZIP de exactamente dos entradas. |
| HU25 | Implementada | Seleccionar visibles respeta filtros y conserva ocultas; prueba `visible selection` y contador de una seleccionada oculta en `extract objects`. |
| HU26 | Implementada | Orden estable por página/área/bytes, dirección reversible; inversión por página comprobada con página 2 primero. Comparadores de área/bytes implementados; no hay prueba separada para cada empate. |
| HU27 | Implementada | Descargas Blob individuales reales; bytes PNG/JPG inspeccionados sin uploads. |
| HU28 | Implementada | ZIP todas incluye 4 entradas únicas aun con filtros activos; JSZip abre el archivo descargado en la prueba. |
| HU29 | Implementada | ZIP seleccionadas contiene exactamente nombres 001/002 elegidos; cero selección deshabilita acción. |
| HU30 | Implementada | Nombres deterministas por modo, página y secuencia; ZIP sanea documento y añade fecha/extensión; ausencia de colisiones comprobada. |
| HU31 | Implementada | JSZip.generateAsync actualiza metadata.percent; diálogo, cancelación real de ZIP de 80 páginas y preservación de resultados comprobados. Usa STORE para evitar recomprimir imágenes. |
| HU32 | Implementada | Progreso incrementado sólo tras completar cada página; resultado muestra páginas analizadas reales. Render/objetos secuenciales; no se inventa estimación temporal. |
| HU33 | Implementada | Mensajes de firma, corrupción, contraseña, máscara, ausencia, memoria, cancelación y éxito local ejercitados. Errores de proceso llevan a reintento/opciones. |
| HU34 | Parcial | Landing/resultados/modal capturados a 360/768/1280 sin overflow; zoom CSS 200 % comprobado. Zoom nativo del navegador, dispositivos físicos y orientación no probados. |
| HU35 | Implementada | Toggle accesible y preferencia localStorage; recarga conserva oscuro; captura dark-360. |
| HU36 | Implementada | AbortController, cancel de RenderTask, destroy de carga y guardas de generación; proceso, ZIP y carga cancelados con reintento. Cancelación de carga usa retardo controlado de petición local del worker para alcanzar el estado pendiente. Pasos nativos ya iniciados pueden terminar antes de abortar. |
| HU37 | Parcial | Etiquetas/foco/aria-live, targets principales ≥44 px, skip link, menú móvil, Escape y trap de foco comprobados; Axe sin incidencias en escenarios de landing/resultados/modal/ayuda. Falta revisión manual con lector de pantalla y auditoría WCAG completa. |
| HU38 | Implementada | Ayuda y aviso local; cada E2E falla ante red externa, POST/PUT/PATCH y pageerror. Evidencia de peticiones guardada, sólo recursos locales/blob. No se almacenan documentos. |
| HU39 | Implementada | Nuevo PDF, quitar y reemplazar sin recargar; URLs revocadas y siguiente documento procesable. |
| HU40 | Implementada | `/help/`, FAQ nativa con details/summary, comparación de modos, privacidad, limitaciones y tabla desplazable accesible; teclado y Axe en ayuda móvil. |

No se declara preservación universal de originales ni conformidad WCAG certificada. No quedan botones de demostración o datos ficticios en producción.

## Extracción: técnica y codificaciones comprobadas

La extracción llama `getOperatorList()` y resuelve `paintImageXObject`, `paintImageXObjectRepeat` y `paintInlineImageXObject` mediante objetos de PDF.js. El adaptador acepta bitmap, RGBA de 32 bits, RGB de 24 bits, gris de 8 bits y monocromo empaquetado de 1 bit con stride por fila. Crea un canvas del **objeto**, no de la página. Soft masks ya combinadas por PDF.js se reciben como alfa. Cada imagen se exporta explícitamente en PNG reconstruido.

No se extraen grupos inline compuestos ni máscaras stencil dependientes del color/composición; se registra página/operador y se ofrece convertir página. Una repetición agrupada se exporta como un objeto, no como recorte por cada aparición. Un objeto recortado, rotado o transformado se exporta independiente de la composición de página. No se reconstruyen mosaicos ni se preservan metadatos/perfiles/streams originales. Las imágenes internas en patrones o composiciones especiales pueden no aparecer como operadores de imagen de nivel superior; usar conversión cuando falten elementos.

| Fixture / codificación del PDF | Resultado real comprobado | Alcance |
|---|---|---|
| `images.pdf`: JPEG DCTDecode / DeviceRGB | 3 apariciones, 160×100 px; PNG descargable; dos duplicadas por SHA-256 | Comprobado en Chromium y motor Orca; identidad binaria JPEG original no se preserva. |
| `images.pdf`: PNG de entrada con alfa → FlateDecode + SMask | 80×60 px; PNG RGBA; alfa de pixel entre 100 y 130 (valor fuente ~0.45×255) | Comprobado mediante ZIP y sharp; transparencia conservada en este caso. |
| `gray.pdf`: DeviceGray 8 bits / FlateDecode | Una exportación 2×2 px | Comprobado; no se atribuye preservación de perfil original. |
| `mono.pdf`: DeviceGray 1 bit / FlateDecode | Una exportación 8×2 px | Comprobado en fixture con stride de un byte por fila. |
| `mask.pdf`: stencil ImageMask 1 bit | Incidencia explícita, cero objetos exportados | Exclusión intencional: color depende de composición. No se muestra éxito vacío. |
| `partial.pdf`: stencil + JPEG | 1 objeto compatible y estado parcial con incidencia | Comprobado; no se descarta el resultado útil ni se silencia la máscara. |
| `text.pdf`: texto y rectángulo vectorial | 0 objetos de imagen, alternativa de conversión; conversión produce página | Comprobado. |
| `images.pdf`: página /Rotate 90 | Conversión 300×400 px a 1×; 600×800 a 2× | Comprobado; extracción conserva orientación/dimensiones del objeto, no de la página. |
| `password.pdf`: AES-256 | Apertura local con clave, reintento y cancelación | Comprobado; no certifica toda variante RC4/AES. |
| JPX/JPEG2000, JBIG2, CCITT, CMYK/ICCBased/Spot, CMaps CJK complejos | Decodificadores/recursos locales disponibles | **Pendiente de fixtures y QA**; no se declara soporte verificado de extracción. |
| Grupos inline, patrones, mosaicos, masks compuestas especiales | Adaptador declara límites; grupos/máscaras de color generan incidencia | Pendiente de cobertura exhaustiva; conversión como alternativa. |

Las representaciones bitmap/datos las decide PDF.js por navegador; el E2E comprueba codificaciones de origen y píxeles finales, no instrumenta qué rama interna bitmap/RGB/RGBA fue usada en cada objeto. Las ramas de datos implementadas no constituyen evidencia universal por codificación.

## Robustez y memoria

Límites de aplicación: PDF 150 MB; 1000 páginas/lote; canvas 24 MP/16384 px por lado; resultados 256 MB acumulados; primeras 200 miniaturas de configuración. Fixture disperso 151 MB es rechazado antes de lectura completa; página 4000×4000 a escala 2 se rechaza por 64 MP y a escala 1 produce 16 MP. Estos casos prueban guardas concretas, no garantizan RAM disponible en teléfonos o PDF maliciosos. PDF.js puede consumir memoria de decodificación antes de la guarda de canvas.

Render/extracción se hacen por páginas secuenciales, con pausas para UI. Cada página/objeto fallido agrega incidencia. Error por objeto no se traduce en “sin imágenes” normal. Los Blob URLs de resultados y miniaturas se revocan al desmontar/reset/reemplazar; un E2E instrumenta createObjectURL/revokeObjectURL y comprueba cero URLs tras reemplazo. Los enlaces de descarga tienen revocación diferida breve. Canvas se libera en finally. El sistema de generaciones evita que tareas canceladas escriban estado obsoleto; cancelar proceso descarta sus resultados, cancelar ZIP conserva la galería.

## QA y evidencia reproducible

Comandos de validación: `npm run typecheck`, `npm run lint`, `npm run build`, `PDF_TEST_URL=http://127.0.0.1:3001 npm test`. Salida exportada: `/`, `/help/`, página estática 404 y recursos locales. `npm audit` y `npm audit --omit=dev`: cero vulnerabilidades al cierre; se actualizó sharp de pruebas y se fijó minimatch transitorio mediante override compatible con los checks ejecutados.

E2E: 19 escenarios en `tests/app.spec.ts`, con fixtures generados por `npm run fixtures` y un fixture AES-256 test-only. Última ejecución: **19/19 aprobadas en 44,0 s**; **376 peticiones observadas, cero incidencias de red externa/subidas/JS**. Resultado completo y tiempos en `qa/test-results.txt`. Capturas: `landing-{360,768,1280}.png`, `results-{360,768,1280}.png`, `modal-{360,768,1280}.png`, `selection-360.png`, `dark-360.png`, `zoom-200.png`, `help-360.png`. `orca-static-desktop.png` registra inspección en el navegador embebido Orca; se inspeccionaron visualmente landing, resultados y modal en escritorio/móvil.

`qa/network-summary.json` registra peticiones por escenario contra la exportación estática. Los hooks fallan ante cualquier origen externo o POST/PUT/PATCH, además de excepciones JS de página. Los archivos no se transmiten al servidor estático: los recursos de app/worker/fuentes son GET locales; resultados usan blob URLs. `qa/orca-network.json` es el registro complementario de la sesión Orca y puede contener GET locales de las dos sesiones dev/estática. No se considera una auditoría de todos los escenarios o dependencias futuras.

| Navegador / medio | QA efectuada | Limitación |
|---|---|---|
| Playwright Chromium 159.0.8154.6, macOS arm64 | Suite estática, descargas reales, red, tamaños 360/768/1280, modal, teclado y Axe 4.14 | Emulación de viewport; no dispositivo físico. |
| Navegador embebido Orca | Apertura local, carga real, extracción por teclado, lectura de estado, captura y red local | Inspección puntual; no se afirma equivalencia con Safari/Firefox. |
| Safari | Intento de crear sesión WebDriver | Rechazado: “You must enable Allow remote automation…”. **No probado**; no se alteró esa preferencia. |
| Firefox | No hay binario de prueba instalado en esta sesión | **No probado**. |
| Lector de pantalla | No sesión de lector disponible/configurada | **No probado**. Axe/teclado no sustituyen revisión manual. |
| Zoom 200 % | `documentElement.style.zoom='2'`, screenshot y ausencia de overflow | Zoom de interfaz nativo pendiente. |

No se probó exhaustivamente consumo de memoria de dispositivos de gama baja, ZIP de cientos de MB, todos los espacios de color, codificaciones especiales, CJK ni corrupción arbitraria. Esos límites quedan visibles aquí; los errores recuperables están implementados.

## Despliegue y pendientes

`output: 'export'` y `trailingSlash: true` producen `out/`; servir su contenido completo con MIME `.mjs/.wasm` correcto. No se necesita servidor Next, API o secreto. Configurar el hosting estático con build `npm run build` y salida `out`. Asume raíz de dominio; adaptar rutas si se publica bajo subcarpeta. HTTPS recomendado y necesario para funciones seguras del navegador fuera de localhost. Sin dominio confirmado no se inventó canonical/sitemap ni se publicó nada.

Pendientes: supervisión de recorte del favicon, preservación opcional de streams originales cuando sea demostrable, miniaturas de página 201+, zoom nativo, Safari/Firefox, lector de pantalla y corpus de codificaciones especiales. Son mejoras/QA explícitos; el procesamiento local y las descargas comprobadas ya son funcionales.

Preview persistente: `http://127.0.0.1:3001`, terminal Orca `term_6503c26e-2fbc-4f3e-9098-a0998405d64a`, comando `npx cross-env NO_UPDATE_CHECK=1 serve out -l 3001`, PID de servidor 54059 en la verificación de puertos. El proyecto conserva scripts reales de desarrollo, build y preview en package.json.

## Referencias primarias consultadas

- [Next.js: exportación estática](https://nextjs.org/docs/app/guides/static-exports).
- [PDF.js: ejemplo oficial de carga/render](https://github.com/mozilla/pdf.js/blob/master/examples/learning/helloworld.html).
- [shadcn/ui: Dialog](https://v3.shadcn.com/docs/components/dialog).
- Implementación y tipos **de la versión instalada**: `node_modules/pdfjs-dist/build/pdf.mjs`, `types/src/display/api.d.ts`; en PDF.js 6 se destruye el documento mediante `document.loadingTask.destroy()`.
