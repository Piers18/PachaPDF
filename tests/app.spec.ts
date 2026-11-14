import { test, expect, type Page } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import JSZip from "jszip";
import sharp from "sharp";
const networkEvidence: {
  test: string;
  requests: { url: string; method: string }[];
  violations: string[];
}[] = [];
const fixture = (name: string) => `tests/fixtures/${name}.pdf`;
async function upload(page: Page, name: string) {
  await page.locator("#pdf-input").setInputFiles(fixture(name));
  await expect(
    page.getByRole("heading", { name: "¿Qué quieres hacer con tu PDF?" }),
  ).toBeVisible();
}
async function choose(page: Page, mode: "extract" | "convert") {
  await page
    .getByRole("button", {
      name:
        mode === "extract"
          ? /Extraer imágenes Recupera/
          : /Convertir páginas Transforma/,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Opciones de procesamiento" }),
  ).toBeVisible();
}
async function run(page: Page, mode: "extract" | "convert") {
  await page
    .getByRole("button", {
      name: mode === "extract" ? /^Extraer imágenes ·/ : /^Convertir páginas ·/,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: /Tus imágenes están listas|Sin imágenes extraíbles|Resultados parciales/,
    }),
  ).toBeVisible({ timeout: 30000 });
}
test.beforeEach(async ({ page }) => {
  const violations: string[] = [];
  const requests: { url: string; method: string }[] = [];
  page.on("request", (request) => {
    const u = request.url();
    requests.push({ url: u, method: request.method() });
    if (
      !u.startsWith(process.env.PDF_TEST_URL ?? "http://127.0.0.1:3000") &&
      !u.startsWith("blob:") &&
      !u.startsWith("data:")
    )
      violations.push(`external ${u}`);
    if (["POST", "PUT", "PATCH"].includes(request.method()))
      violations.push(`upload ${request.method()} ${u}`);
  });
  page.on("pageerror", (e) => {
    violations.push(`pageerror ${e.message}`);
  });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("pachapdf-theme", "light");
    document.documentElement.classList.remove("dark");
  });
  Object.assign(page, { pdfViolations: violations, pdfRequests: requests });
});
test.afterEach(async ({ page }) => {
  const observed = page as Page & {
    pdfViolations: string[];
    pdfRequests: { url: string; method: string }[];
  };
  networkEvidence.push({
    test: test.info().title,
    requests: observed.pdfRequests,
    violations: observed.pdfViolations,
  });
  expect((page as Page & { pdfViolations: string[] }).pdfViolations).toEqual(
    [],
  );
});
test.afterAll(async () => {
  await writeFile(
    "docs/qa/network-summary.json",
    JSON.stringify(
      {
        date: new Date().toISOString(),
        baseURL: process.env.PDF_TEST_URL ?? "http://127.0.0.1:3000",
        tests: networkEvidence,
      },
      null,
      2,
    ),
  );
});
test("extract objects, metadata, duplicates, alpha, selection ZIP and modal", async ({
  page,
}) => {
  await upload(page, "images");
  await expect(page.getByText(/2 páginas · PDF local/)).toBeVisible();
  await choose(page, "extract");
  await page.getByLabel("Páginas a procesar").fill("1-9999999999999");
  await expect(page.locator("main [role=alert]")).toContainText("entre 1 y 2");
  await expect(
    page.getByRole("button", { name: /^Extraer imágenes ·/ }),
  ).toBeDisabled();
  await page.getByLabel("Páginas a procesar").fill("1-2");
  await run(page, "extract");
  await expect(page.locator(".image-card")).toHaveCount(4);
  await expect(
    page.locator(".image-card").filter({ hasText: "160 × 100 px" }),
  ).toHaveCount(3);
  await expect(
    page.locator(".image-card").filter({ hasText: "80 × 60 px" }),
  ).toHaveCount(1);
  await expect(
    page.locator(".image-card").filter({ hasText: "Duplicada" }),
  ).toHaveCount(2);
  await page
    .getByRole("checkbox", { name: /Seleccionar pachapdf_extract_p001_img001/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Seleccionar pachapdf_extract_p001_img002/ })
    .check();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "ZIP seleccionadas (2)" }).click();
  const dl = await downloaded;
  const zip = await JSZip.loadAsync(await readFile((await dl.path())!));
  const names = Object.keys(zip.files);
  expect(names).toEqual([
    "pachapdf_extract_p001_img001.png",
    "pachapdf_extract_p001_img002.png",
  ]);
  const alpha = await zip.file(names[1])!.async("nodebuffer");
  const pixels = await sharp(alpha).raw().toBuffer({ resolveWithObject: true });
  expect(pixels.info.width).toBe(80);
  expect(pixels.info.height).toBe(60);
  expect(pixels.info.channels).toBe(4);
  expect(pixels.data[3]).toBeGreaterThan(100);
  expect(pixels.data[3]).toBeLessThan(130);
  await page.getByLabel("Ancho mínimo (px)").fill("100");
  await expect(page.locator(".image-card")).toHaveCount(3);
  await expect(page.locator(".selection-count")).toContainText(
    "2 seleccionadas (1 ocultas)",
  );
  await page.getByLabel("Ocultar duplicadas").check();
  await expect(page.locator(".image-card")).toHaveCount(1);
  await page.getByLabel("Ancho mínimo (px)").fill("0");
  await page.getByLabel("Ocultar duplicadas").uncheck();
  const opener = page.getByRole("button", {
    name: "Ampliar pachapdf_extract_p001_img001.png",
  });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Imagen siguiente" }).click();
  await expect(page.getByRole("dialog")).toContainText("80 × 60");
  await page.getByRole("button", { name: "Ver al 100 %" }).click();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.screenshot({
    path: "docs/qa/results-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Nuevo PDF", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Arrastra un PDF aquí" }),
  ).toBeVisible();
  await expect(page.locator(".image-card")).toHaveCount(0);
  await upload(page, "text");
});
test("conversion PNG and JPG with rotation and download bytes", async ({
  page,
}) => {
  await upload(page, "images");
  await choose(page, "convert");
  await expect(page.locator(".page-preview img").first()).toBeVisible();
  await page.getByLabel("Escala", { exact: true }).selectOption("1");
  await run(page, "convert");
  await expect(page.locator(".image-card")).toHaveCount(2);
  await expect(
    page.locator(".image-card").filter({ hasText: "300 × 400 px" }),
  ).toHaveCount(1);
  const pngDownload = page.waitForEvent("download");
  await page
    .getByRole("button", {
      name: "Descargar pachapdf_page_001.png",
      exact: true,
    })
    .click();
  const png = await readFile((await (await pngDownload).path())!);
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Opciones de procesamiento" }),
  ).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "Tus imágenes están listas" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ajustar opciones" }).click();
  await page.getByLabel("Formato", { exact: true }).selectOption("jpg");
  await page.getByLabel("Páginas a procesar").fill("2");
  await page.getByLabel("Escala", { exact: true }).selectOption("2");
  await run(page, "convert");
  await expect(page.locator(".image-card")).toHaveCount(1);
  await expect(page.locator(".image-card")).toContainText("600 × 800 px");
  const jpgDownload = page.waitForEvent("download");
  await page
    .getByRole("button", {
      name: "Descargar pachapdf_page_002.jpg",
      exact: true,
    })
    .click();
  const jpg = await readFile((await (await jpgDownload).path())!);
  expect(jpg.subarray(0, 2).toString("hex")).toBe("ffd8");
  expect((await sharp(jpg).metadata()).width).toBe(600);
});
test("text empty, invalid signature, corrupt PDF and recoverable reset", async ({
  page,
}) => {
  await page.locator("#pdf-input").setInputFiles(fixture("invalid"));
  await expect(page.locator("main [role=alert]")).toContainText(
    "firma PDF válida",
  );
  await page.locator("#pdf-input").setInputFiles(fixture("corrupt"));
  await expect(page.locator("main [role=alert]")).toContainText(
    "No pudimos abrir",
  );
  await upload(page, "text");
  await choose(page, "extract");
  await run(page, "extract");
  await expect(
    page.getByRole("heading", {
      name: "No encontramos imágenes extraíbles en este PDF",
    }),
  ).toBeVisible();
  await expect(page.locator(".image-card")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Convertir páginas", exact: true })
    .click();
  await run(page, "convert");
  await expect(page.locator(".image-card")).toHaveCount(1);
});
for (const name of ["gray", "mono"])
  test(`extract ${name} real image`, async ({ page }) => {
    await upload(page, name);
    await choose(page, "extract");
    await run(page, "extract");
    await expect(page.locator(".image-card")).toHaveCount(1);
    await expect(page.locator(".image-card")).toContainText(
      name === "gray" ? "2 × 2 px" : "8 × 2 px",
    );
  });
test("unsupported mask reports partial, huge canvas refused", async ({
  page,
}) => {
  await upload(page, "mask");
  await choose(page, "extract");
  await run(page, "extract");
  await expect(page.getByText(/máscara de color dependiente/)).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "No pudimos extraer resultados compatibles",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Nuevo PDF", exact: true }).click();
  await upload(page, "huge");
  await choose(page, "convert");
  await page.getByLabel("Escala", { exact: true }).selectOption("2");
  await run(page, "convert");
  await expect(
    page.getByText(/supera el límite de 24 megapíxeles/),
  ).toBeVisible();
  await expect(page.locator(".image-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Ajustar opciones" }).click();
  await page.getByLabel("Escala", { exact: true }).selectOption("1");
  await run(page, "convert");
  await expect(page.locator(".image-card")).toContainText("4000 × 4000 px");
});
test("cooperative cancellation and no obsolete results", async ({ page }) => {
  await upload(page, "many");
  await choose(page, "convert");
  await page.getByRole("button", { name: /^Convertir páginas ·/ }).click();
  await page.getByRole("button", { name: "Cancelar procesamiento" }).click();
  await expect(page.getByRole("status")).toContainText("cancelado");
  await expect(page.locator(".image-card")).toHaveCount(0);
  await page.getByLabel("Páginas a procesar").fill("1");
  await run(page, "convert");
  await expect(page.locator(".image-card")).toHaveCount(1);
});
test("actual drag drop, back, theme persisted and help keyboard", async ({
  page,
}) => {
  const data = await readFile(fixture("text"));
  const transfer = await page.evaluateHandle(
    ({ data }) => {
      const dt = new DataTransfer();
      dt.items.add(
        new File([new Uint8Array(data)], "dropped.pdf", {
          type: "application/pdf",
        }),
      );
      return dt;
    },
    { data: [...data] },
  );
  await page
    .locator("#cargar-pdf")
    .dispatchEvent("drop", { dataTransfer: transfer });
  await expect(page.getByText("dropped.pdf", { exact: true })).toBeVisible();
  await choose(page, "convert");
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "¿Qué quieres hacer con tu PDF?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Activar tema oscuro" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.goto("/help/");
  await expect(page.locator("#privacidad")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
});
for (const width of [360, 768, 1280])
  test(`responsive ${width} and screenshots`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await expect(
      page.getByRole("heading", {
        name: "Tus PDF, tus imágenes, tu privacidad.",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `docs/qa/landing-${width}.png`,
      fullPage: true,
    });
    await upload(page, "images");
    await choose(page, "extract");
    await run(page, "extract");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `docs/qa/results-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Ampliar pachapdf_extract_p001_img001.png" })
      .click();
    await page.screenshot({ path: `docs/qa/modal-${width}.png` });
    await page.keyboard.press("Escape");
  });
test("200 percent browser layout equivalent and dark mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 450 });
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/qa/zoom-200.png", fullPage: true });
  await page.evaluate(() => (document.documentElement.style.zoom = "1"));
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "Activar tema oscuro" }).click();
  await page.screenshot({ path: "docs/qa/dark-360.png", fullPage: true });
});
test("local AES256 password incorrect, correct and cancellation", async ({
  page,
}) => {
  await page.locator("#pdf-input").setInputFiles(fixture("password"));
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Contraseña del PDF").fill("incorrecta");
  await page.getByRole("button", { name: "Abrir PDF", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Contraseña incorrecta");
  await page.getByLabel("Contraseña del PDF").fill("pacha-test");
  await page.getByRole("button", { name: "Abrir PDF", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "¿Qué quieres hacer con tu PDF?" }),
  ).toBeVisible();
  await choose(page, "extract");
  await run(page, "extract");
  await expect(
    page.getByRole("heading", {
      name: "No encontramos imágenes extraíbles en este PDF",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Nuevo PDF", exact: true }).click();
  await page.locator("#pdf-input").setInputFiles(fixture("password"));
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await upload(page, "text");
});

test("visible selection, dimensions, stable reverse order and all ZIP", async ({
  page,
}) => {
  await upload(page, "images");
  await choose(page, "extract");
  await run(page, "extract");
  await page.getByLabel("Alto mínimo (px)").fill("90");
  await page.getByLabel("Seleccionar visibles").check();
  await expect(page.locator(".selection-count")).toContainText(
    "3 seleccionadas",
  );
  await page.getByLabel("Alto mínimo (px)").fill("0");
  await expect(
    page.getByRole("checkbox", {
      name: "Seleccionar pachapdf_extract_p001_img002.png",
      exact: true,
    }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Ascendente", exact: true }).click();
  await expect(page.locator(".image-card").first()).toContainText(
    "pachapdf_extract_p002_img001.png",
  );
  await page.getByLabel("Omitir pequeñas").selectOption("100");
  await expect(page.locator(".image-card")).toHaveCount(3);
  await page.getByLabel("Seleccionar visibles").uncheck();
  await expect(page.locator(".selection-count")).toContainText(
    "0 seleccionadas",
  );
  await expect(
    page.getByRole("button", { name: "ZIP seleccionadas (0)" }),
  ).toBeDisabled();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "ZIP todas (4)" }).click();
  const zip = await JSZip.loadAsync(
    await readFile((await (await downloaded).path())!),
  );
  expect(Object.keys(zip.files)).toHaveLength(4);
  expect(new Set(Object.keys(zip.files)).size).toBe(4);
});
test("object URL lifecycle reset and replacement", async ({ page }) => {
  await page.evaluate(() => {
    const active = new Set<string>();
    const create = URL.createObjectURL.bind(URL),
      revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (blob: Blob | MediaSource) => {
      const url = create(blob);
      active.add(url);
      return url;
    };
    URL.revokeObjectURL = (url: string) => {
      active.delete(url);
      revoke(url);
    };
    Object.assign(window, { activePdfUrls: active });
  });
  await upload(page, "images");
  await choose(page, "extract");
  await run(page, "extract");
  expect(
    await page.evaluate(
      () =>
        (window as Window & { activePdfUrls?: Set<string> }).activePdfUrls
          ?.size,
    ),
  ).toBe(4);
  await page.getByRole("button", { name: "Cambiar PDF", exact: true }).focus();
  await page.locator("#pdf-input").setInputFiles(fixture("text"));
  await expect(page.getByText("text.pdf", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { activePdfUrls?: Set<string> }).activePdfUrls
            ?.size,
      ),
    )
    .toBe(0);
  await page.getByRole("button", { name: "Quitar PDF" }).click();
  await expect(
    page.getByRole("heading", { name: "Arrastra un PDF aquí" }),
  ).toBeVisible();
});
test("cancel ZIP preserves results and cancel load allows retry", async ({
  page,
}) => {
  await upload(page, "many");
  await choose(page, "convert");
  await run(page, "convert");
  await expect(page.locator(".image-card")).toHaveCount(80);
  await page.getByRole("button", { name: "ZIP todas (80)" }).click();
  await page.getByRole("button", { name: "Cancelar ZIP", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("ZIP cancelada");
  await expect(page.locator(".image-card")).toHaveCount(80);
  await page.getByRole("button", { name: "Nuevo PDF", exact: true }).click();
  await page.route("**/pdfjs/**/pdf.worker.min.mjs", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.continue();
  });
  await page.locator("#pdf-input").setInputFiles(fixture("many"));
  const cancel = page.getByRole("button", { name: "Cancelar carga" });
  await expect(cancel).toBeVisible();
  await cancel.click();
  await expect(
    page.getByRole("heading", { name: "Arrastra un PDF aquí" }),
  ).toBeVisible();
  await upload(page, "text");
});

test("keyboard trap, mobile selection toolbar, help and automated accessibility", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "Menú", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Navegación principal" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Menú", exact: true }).click();
  await upload(page, "images");
  await choose(page, "extract");
  await run(page, "extract");
  await page
    .getByRole("checkbox", {
      name: "Seleccionar pachapdf_extract_p001_img001.png",
      exact: true,
    })
    .check();
  await expect(page.locator(".result-actions")).toHaveCSS("position", "fixed");
  await page.screenshot({ path: "docs/qa/selection-360.png" });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .getByRole("button", { name: "Ampliar pachapdf_extract_p001_img001.png" })
    .click();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page
        .getByRole("dialog")
        .evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.goto("/help/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "docs/qa/help-360.png", fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("partial extraction retains compatible object and page-level incident", async ({
  page,
}) => {
  await upload(page, "partial");
  await choose(page, "extract");
  await run(page, "extract");
  await expect(
    page.getByRole("heading", { name: "Resultados parciales" }),
  ).toBeVisible();
  await expect(page.locator(".image-card")).toHaveCount(1);
  await page.locator("details.notice summary").click();
  await expect(page.getByText(/máscara de color dependiente/)).toBeVisible();
});

test("preventive file limit fails before parsing and permits retry", async ({
  page,
}) => {
  await page.locator("#pdf-input").setInputFiles(fixture("oversize"));
  await expect(page.locator("main [role=alert]")).toContainText("150 MB");
  await upload(page, "text");
});
