# PachaPDF — Especificación de producto, UI/UX, historias de usuario y guía para agente

**Versión:** 1.0 — 13 de noviembre de 2026  
**Marca:** PachaPDF · by PachaTech  
**Sitio corporativo:** https://pachatech.pro/  
**Referencia visual oficial:** `assets/pachapdf-logo-aprobado.png` (aportado y aprobado por el propietario).  
**Stack:** Angular standalone + TypeScript + Tailwind CSS + PDF.js (`pdfjs-dist`) + JSZip. Sólo frontend; sin backend, login ni base de datos.

## 0. Directrices no negociables

1. Aplicación 100 % del lado del cliente. PDF, contraseña, miniaturas y resultados no deben salir del navegador. No usar APIs externas de conversión; no incluir telemetría que capture archivos.
2. Mantener **exactamente el logo aprobado**. No reconstruirlo con IA ni sustituirlo por un icono genérico. Guardar el asset local en `public/brand/`; usar imagen proporcionada y ajustar el encuadre con CSS. **El documento blanco forma parte del logo**: no eliminar sus blancos internos. Para favicon, producir versiones 16, 32, 48, 180, 192, 512 px a partir del arte original tras un recorte y limpieza supervisados.
3. Lenguaje UI: español, con arquitectura preparada para inglés; no hacer bilingüismo obligatorio en MVP.
4. No prometer que PDF.js recuperará todas las imágenes originales de todos los PDF. Algunos objetos son máscaras, vectores, imágenes divididas o codificaciones especiales. Extraer lo compatible e informar limitaciones. El modo **Convertir páginas** es alternativa, no reemplazo silencioso.
5. No simular éxito: descargas, conteos, dimensiones, miniaturas y porcentajes deben proceder de datos reales.
6. Respetar accesibilidad WCAG 2.2 AA en contraste, control de foco, uso de teclado y tamaños táctiles.
7. El producto debe verse y funcionar profesionalmente en móvil y escritorio; nada de pantallas decorativas sin funcionalidad.

## 1. Identidad de marca y design system

### 1.1 Identidad
- Marca principal: **PachaPDF**. Firma secundaria: **by PachaTech**.
- Claim: **Tus PDF, tus imágenes, tu privacidad.**
- Microcopy: **Extrae imágenes y convierte páginas PDF sin subir tus archivos a un servidor.**
- Logo oficial: usar `assets/pachapdf-logo-aprobado.png` sin modificaciones inventadas; contiene llamita morada, contorno turquesa, documento con símbolo de imagen y flecha ascendente turquesa.
- Personalidad: amigable, tecnológica, eficiente, confiable. No usar iconografía «corporativa azul» genérica.

### 1.2 Tokens de color (aproximación basada en el logo; afinar con muestreo real)
```
--brand-purple: #55166A;
--brand-purple-dark: #3A0D4C;
--brand-turquoise: #00CEB0;
--brand-turquoise-dark: #008C78;  /* texto accesible sobre blanco */
--brand-lilac: #F4EBF7;
--surface-light: #FFFFFF;
--canvas-light: #FAF9FC;
--text-light: #21182A;
--muted-light: #665E6E;
--border-light: #E9E3ED;
--surface-dark: #211429;
--canvas-dark: #160F1D;
--text-dark: #F7F3F9;
--muted-dark: #C9BDCE;
--border-dark: #45354E;
--success: #15803D;
--danger: #B42318;
--warning: #9A6700;
```
Usar turquesa brillante principalmente en bordes, acentos e iconos; no como texto pequeño sobre blanco. Validar contraste AA y derivar tonos hover/pressed/deshabilitado.

