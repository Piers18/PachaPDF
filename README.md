# PachaPDF

Extrae objetos de imagen de un PDF o convierte páginas completas a PNG/JPG. **Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui**, exportado como sitio estático. PDF.js y JSZip trabajan en el navegador: no hay API de subida, backend de documentos, telemetría ni fuentes remotas.

![PachaPDF en escritorio](docs/qa/landing-1280.png)

## Ejecutar

Requisitos: Node.js 22.13+ compatible con PDF.js 6 y Next.js 16; verificado con Node 26.0.0 y npm 11.12.1.

```sh
npm install
npm run dev
# http://127.0.0.1:3000
```

`predev` copia worker, CMaps, fuentes estándar, perfiles ICC, decodificadores y WASM de la versión instalada a `public/pdfjs/6.5.438/`. No descarga fuentes durante el build. Los scripts desactivan la telemetría de Next y la comprobación de actualizaciones de serve.

```sh
npm run typecheck
npm run lint
npm run build
npm run start
# sirve out/ en http://localhost:3000 (detén antes el servidor dev)
```

`npm run preview` hace lo mismo que `start`: sirve la exportación, sin ejecutar un backend Next. Para otro puerto: `npx cross-env NO_UPDATE_CHECK=1 serve out -l 3001`.

## Capacidades

- Selección o drag/drop de un PDF; firma y apertura real; nombre, bytes y páginas reales; contraseña local y reintento.
- Extracción de imágenes desde la lista de operadores/objetos de PDF.js. Se exportan **PNG reconstruidos de los píxeles decodificados**, con dimensiones, transparencia y página de origen; no son universalmente los archivos originales ni sus streams comprimidos.
- Conversión separada de páginas con texto/vectores a PNG o JPG; escala 1×/1.5×/2×, calidad JPG y rangos como `1-3,5` validados antes de expandirse.
- Vistas de página progresivas, galería lazy, selección, dimensiones/peso/formato, ancho/alto mínimos, omisión de pequeñas, duplicados por SHA-256 y orden reversible.
- Modal accesible Radix con navegación, encajar/100 %, Esc y devolución de foco; descargas individuales, ZIP de todas o seleccionadas y progreso real.
- Tema persistente, navegación de pasos sin recargar, cancelación cooperativa y liberación de recursos al reemplazar/quitar un documento.

La matriz técnica y las 40 historias con evidencia están en [docs/IMPLEMENTACION.md](docs/IMPLEMENTACION.md). La [ayuda y privacidad](docs/AYUDA-Y-PRIVACIDAD.md) complementa `/help/`.

## Límites explícitos

Las máscaras de opacidad ya resueltas por PDF.js se conservan como alfa en los casos probados; las máscaras de color dependientes de composición y los grupos inline no compatibles generan incidencias. Vectores, mosaicos, imágenes en patrones, perfiles de imprenta y codificaciones especiales pueden necesitar la conversión de página. No se promete extracción universal ni identidad binaria con el original.

Se usan límites preventivos: 150 MB de PDF, 1000 páginas por lote, 24 megapíxeles y 16384 px por lado en cada canvas, 256 MB de blobs acumulados. Son guardas de aplicación, no una garantía de memoria para todo dispositivo; la decodificación PDF.js también consume RAM antes de producir un resultado. Se muestran hasta 200 miniaturas de página; el campo de rangos permite elegir páginas posteriores. Usa menos páginas o menor escala ante errores. El ZIP usa `STORE`: las imágenes ya están comprimidas y se evita recomprimirlas innecesariamente.

La cancelación se comprueba entre páginas, objetos y callbacks de ZIP; detiene render tasks y carga. Un paso nativo de canvas/decodificación o compresión ya iniciado puede tardar hasta devolver control. Los resultados cancelados no reemplazan los actuales. Los documentos y resultados no se guardan en localStorage ni IndexedDB; sólo la preferencia de tema. Sirve la app por HTTPS o localhost para las funciones seguras del navegador, incluido SHA-256.

## Pruebas

```sh
npm run fixtures
npx playwright install chromium
npm run build
# en otra terminal:
npx cross-env NO_UPDATE_CHECK=1 serve out -l 3001
# pruebas contra los archivos estáticos:
PDF_TEST_URL=http://127.0.0.1:3001 npm test
```

Los fixtures se generan con `pdf-lib`/`sharp` sólo en `tests/`; incluye texto/vectores, JPEG, PNG alfa, duplicados, rotación, gris/monocromo, máscara, resultado parcial, corrupción, canvas grande y 80 páginas. `oversize.pdf` es un archivo disperso generado y excluido de Git. `password.pdf` es un fixture AES-256, clave **pacha-test**; para regenerarlo opcionalmente: `python3 -m pip install pypdf cryptography` y `python3 tests/encrypt-fixture.py`.

Las pruebas fallan ante peticiones externas, POST/PUT/PATCH o errores JS no controlados; verifican bytes descargados, contenido de ZIP y alfa. [Evidencia y capturas](docs/qa/) incluyen anchos 360/768/1280, modo oscuro, modal y zoom CSS 200 %. Axe y teclado cubren escenarios concretos, no certifican WCAG ni sustituyen una revisión con lector de pantalla. Safari WebDriver fue rechazado por automatización remota desactivada; Firefox y lector de pantalla no fueron probados.

## Arquitectura y despliegue

`src/app/` contiene rutas estáticas `/` y `/help/`; `src/components/workspace.tsx` mantiene el estado efímero y coordina tareas con AbortController/generaciones; `src/lib/pdf.ts` contiene validación de rangos, adaptación de objetos, canvas y descargas. Los componentes shadcn de Input/Progress/Checkbox fueron generados por CLI; Button usa CVA/Slot y los diálogos usan Radix. `marketing.tsx` aporta secciones, ayuda y pie global. No hay rutas API ni server actions.

`npm run build` produce `out/`. Publica **el contenido completo de `out/`** en un hosting estático con MIME correcto para `.mjs`, `.wasm` y `.bcmap`, y soporte de `help/index.html`. Configura build `npm run build` y directorio de salida `out`; no uses un proceso `next start`. Las rutas de recursos asumen despliegue en la raíz de un dominio; para subcarpetas se debe adaptar y probar `basePath` y las rutas de PDF.js/marca. No hay dominio, sitemap con URL inventada ni despliegue público configurado.

El logo original aprobado se conserva intacto. La cabecera y los favicons 16/32/48/180/192/512 usan ahora una variante con fondo exterior transparente y blanco interior del documento conservado visualmente. Detalles de edición y archivos en [docs/LOGO-TRANSPARENTE.md](docs/LOGO-TRANSPARENTE.md).

En esta entrega queda una terminal Orca sirviendo la exportación en **http://127.0.0.1:3001**: `term_6503c26e-2fbc-4f3e-9098-a0998405d64a` (PID de servidor 54059 al verificar). No se publicó a un destino externo.
