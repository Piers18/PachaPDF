import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
const { version } = JSON.parse(
  await readFile("node_modules/pdfjs-dist/package.json", "utf8"),
);
const dir = `public/pdfjs/${version}`;
await mkdir(dir, { recursive: true });
for (const name of [
  "cmaps",
  "standard_fonts",
  "wasm",
  "iccs",
  "image_decoders",
])
  await cp(`node_modules/pdfjs-dist/${name}`, `${dir}/${name}`, {
    recursive: true,
  });
await cp(
  "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  `${dir}/pdf.worker.min.mjs`,
);
await cp("node_modules/pdfjs-dist/LICENSE", `${dir}/LICENSE`);
await writeFile(`${dir}/version.json`, JSON.stringify({ version }));