### 1.3 Diseño visual
- Fuente: **Inter** (fall back: system-ui, sans-serif). Títulos peso 700/800, cuerpo 400/500.
- Tamaños: H1 48/56 escritorio, 32/40 móvil; H2 32/40 escritorio, 26/34 móvil; H3 22/30; body 16/26; small 14/21.
- Ancho máximo: 1180–1200 px; página con `padding-inline` 24 px escritorio / 16 px móvil.
- Espaciado: base 4 px; escala 4/8/12/16/24/32/48/64/96.
- Radios: tarjetas 20 px; botones 12 px; input 12 px; tags 999 px.
- Botón primario: morado con texto blanco; secundario: contorno morado; acento: turquesa.
- Hero sin ilustraciones genéricas. Priorizar logo real, tipografía fuerte, upload prominente, ventajas verificables.
- Iconos: Lucide; grosor consistente 1.8–2.
- Animaciones: 150–220 ms; respetar `prefers-reduced-motion`.
- Sombras: suaves y escasas; preferir contorno y espacio en blanco.

### 1.4 Breakpoints
- Móvil compacto 320–479 px: una columna; header compacto; toolbar de descargas fija al fondo cuando hay selección; botones ancho completo.
- Móvil grande 480–767 px: 1–2 columnas según ancho; modales en pantalla completa.
- Tablet 768–1023 px: 2 columnas; controles principales en fila.
- Desktop >=1024 px: galería 3–4 columnas; panel lateral opcional de filtros.

### 1.5 Componentes globales
`AppHeader`, `BrandLogo`, `ThemeToggle`, `AppButton`, `FileDropzone`, `PdfSummaryCard`, `ToolCard`, `PageRangeInput`, `FormatToggle`, `QualityControl`, `ProgressPanel`, `ImageGrid`, `ImageTile`, `SelectionToolbar`, `ImagePreviewDialog`, `DownloadZipDialog`, `EmptyState`, `ErrorBanner`, `ToastHost`, `AppFooter`, `HelpAccordion`, `ConfirmDialog`.

**Estados obligatorios por componente:** idle, hover, focus-visible, active, disabled, loading, success/error cuando aplique. Skeletons sólo durante actividad real.

## 2. Mapa de navegación y flujo

```
/  Landing / Dropzone
  └─ PDF válido → /workspace (resumen y elección de herramienta)
       ├─ Extraer imágenes → /workspace/extract (configurar)
       └─ Convertir páginas → /workspace/convert (configurar)
              ↓
         /workspace/processing
              ↓
         /workspace/results?mode=extract|convert
              ├─ Modal vista previa
              ├─ Descargar individual
              ├─ Descargar seleccionadas/todas como ZIP
              ├─ Cambiar modo sin recargar el PDF
              └─ Nuevo PDF → /
/help  Ayuda, privacidad y limitaciones
```
Las rutas son recomendadas; el equipo puede usar estado dentro de una SPA, pero las vistas deben ser diferenciables y la navegación atrás debe mantener coherencia.

## 3. Pantallas y requerimientos UI — especificación visual y funcional

