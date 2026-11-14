# PachaPDF — Documentación de Ayuda, Privacidad y Criterios Técnicos

**Versión:** 1.1 — Noviembre 2026  
**Marca:** PachaPDF · by PachaTech  
**Sitio corporativo:** [pachatech.pro](https://pachatech.pro/)  
**Historias de usuario cubiertas:** HU38 (Privacidad local), HU40 (Ayuda y diferencias), UI-12 (Pantalla /help), UI-13 (Footer institucional y atribución), HU34 (Responsive y escalabilidad visual) y HU37 (Accesibilidad de teclado y contraste).

---

## 1. Resumen ejecutivo y arquitectura

PachaPDF es una aplicación web para el procesamiento de documentos PDF diseñada bajo el principio de **privacidad local del lado del cliente**. Ofrece dos herramientas complementarias:

1. **Extraer imágenes incrustadas:** Recupera los objetos de imagen almacenados dentro de la estructura interna del documento sin incluir el texto ni los márgenes de la página.
2. **Convertir páginas a imágenes:** Renderiza la composición visual completa de cada página en formato gráfico (PNG o JPG).

El procesamiento (lectura del archivo binario, decodificación con PDF.js, renderizado sobre lienzo `<canvas>` y empaquetado en archivo ZIP) se ejecuta en el navegador web del usuario. No se emplean servidores de conversión intermedios, bases de datos remotas ni servicios analíticos que capturen el contenido del documento.

---

## 2. Modelo de privacidad local por diseño (HU38)

### 2.1 Principios de funcionamiento del lado del cliente
* **Cero transferencias a servidores:** El archivo seleccionado mediante el selector o la zona de arrastre se carga en la memoria del navegador utilizando la API estándar de archivos.
* **Ciclo de vida en memoria de sesión:** La información se procesa en memoria volátil. Al sustituir el PDF o cerrar la pestaña, las referencias a los datos temporales son revocadas (`URL.revokeObjectURL()`) y liberadas por el recolector de memoria del navegador. No se almacena contenido en bases de datos locales permanentes como `localStorage` o `IndexedDB`.
* **Preferencias mínimas:** `localStorage` se utiliza exclusivamente para persistir preferencias no identificables de interfaz, como el tema visual (claro u oscuro).

### 2.2 Procedimiento de auditoría de red
Cualquier usuario puede auditar el comportamiento de la aplicación de manera independiente:
1. Abrir las **Herramientas de Desarrollador** del navegador (<kbd>F12</kbd> o <kbd>Ctrl+Shift+I</kbd>).
2. Seleccionar la pestaña **Red (Network)** y filtrar por `Fetch/XHR`.
3. Cargar un PDF, ejecutar una extracción o conversión y descargar los resultados.
4. **Criterio observable:** No debe registrarse ninguna solicitud `POST` o `PUT` ni transferencia del archivo hacia servidores externos.

> **Alcance de la revisión y límites:** Esta documentación detalla la arquitectura técnica diseñada para asegurar la privacidad y el procedimiento de comprobación en navegador. No se certifica una verificación de red en entornos no ejecutados en esta sesión; queda como tarea de QA verificar el comportamiento en todos los navegadores de soporte meta (Chrome, Firefox, Safari, Edge).

---

## 3. Comparativa técnica: Extracción vs. Conversión (HU40)

| Parámetro | Extraer imágenes incrustadas | Convertir páginas a imágenes |
|---|---|---|
| **Mecanismo técnico** | Inspección de la lista de recursos internos del PDF (`XObject`, `Subtype: Image`) para extraer objetos de mapa de bits individuales. | Renderizado de la escena visual completa de la página sobre un elemento HTML5 `<canvas>` mediante el motor PDF.js. |
| **Contenido obtenido** | Fotografías e ilustraciones raster aisladas, sin texto ni fondos circundantes. | Imagen completa de la página: fuentes tipográficas, curvas vectoriales, tablas y fondos. |
| **Resolución** | Resolución nativa con la que fue incrustado el mapa de bits. | Variable según la escala seleccionada: 1× (72 DPI base), 1.5× (108 DPI) o 2× (144 DPI). |
| **Formato de salida** | PNG (cuando requiere recomposición alfa o exportación estándar). | PNG (fidelidad sin pérdida) o JPG (con control de compresión). |
| **Casos de uso** | Recuperar fotografías o figuras aisladas de un informe o folleto. | Presentaciones, diagramas vectoriales, formularios o páginas mixtas que deben conservarse íntegras. |
| **Comportamiento ante incidencias** | Si la página no contiene mapas de bits, informa cero imágenes y ofrece alternar al modo de conversión. | Si una página contiene fuentes malformadas, datos dañados o agota la memoria, la conversión de esa página puede fallar y debe reportarse como error recuperable. |

---

## 4. Fidelidad de imagen y exportación PNG

En el formato PDF, las imágenes no se almacenan obligatoriamente como archivos autónomos idénticos a los del disco duro del autor. Con frecuencia se guardan como flujos binarios de muestras de color comprimidos mediante algoritmos internos (como `FlateDecode` o `DCTDecode`) junto con parámetros de espacio de color o máscaras de transparencia.

### Alcance de la fidelidad técnica:
* **Exportación en formato PNG:** Al procesar la imagen en el navegador, se genera un nuevo contenedor estándar en formato PNG para permitir su descarga y uso universal.
* **No equivalencia bit a bit:** El archivo resultante preserva la resolución de píxeles visible en el documento, pero **no constituye necesariamente una réplica bit a bit del archivo fotográfico original**, dado que metadatos EXIF de la cámara, comentarios binarios originales o perfiles ICC incrustados de autor suelen perderse durante la maquetación del PDF.
* **Ajuste de perfiles de color:** Los navegadores operan en el espacio sRGB estándar. Imágenes que utilizan perfiles de color de imprenta (como CMYK o tintas planas) son transformadas a sRGB, lo que puede introducir sutiles variaciones cromáticas respecto a salidas profesionales de imprenta.

---

## 5. Limitaciones técnicas del estándar PDF

1. **Gráficos y trazados vectoriales:**  
   Logotipos vectoriales, curvas de Bézier, líneas geométricas y tipografías no son mapas de bits; no pueden aislarse como imágenes independientes mediante extracción. Para capturarlos debe emplearse **Convertir páginas**.
2. **Máscaras de transparencia complejas:**  
   Documentos con máscaras de opacidad no convencionales (`SMask`) pueden requerir composiciones no soportadas en ciertos motores, produciendo advertencias de extracción parcial.
3. **Imágenes divididas en franjas (Tiling):**  
   Determinados programas de escaneo dividen una imagen física en múltiples tiras horizontales contiguas. El extractor identificará cada tira como un objeto separado. Para obtener la hoja completa consolidada se recomienda el modo de conversión.
4. **Posibilidad de fallo en conversión:**  
   La conversión de páginas no puede garantizar el éxito universal en todos los documentos. Archivos con tablas tipográficas corruptas, sombreados tridimensionales no soportados o asignaciones excesivas de memoria pueden provocar fallos en páginas puntuales.

---

## 6. Rendimiento, escala y cálculo de memoria (HU34)

La especificación PDF toma como referencia una base fija de **72 puntos por pulgada (DPI)**. Las escalas disponibles en PachaPDF operan sobre esta base:

* **Escala 1×:** 72 DPI (resolución estándar base).
* **Escala 1.5×:** 108 DPI ($72 \times 1.5$).
* **Escala 2×:** 144 DPI ($72 \times 2$).

### Fórmula de memoria del búfer de lienzo:
$$\text{Memoria del búfer (MiB)} = \frac{\text{ancho\_px} \times \text{alto\_px} \times 4}{1024^2}$$

### Estimación para página estándar A4 (595 × 842 pt):

| Escala | Densidad equivalente | Dimensiones en píxeles | Memoria de búfer de lienzo estimada | Caso de uso recomendado |
|---|---|---|---|---|
| **1×** | 72 DPI | 595 × 842 px | **~1.91 MiB** | Documentos extensos, lectura en pantalla y móviles |
| **1.5×** | 108 DPI | 893 × 1263 px | **~4.30 MiB** | Buen balance entre nitidez y consumo de recursos |
| **2×** | 144 DPI | 1190 × 1684 px | **~7.64 MiB** | Mayor definición para textos pequeños o impresión |

> **Aclaración sobre el consumo total de memoria:** Esta fórmula calcula **exclusivamente el búfer de píxeles sin comprimir del elemento `<canvas>`** generado para la imagen. No representa la memoria total utilizada por el navegador, la cual incluye el runtime de PDF.js, las fuentes desempaquetadas, el árbol del DOM y los ciclos del recolector de basura. Para documentos extensos, se recomienda procesar rangos acotados (ej. `1-10`) para prevenir cierres involuntarios de la pestaña por falta de memoria en dispositivos con recursos limitados.

---

## 7. Criterios de diseño, contraste y accesibilidad (HU34, HU37, UI-12, UI-13)

### 7.1 Corrección y validación de contraste de color
Para cumplir con el criterio WCAG 2.2 AA (1.4.3 - Contraste mínimo de 4.5:1 para texto normal):
* El color original `#008C78` presentaba un ratio de contraste de **4.18:1** sobre fondo blanco `#FFFFFF`, quedando por debajo del requisito mínimo de 4.5:1.
* Se ajustó el token para texto sobre fondo claro a **`#007562`**, el cual proporciona un ratio de contraste calculado de:
  * **5.64:1** sobre blanco `#FFFFFF`.
  * **5.38:1** sobre fondo canvas `#FAF9FC`.
* En modo oscuro, se utiliza el turquesa de marca **`#00CEB0`** sobre superficies oscuras `#160F1D` y `#211429`, superando ampliamente los ratios requeridos.

### 7.2 Estado de accesibilidad y pendientes
* **Pautas seguidas en el diseño:**
  * Áreas de toque mínimas de 44 × 44 px (`min-h-[44px]`).
  * Indicador de foco visible por teclado mediante anillo de 2 px (`focus-visible:ring-2 focus-visible:ring-[#00CEB0]`).
  * Desplegables accesibles basados en `<details>` y `<summary>` nativos, sin emojis decorativos y con iconos SVG consistentes de `lucide-react`.
* **Alcance de la revisión:** Se verificó el cálculo de contraste mediante script automatizado de luminancia y la validez de sintaxis y tipos con TypeScript (`tsc`).
* **Pendientes de auditoría:** Queda pendiente la validación manual exhaustiva con lectores de pantalla (VoiceOver en macOS/iOS, NVDA en Windows) y pruebas de usuario con tecnologías de asistencia. No se afirma certificación formal hasta completar dicha fase.

---

## 8. Guía de integración para el coordinador

* **Archivo de componentes:** [src/components/marketing.tsx](file:///Users/piero/Documents/PachaPDF/src/components/marketing.tsx)
  * Exporta: `LandingSections`, `HelpContent`, `AppFooter`.
  * Microcopy depurado: se eliminaron términos técnicos internos (Web Workers, JSZip, diccionarios XObject) en la landing para priorizar decisiones de usuario; se renombró la herramienta a *Extraer imágenes incrustadas* para evitar falsas promesas sobre "originales".
  * Enlaces globales en `AppFooter`: los href se configuraron como rutas absolutas con ancla (`/#herramientas`, `/#como-funciona`, `/#cargar-pdf`, `/#preguntas`) para garantizar navegación válida tanto desde la página principal como desde `/help`.
  * Validación y linting: entidades JSX escapadas conforme a la regla `react/no-unescaped-entities`, compilación limpia en TypeScript (`tsc --noEmit`) y ejecución de ESLint (`npm run lint`) con 0 errores y 0 advertencias.
  * Dependencias: Únicamente `react` y `lucide-react`, con todas las importaciones no utilizadas debidamente eliminadas.
