import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import sharp from "sharp";
import { mkdir, writeFile, open } from "node:fs/promises";
await mkdir("tests/fixtures", { recursive: true });
async function save(name, doc) {
  await writeFile(`tests/fixtures/${name}.pdf`, await doc.save());
}
const jpeg = await sharp({
  create: { width: 160, height: 100, channels: 3, background: "#8a235c" },
})
  .jpeg()
  .toBuffer();
const png = await sharp({
  create: {
    width: 80,
    height: 60,
    channels: 4,
    background: { r: 0, g: 190, b: 160, alpha: 0.45 },
  },
})
  .png()
  .toBuffer();
let doc = await PDFDocument.create();
let font = await doc.embedFont(StandardFonts.Helvetica);
let p = doc.addPage([400, 300]);
p.drawText("PachaPDF: texto y vectores", { x: 30, y: 240, size: 20, font });
p.drawRectangle({
  x: 50,
  y: 50,
  width: 100,
  height: 90,
  color: rgb(0.3, 0.1, 0.5),
});
await save("text", doc);
doc = await PDFDocument.create();
const jpg = await doc.embedJpg(jpeg),
  alpha = await doc.embedPng(png);
p = doc.addPage([400, 300]);
p.drawImage(jpg, { x: 10, y: 160, width: 160, height: 100 });
p.drawImage(alpha, { x: 210, y: 180, width: 80, height: 60 });
p.drawImage(jpg, { x: 10, y: 20, width: 160, height: 100 });
p = doc.addPage([400, 300]);
p.setRotation(degrees(90));
p.drawImage(jpg, { x: 20, y: 40, width: 160, height: 100 });
await save("images", doc);
doc = await PDFDocument.create();
const gray = doc.context.flateStream(new Uint8Array([0, 64, 128, 255]), {
  Type: "XObject",
  Subtype: "Image",
  Width: 2,
  Height: 2,
  ColorSpace: "DeviceGray",
  BitsPerComponent: 8,
});
const grayRef = doc.context.register(gray);
p = doc.addPage([200, 200]);
const key = p.node.newXObject("Gray", grayRef);
p.pushOperators();
p.node.addContentStream(
  doc.context.register(
    doc.context.flateStream(`q 100 0 0 100 20 20 cm /${key.decodeText()} Do Q`),
  ),
);
await save("gray", doc);
doc = await PDFDocument.create();
const bw = doc.context.flateStream(new Uint8Array([0b10101010, 0b01010101]), {
  Type: "XObject",
  Subtype: "Image",
  Width: 8,
  Height: 2,
  ColorSpace: "DeviceGray",
  BitsPerComponent: 1,
});
const bwRef = doc.context.register(bw);
p = doc.addPage([200, 200]);
const bwKey = p.node.newXObject("Mono", bwRef);
p.node.addContentStream(
  doc.context.register(
    doc.context.flateStream(
      `q 100 0 0 100 20 20 cm /${bwKey.decodeText()} Do Q`,
    ),
  ),
);
await save("mono", doc);
doc = await PDFDocument.create();
p = doc.addPage([200, 200]);
const mask = doc.context.flateStream(new Uint8Array([0b10101010, 0b01010101]), {
  Type: "XObject",
  Subtype: "Image",
  Width: 8,
  Height: 2,
  ImageMask: true,
  BitsPerComponent: 1,
});
const mk = p.node.newXObject("Mask", doc.context.register(mask));
p.node.addContentStream(
  doc.context.register(
    doc.context.flateStream(
      `q 0.3 0.1 0.5 rg 100 0 0 100 20 20 cm /${mk.decodeText()} Do Q`,
    ),
  ),
);
await save("mask", doc);
p.drawImage(await doc.embedJpg(jpeg), { x: 20, y: 130, width: 80, height: 50 });
await save("partial", doc);
doc = await PDFDocument.create();
p = doc.addPage([4000, 4000]);
p.drawRectangle({
  x: 0,
  y: 0,
  width: 4000,
  height: 4000,
  color: rgb(0.2, 0.3, 0.4),
});
await save("huge", doc);
doc = await PDFDocument.create();
for (let i = 0; i < 80; i++) {
  p = doc.addPage([600, 800]);
  p.drawText(`Cancel page ${i + 1}`, { x: 50, y: 700 });
}
await save("many", doc);
await writeFile("tests/fixtures/corrupt.pdf", "%PDF-1.7\nthis is corrupt");
await writeFile("tests/fixtures/invalid.pdf", "not a PDF");

const oversized = await open("tests/fixtures/oversize.pdf", "w");
await oversized.write("%PDF-1.7");
await oversized.truncate(151 * 1024 * 1024);
await oversized.close();