### UI-01 — Landing + carga (P0)
**Ruta/ubicación:** `/`  
**Elementos:** Hero, barra navegación, card dropzone, privacidad, cómo funciona, FAQs, footer.  
**Estados:** empty, dragover, validating, valid, error.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-02 — Archivo cargado y selección de herramienta (P0)
**Ruta/ubicación:** `/workspace`  
**Elementos:** Resumen de PDF, botón cambiar/eliminar, cards Extract Images / Pages to Images, continuar.  
**Estados:** ready, unsupported, password-required.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-03 — Configuración de extracción (P0)
**Ruta/ubicación:** `/workspace/extract`  
**Elementos:** Selector todas/intervalo páginas, exclusión opcional de miniaturas, aviso sobre limitaciones, empezar.  
**Estados:** default, invalid-range, processing.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-04 — Configuración de conversión (P0)
**Ruta/ubicación:** `/workspace/convert`  
**Elementos:** Selector PNG/JPG, escala 1x/1.5x/2x, calidad JPG, todas/páginas específicas, estimación orientativa.  
**Estados:** default, invalid-range, processing.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-05 — Procesamiento (P0)
**Ruta/ubicación:** `/workspace/processing`  
**Elementos:** Archivo, operación, progreso por páginas procesadas, indicador sin porcentaje si no se conoce, cancelar.  
**Estados:** pending, running, cancelling, cancelled, failed.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-06 — Resultados de extracción (P0)
**Ruta/ubicación:** `/workspace/results?mode=extract`  
**Elementos:** Resumen total, galería, página origen, tamaño, resolución, selección, filtros, descargar.  
**Estados:** success, empty, partial, error.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-07 — Resultados de conversión (P0)
**Ruta/ubicación:** `/workspace/results?mode=convert`  
**Elementos:** Galería de páginas con números de página, acciones seleccionar/descargar, formato.  
**Estados:** success, partial, error.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-08 — Vista previa (P1)
**Ruta/ubicación:** `modal`  
**Elementos:** Dialog de imagen con zoom fit/100%, descargar, anterior/siguiente, cerrar.  
**Estados:** opened, image-error.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-09 — Preparación de ZIP (P0)
**Ruta/ubicación:** `modal/progress`  
**Elementos:** Cantidad de imágenes, progreso o indeterminado, error, cierre tras descargar.  
**Estados:** creating, completed, failed.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-10 — Estados de error y avisos (P0)
**Ruta/ubicación:** `shared`  
**Elementos:** Toasts, banner por PDF cifrado/corrupto, problema de memoria, objeto no soportado, error por archivo.  
**Estados:** invalid-file, protected, corrupted, out-of-memory, unsupported.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-11 — Sin resultados (P0)
**Ruta/ubicación:** `shared`  
**Elementos:** Ilustración simple, mensaje no hay imágenes incrustadas, convertir páginas como alternativa.  
**Estados:** zero-images, filtered-empty.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-12 — Ayuda / FAQ / privacidad (P1)
**Ruta/ubicación:** `/help`  
**Elementos:** Diferencia entre extraer y convertir, procesamiento local, tipos PDF, consejos, limitaciones.  
**Estados:** default.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-13 — Acerca de + PachaTech (P1)
**Ruta/ubicación:** `footer`  
**Elementos:** Enlace a pachatech.pro, atribución, sin métricas que suban el PDF.  
**Estados:** default.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### UI-14 — Responsive y tema (P0)
**Ruta/ubicación:** `global`  
**Elementos:** Header móvil, zonas táctiles, grid responsivo, modo oscuro, focus visible, reducción movimiento.  
**Estados:** mobile, tablet, desktop, dark, light.
**Comportamiento y responsive:** jerarquía visual clara; llamadas a la acción contextuales; mensajes explicativos y feedback accesible. En ≤767 px pasar a columna única o drawer, sin scroll horizontal. Todos los botones/inputs con foco visible y etiquetas útiles.

### 3.1 Especificación detallada de contenido y microcopy

**Landing UI-01 (arriba a abajo):**
- Header: logo cuadrado recortado + palabra `PachaPDF` + texto discreto `by PachaTech`; links `Herramientas`, `Cómo funciona`, `Ayuda` y toggle de tema. Menú desplegable accesible en móvil.
- Hero: eyebrow `HERRAMIENTAS PDF EN TU NAVEGADOR`; H1 `Tus PDF, tus imágenes, tu privacidad.`; texto secundario `Extrae las imágenes de tus documentos o convierte cada página en PNG o JPG, sin subir archivos a ningún servidor.`
- Dropzone: icono subir, título `Arrastra un PDF aquí`, secundario `o selecciona un archivo desde tu dispositivo`, botón `Seleccionar PDF`, ayuda `El archivo se procesa únicamente en tu navegador`. Input `accept=application/pdf,.pdf` **sin confiar sólo en la extensión**.
- Beneficios 3 cards: `Privado por diseño`, `Descargas en un clic`, `Sin registro`.
- Bloque 2 herramientas con explicación y CTA `Probar ahora` que enfoque dropzone.
- Cómo funciona 3 pasos: `Sube`, `Elige`, `Descarga`.
- FAQ (cuatro a seis preguntas). Footer con copyright dinámico, PachaTech y política de privacidad real: si no existe, explicar procesamiento local sin inventar páginas legales.

