# PROMPT MAESTRO — AGENTE DE DESARROLLO PACHAPDF

Actúa como diseñador senior UI/UX, arquitecto frontend Angular y desarrollador TypeScript.

Implementa **PachaPDF**, un producto de PachaTech, usando el archivo `PachaPDF_ESPECIFICACION_COMPLETA.md` como única fuente principal de requisitos, `PachaPDF_BACKLOG.csv` como registro de 40 HU y `PachaPDF_PANTALLAS.csv` como inventario de 14 vistas/estados.

## Reglas de ejecución
1. Lee los tres archivos completos y el logo `assets/pachapdf-logo-aprobado.png` antes de generar código.
2. Conserva el logo aprobado exactamente; no crees otro ni borres el blanco interior del documento.
3. Diseña e implementa una SPA Angular standalone con TypeScript, Tailwind, PDF.js y JSZip, responsive y accesible. Debe ser frontend puro: jamás subir el PDF a servicios externos.
4. Implementa UI real de todos los estados; nada de botones falsos, mock data en producción, porcentajes inventados o alert() improvisados.
5. Divide el trabajo en commits o etapas: Design System/UI → carga y lectura → render → extracción real → galería/ZIP → QA/deploy. Prioriza P0.
6. Antes de afirmar "extracción original", demuestra con tests qué codificaciones soporta la técnica elegida. La conversión de páginas debe ser un flujo separado. Presenta avisos y estado parcial cuando corresponda.
7. Define y cumple los criterios de aceptación; incorpora test de navegador sin tráfico de archivos saliente.
8. Entrega estructura de carpetas, código completo, instrucciones de ejecución, lista de requisitos terminados/pendientes y limitaciones conocidas.
9. Consulta al usuario sólo si una decisión bloquea realmente la implementación; usa criterios del documento para decisiones menores.

**Orden de entrega:** primer resultado debe ser layout visual y componentes responsivos con el logo real; después funcionalidad PDF; finalmente QA.