**Selección UI-02:** barra de avance visual `Archivo → Herramienta → Resultados` (no debe prometer pasos exactos si cambian); tarjeta PDF con ícono, nombre truncado accesiblemente, peso, número páginas, `Cambiar PDF` y `Quitar`; cards con icono y subtítulo:
- `Extraer imágenes originales` / `Recupera fotografías e imágenes incrustadas. Los resultados dependen del PDF.`
- `Convertir páginas a imágenes` / `Guarda cada página completa como PNG o JPG.`
- CTA `Continuar` deshabilitada hasta elegir modo.

**Configuración UI-03:** título `Extraer imágenes`, resumen del PDF, selector `Todas las páginas` / `Elegir páginas`; editor acepta `1-3, 5, 8-10`; ayuda sobre imágenes no extraíbles o vectoriales; primario `Extraer imágenes` y link `Volver`.

**Configuración UI-04:** `Convertir páginas`; formato PNG/JPG; ajuste de calidad JPG (p.ej. 80, 90, 100), escala 1×, 1.5×, 2×; advertir que mayor escala aumenta memoria y peso; elegir todas o rango; primario `Convertir páginas`.

**Procesamiento UI-05:** `Estamos procesando tu PDF`; nombre + modo; `Página 5 de 20` y barra de avance si hay total conocido, o barra indeterminada; acción `Cancelar`; si cancela limpiar resultados parciales y explicar `Procesamiento cancelado`.

**Resultados UI-06/07:** encabezado `Tus imágenes están listas` (si completas), o `Se obtuvieron resultados parciales` (si hubo errores); contador `N imágenes · M páginas analizadas`; filtros y selector todo, cards con thumb de objeto URL, checkbox, nombre, `Página N`, `W × H`, extensión y botón de descarga; CTA fijo `Descargar seleccionadas (.zip)`; barra secundaria `Cambiar herramienta` y `Nuevo PDF`.

**Sin resultados UI-11:** `No encontramos imágenes extraíbles en este PDF` + explicación `Este documento podría contener gráficos vectoriales, imágenes no compatibles o sólo texto.` + primario `Convertir páginas` + secundario `Probar otro PDF`. Nunca presentar error genérico como cero imágenes.

**Diálogo preview UI-08:** imagen encajada (sin estirar), metadata, controles accesibles previo/siguiente/descargar/cerrar, navegación con flechas opcional y botón Escape, foco atrapado.

**Errores UI-10:** al menos `No pudimos abrir este PDF. Comprueba que el archivo no esté dañado.`, `Este PDF requiere una contraseña.`, `No hay memoria suficiente para procesar todas las páginas a esta resolución. Prueba con menos páginas o menor escala.`, `Algunas imágenes de este PDF usan un formato que no podemos extraer directamente.`

**Ayuda UI-12:** explicar: `Extraer imágenes` busca objetos de imagen incrustados (puede no captar vectores ni composiciones); `Convertir páginas` genera una captura renderizada de la página; no se suben archivos; para PDF escaneado probablemente conviene convertir páginas (si es una sola imagen grande por hoja, puede también aparecer como imagen incrustada).

## 4. Catálogo completo de historias de usuario (40)

Formato: **Como usuario de PachaPDF, quiero [acción], para [beneficio]**. Cada fila ofrece un criterio de aceptación verificable, equivalente a un escenario Gherkin abreviado.

| Épica | ID | Historia de usuario (quiero...) | Prio | Criterio de aceptación |
|---|---|---|---|---|
| Carga | HU01 | Seleccionar PDF desde el dispositivo | P0 | Dado que no hay archivo, cuando elijo un PDF válido, se muestra nombre, peso y páginas. |
| Carga | HU02 | Arrastrar y soltar un PDF | P0 | Al soltar un PDF sobre la dropzone se carga; el estado hover es visible y accesible. |
| Carga | HU03 | Validar el contenido del PDF | P0 | Si el archivo no es PDF o la biblioteca no lo abre, aparece error y se permite reintentar. |
| Carga | HU04 | Ver metadatos del archivo | P0 | Tras cargar, aparecen nombre, tamaño y número de páginas correctos. |
| Carga | HU05 | Reemplazar o eliminar archivo | P0 | Al reemplazar se limpian previews, blobs y selecciones del PDF anterior. |
| Carga | HU06 | Gestionar PDF dañado | P0 | Si la lectura falla, se informa sin bloquear el resto de la interfaz. |
| Carga | HU07 | Abrir PDF protegido con contraseña | P1 | Si la librería pide contraseña, se solicita localmente y se informa si es incorrecta. |
| Extracción | HU08 | Extraer imágenes incrustadas | P0 | Se extraen los objetos compatibles con una lista de incidencias si hay fallos parciales. |
| Extracción | HU09 | Mostrar página de origen | P0 | Cada resultado indica la página del PDF en la que se encontró. |
| Extracción | HU10 | Preservar calidad disponible | P0 | Se evita recomprimir sin necesidad; cuando hay conversión, se informa el formato de salida. |
| Extracción | HU11 | Informar cero imágenes | P0 | Si no hay resultados, se presenta un estado vacío con opción de convertir páginas. |
| Extracción | HU12 | Extraer rango de páginas | P1 | Se aceptan expresiones como 1-3,5; entradas fuera de rango muestran error. |
| Extracción | HU13 | Filtrar por dimensiones | P1 | Filtrar por ancho y alto devuelve sólo resultados que cumplen. |
| Extracción | HU14 | Omitir imágenes pequeñas | P2 | Un umbral configurable oculta íconos pequeños sin borrar datos originales. |
| Extracción | HU15 | Identificar imágenes duplicadas | P2 | Las duplicadas detectadas se señalan y pueden ocultarse opcionalmente. |
| Conversión | HU16 | Convertir páginas completas | P0 | Cada página solicitada produce una imagen descargable con texto y gráficos renderizados. |
| Conversión | HU17 | Elegir formato PNG/JPG | P0 | La salida y extensión de descarga coinciden con el formato escogido. |
| Conversión | HU18 | Elegir escala/calidad | P1 | Escala y calidad ajustan resolución/peso estimado de la salida. |
| Conversión | HU19 | Elegir páginas específicas | P1 | Se procesan sólo los números solicitados y se respeta su orden natural. |
| Conversión | HU20 | Previsualizar páginas antes de convertir | P1 | Se muestra miniatura de páginas y selección con carga progresiva. |
| Galería | HU21 | Ver galería de resultados | P0 | Cada resultado muestra miniatura y controles; imágenes no cargadas muestran fallback. |
| Galería | HU22 | Ampliar imagen en modal | P1 | Un clic/Enter abre vista previa navegable; Esc cierra y devuelve foco. |
| Galería | HU23 | Consultar dimensiones, formato y tamaño | P1 | Cada tarjeta expone metadatos correctos o indica no disponible. |
| Galería | HU24 | Seleccionar imágenes específicas | P0 | Checkbox por tarjeta altera el contador y el conjunto para ZIP. |
| Galería | HU25 | Seleccionar/deseleccionar todas | P1 | El control respeta el conjunto de resultados visibles al aplicar filtros. |
| Galería | HU26 | Ordenar resultados | P2 | Orden por página y dimensiones es estable y reversible. |
| Descargas | HU27 | Descargar imagen individual | P0 | Al hacer clic se descarga el archivo correcto sin enviar datos a red. |
| Descargas | HU28 | Descargar todas en ZIP | P0 | El ZIP incluye los resultados y nombres únicos, conservando extensiones. |
| Descargas | HU29 | Descargar seleccionadas en ZIP | P0 | Si hay selección, se comprimen sólo esas imágenes; cero selección deshabilita acción. |
| Descargas | HU30 | Nombres descriptivos de archivos | P0 | Nombre incluye modo, página y número; sin colisiones y saneado. |
| Descargas | HU31 | Mostrar progreso al crear ZIP | P1 | Mientras se prepara ZIP se muestra feedback y errores recuperables. |
| UX | HU32 | Informar avance procesamiento | P0 | Progreso se basa en páginas completadas, sin porcentaje inventado. |
| UX | HU33 | Mostrar mensajes claros | P0 | Éxito/error/advertencia explican causa y próxima acción sin tecnicismos. |
| UX | HU34 | Ser responsive | P0 | Se usa correctamente en 360px, 768px, 1280px y con zoom 200%. |
| UX | HU35 | Cambiar tema claro/oscuro | P1 | Se puede alternar y recordar preferencia local sin subir datos. |
| UX | HU36 | Cancelar operación | P1 | Se detiene el proceso cuando se pueda y se liberan recursos parciales. |
| UX | HU37 | Accesibilidad de teclado/lectores | P0 | Foco visible, etiquetas, mensajes anunciados y orden lógico. |
| UX | HU38 | Explicar privacidad local | P0 | Se explica que archivos no se envían a un servidor y se verifica ausencia de uploads. |
| UX | HU39 | Empezar nuevamente sin recargar | P0 | Nuevo archivo limpia estado del anterior y permite procesar inmediatamente. |
| UX | HU40 | Consultar ayuda breve | P1 | Explica diferencias entre modos y limitaciones con lenguaje sencillo. |

### 4.1 Gherkin base para QA

```gherkin
Característica: Cargar un PDF válido
  Escenario: Carga correcta
    Dado que estoy en la página principal
    Cuando selecciono un archivo PDF válido
    Entonces veo su nombre, tamaño y número de páginas
    Y puedo seleccionar una herramienta

Característica: Extraer imágenes de un PDF
  Escenario: Extracción con imágenes compatibles
    Dado que he cargado un PDF que contiene imágenes compatibles
    Cuando presiono "Extraer imágenes"
    Entonces veo progreso real de páginas procesadas
    Y veo las imágenes obtenidas con la página de origen
    Y puedo descargarlas individualmente o en un ZIP

  Escenario: Sin imágenes compatibles
    Dado que he cargado un PDF sin imágenes extraíbles
    Cuando finaliza la extracción
    Entonces veo un estado vacío explicativo
    Y puedo pasar al modo "Convertir páginas"

Característica: Convertir páginas
  Esquema del escenario: Conversión según formato
    Dado que he cargado un PDF con varias páginas
    Y he elegido el formato <formato>
    Cuando inicio la conversión
    Entonces las páginas seleccionadas se descargan en <extension>
    Ejemplos:
      | formato | extension |
      | PNG     | .png      |
      | JPG     | .jpg      |

Característica: Descargar selección
  Escenario: ZIP sólo de seleccionadas
    Dado que tengo cinco imágenes en la galería
    Y he seleccionado dos
    Cuando hago clic en "Descargar seleccionadas"
    Entonces se genera un ZIP local con exactamente dos imágenes
    Y no se incluye ninguna imagen no seleccionada

Característica: Seguridad y privacidad
  Escenario: Procesamiento local
    Dado que he abierto PachaPDF
    Cuando cargo un PDF y extraigo imágenes
    Entonces el archivo y sus contenidos no se envían a ningún servidor
    Y las miniaturas y objetos temporales se liberan al empezar un nuevo archivo
```

## 5. Especificación técnica para el agente

### 5.1 Arquitectura recomendada Angular

```
src/app/
  core/
    pdf/pdf-reader.service.ts
    pdf/pdf-image-extraction.service.ts
    pdf/pdf-page-render.service.ts
    pdf/pdf-worker.config.ts
    files/file-validation.service.ts
    download/download.service.ts
    state/workspace.store.ts
  shared/ui/
    button/ dropzone/ dialog/ toast/ progress/ empty-state/
  features/
    landing/
    workspace/
      tool-selector/
      extract-settings/
      convert-settings/
      processing/
      results/
      image-preview/
    help/
  app.routes.ts
  app.component.ts
public/brand/pachapdf-logo-aprobado.png
```
- Angular standalone components, Signals para estado de archivo/mode/progress/results/selection; `ChangeDetectionStrategy.OnPush`.
- PDF.js para cargar y renderizar páginas; usar `pdfjs-dist` con worker local configurado y build versionada.
- Extracción de imágenes **no** equivalente a `page.render(canvas)`. Hacer un spike técnico real con PDF.js operator list y recursos de imagen, investigar representación de máscaras/decodificación/sRGB/transparencia, y crear un adaptador de extracción; documentar los casos no compatibles.
- Si PDF.js no cubre suficientemente la extracción, evaluar bibliotecas que realmente funcionen en navegador, con licencias compatibles, bundles y desempeño razonables. No usar servicios externos ni servidor.
- Convertir páginas mediante render a canvas y `canvas.toBlob()`, PNG/JPEG; limpiar canvas y `URL.revokeObjectURL` tras uso. Procesar páginas de forma secuencial o con concurrencia pequeña para no agotar memoria.
- JSZip para generar el ZIP; usar progreso real si la librería lo informa.
- Usar `File` local, `Blob`, `ObjectURL`; nunca persistir PDF en localStorage/indexedDB por defecto.
- Validación: MIME/extensión orientativas; comprobar firma `%PDF-` y apertura real con PDF.js. Límite de tamaño configurable por recursos del dispositivo, con mensaje claro; no imponer un valor fijo sin prueba.
- Proteger contra range masivo, ZIP grande, PDF corrupto, contraseña incorrecta, asignaciones de memoria excesivas. Cancelación cooperativa.
- Dependencias de terceros empaquetadas localmente; verificar requests de red con DevTools en todo el flujo.
- PDF con imágenes que requieren transformación/decodificación: no atribuir formato original si se ha reconstruido a PNG; etiquetar descarga como **exportación** cuando corresponda.

### 5.2 Interfaces / modelos TypeScript propuestos

```ts
type ToolMode = 'extract' | 'convert';
type JobStatus = 'idle' | 'loading' | 'ready' | 'processing' |
  'complete' | 'partial' | 'empty' | 'cancelled' | 'error';

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'original';

interface PdfDocumentInfo {
  name: string;
  sizeBytes: number;
  pageCount: number;
  passwordRequired?: boolean;
}

interface ResultImage {
  id: string;
  mode: ToolMode;
  sourcePage: number;
  sequenceOnPage: number;
  fileName: string;
  blob: Blob;
  previewUrl: string;
  mimeType: string;
  format: OutputFormat;
  width: number;
  height: number;
  byteSize: number;
  isReencoded: boolean;
  extractionWarning?: string;
}

interface ProcessingProgress {
  status: JobStatus;
  processedPages: number;
  totalPages: number;
  extractedCount: number;
  message?: string;
}

interface PageSelection {
  mode: 'all' | 'custom';
  pages: number[]; // 1-based, unique, increasing
}
```

### 5.3 Diseño de estado
`selectedFile: File | null`, `pdfInfo`, `pdfDocument` (recurso interno), `mode`, `pageSelection`, `convertSettings`, `progress`, `results`, `selectedResultIds: Set<string>`, `filter`, `sort`, `previewId`, `theme`. Liberar PDF document, canvas y `ObjectURL` al reset/destrucción. No intentar serializar blobs a almacenamiento permanente.

### 5.4 Formato de descargas
- Extraer: `pachapdf_extract_p003_img002.png` o extensión real; usar nombres únicos y recordar si se reconstruyó imagen.
- Convertir: `pachapdf_page_003.png` / `.jpg`.
- ZIP: `pachapdf_nombre-documento_extract_YYYY-MM-DD.zip` o `_convert_...zip`, limpiando caracteres peligrosos.
- Deshabilitar botones de descarga sin resultados. Estado ZIP explicativo y feedback tras finalización.

### 5.5 Rendimiento, accesibilidad, robustez
- No congelar la UI: worker de PDF.js y procesado por lotes; no generar cientos de miniaturas simultáneas.
- Lazy-loading para thumbnails, virtualización opcional si hay cientos de resultados.
- Manejar componentes canvas de enorme tamaño, CORS innecesario (no aplica al PDF local), cuotas de memoria y compatibilidad Safari/Firefox/Chromium.
- Tamaño mínimo target recomendado ≥44×44 CSS px en táctil; `aria-live` para estado/progreso; navegación de teclado; foco devuelto desde diálogo; mensajes `role=alert` para errores.
- SEO en landing: título, meta description, Open Graph, favicon, `robots.txt`, `sitemap.xml` si procede. No almacenar PDF en analytics. Publicación estática en Vercel, Netlify o Cloudflare Pages.
- Política de privacidad de una página breve si se publica; no afirmar "sin cookies" si alguna dependencia las usa.

## 6. Matriz de pruebas / Definition of Done

**Muestras mínimas de PDF:** PDF sólo texto; PDF fotos JPEG; PNG con transparencia; múltiples imágenes en una página; archivo escaneado; PDF con vectores; imagen enmascarada; PDF con contraseña; PDF corrupto; PDF grande; imágenes duplicadas; páginas rotadas; PDF de alta resolución.

**Casos QA:** upload por clic/drop, inválido, archivo nuevo sin recarga, límites de páginas, ZIP correcto, descargas individuales, modo PNG/JPG, cancelación, errores parciales, no-resultados, tema, responsive 320/375/768/1280, zoom 200%, teclado, lectores, Safari/Firefox/Chrome, sin red. Verificar en la pestaña Network que jamás haya POST/PUT del archivo ni descarga del contenido por terceros.

**Definition of Done para cualquier HU:** UI diseñada y responsive; estados idle/loading/empty/error; tipado TS; prueba manual o automática; accesibilidad básica; sin warnings de consola; sin dependencia de servidor; documentación actualizada.

## 7. Priorización para sprints

- **Sprint 1 — Identidad, design system y UI:** logo exacto; tokens; landing, workspace, formularios, resultados, modales y estados; responsive; historia UX crítica.
- **Sprint 2 — Core PDF:** carga/validación, error, metadatos, render de páginas, worker, cancelación y cleanup.
- **Sprint 3 — Extracción real:** spike técnico, matriz de casos compatibles, implementación, fallos parciales, mensajes de limitación.
- **Sprint 4 — Galería y descargas:** selección, preview, ZIP, filtros básicos, procesamiento real.
- **Sprint 5 — QA y deploy:** accesibilidad, rendimiento, casos extremos, SEO, documentación, portfolio y publicación.

MVP = todos los P0; P1 antes del lanzamiento público recomendado; P2 como mejoras. No cortar estados de error/privacidad/accesibilidad del MVP.

## 8. Criterios de evaluación y demostración para portafolio

- Caso de estudio: problema, solución, arquitectura cliente, retos de PDF.js, capturas responsive, accesibilidad, privacidad, resultados reales y decisiones técnicas.
- README de GitHub con instrucciones `npm install` / `npm start` (ajustar a package.json), screenshot desktop/móvil, capacidades y limitaciones verificadas, enlace a sitio y a PachaTech.
- Flujo demo: subir PDF real → modo extraer → revisar y seleccionar → descargar ZIP → cambiar modo → convertir páginas → descargar imagen.
- No maquillar como "extracción sin pérdida en todos los PDFs"; la precisión técnica es parte del valor de portafolio.
