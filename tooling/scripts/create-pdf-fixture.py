"""生成 EmbedPdfVue 文档站与端到端测试共用的两页 PDF。"""

from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas

PAGE_WIDTH, PAGE_HEIGHT = A4
INK = HexColor("#1B1A17")
PAPER = HexColor("#FFFDF7")
AMBER = HexColor("#C77816")
MUTED = HexColor("#6D685E")
LINE = HexColor("#D9D1C4")


def draw_header(pdf: Canvas, section: str, page_number: int) -> None:
    """绘制固定页眉，让两页 fixture 能用于页码跳转与视觉回归。"""
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    pdf.setFillColor(INK)
    pdf.rect(0, PAGE_HEIGHT - 54, PAGE_WIDTH, 54, stroke=0, fill=1)
    pdf.setFillColor(AMBER)
    pdf.rect(0, PAGE_HEIGHT - 58, PAGE_WIDTH, 4, stroke=0, fill=1)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(36, PAGE_HEIGHT - 34, "POLYLOOM / EMBEDPDF-VUE")
    pdf.setFillColor(PAPER)
    pdf.drawRightString(PAGE_WIDTH - 36, PAGE_HEIGHT - 34, section)

    pdf.setStrokeColor(LINE)
    pdf.line(36, 38, PAGE_WIDTH - 36, 38)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8)
    pdf.drawString(36, 24, "Repository-owned test fixture · MIT")
    pdf.drawRightString(PAGE_WIDTH - 36, 24, f"{page_number:02d} / 02")


def draw_page_one(pdf: Canvas) -> None:
    draw_header(pdf, "ARCHITECTURE", 1)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 28)
    pdf.drawString(42, PAGE_HEIGHT - 118, "A PDF workbench")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 12)
    pdf.drawString(42, PAGE_HEIGHT - 142, "One Vue component. Explicit CSS. Browser-only runtime.")

    cards = [
        ("01", "SSR SAFE", "The viewer runtime is imported only after mount."),
        ("02", "SUBPATH FIRST", "Use @polyloom/vue/embedpdf-vue for focused installs."),
        ("03", "LOCAL ASSETS", "PDF and PDFium WASM stay under your deployment policy."),
    ]
    y = PAGE_HEIGHT - 220
    for index, title, detail in cards:
        pdf.setFillColor(HexColor("#F4F0E7"))
        pdf.roundRect(42, y - 72, PAGE_WIDTH - 84, 72, 5, stroke=0, fill=1)
        pdf.setFillColor(AMBER)
        pdf.setFont("Courier-Bold", 11)
        pdf.drawString(58, y - 25, index)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(96, y - 25, title)
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", 9.5)
        pdf.drawString(96, y - 45, detail)
        y -= 94

    pdf.setFillColor(INK)
    pdf.setFont("Courier-Bold", 9)
    pdf.drawString(42, 170, "IMPORT")
    pdf.setFillColor(HexColor("#2B2924"))
    pdf.roundRect(42, 82, PAGE_WIDTH - 84, 70, 4, stroke=0, fill=1)
    pdf.setFillColor(HexColor("#FFD293"))
    pdf.setFont("Courier", 9.5)
    pdf.drawString(58, 124, "import { EmbedPdfVue } from '@polyloom/vue/embedpdf-vue';")
    pdf.drawString(58, 102, "import '@polyloom/vue/embedpdf-vue/style.css';")


def draw_page_two(pdf: Canvas) -> None:
    draw_header(pdf, "VERIFICATION", 2)
    pdf.setFillColor(AMBER)
    pdf.setFont("Courier-Bold", 10)
    pdf.drawString(42, PAGE_HEIGHT - 112, "PAGE 02 / INITIAL PAGE TARGET")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 30)
    pdf.drawString(42, PAGE_HEIGHT - 152, "The second page is ready.")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 11)
    pdf.drawString(42, PAGE_HEIGHT - 178, "If this page opens first, initialPage and layout timing are working.")

    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(1)
    pdf.roundRect(42, 340, PAGE_WIDTH - 84, 170, 6, stroke=1, fill=0)
    checks = [
        "Document loaded from a local fixture",
        "PDFium WASM resolved by the application bundler",
        "Page index clamped after layout is available",
        "Keyboard focus remains visible",
    ]
    y = 472
    for item in checks:
        pdf.setFillColor(AMBER)
        pdf.circle(62, y + 2, 4, stroke=0, fill=1)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica", 10.5)
        pdf.drawString(78, y - 2, item)
        y -= 34

    pdf.setFillColor(HexColor("#F4F0E7"))
    pdf.roundRect(42, 116, PAGE_WIDTH - 84, 166, 6, stroke=0, fill=1)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(60, 246, "Fixture contract")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 10)
    lines = [
        "This document contains exactly two A4 pages.",
        "It uses built-in PDF fonts and no remote resources.",
        "Its deterministic metadata keeps source control diffs stable.",
        "It may be redistributed with the PolyLoom repository.",
    ]
    for offset, line in enumerate(lines):
        pdf.drawString(60, 218 - offset * 25, line)


def create_fixture(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf = Canvas(
        str(output_path),
        pagesize=A4,
        invariant=1,
        pageCompression=1,
        pageCompressionLevel=9,
    )
    pdf.setAuthor("PolyLoom contributors")
    pdf.setCreator("PolyLoom fixture generator")
    pdf.setSubject("EmbedPdfVue local verification fixture")
    pdf.setTitle("PolyLoom EmbedPdfVue Demo")
    draw_page_one(pdf)
    pdf.showPage()
    draw_page_two(pdf)
    pdf.showPage()
    pdf.save()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "output",
        nargs="?",
        default="apps/docs/src/assets/polyloom-embedpdf-demo.pdf",
        type=Path,
    )
    args = parser.parse_args()
    create_fixture(args.output.resolve())
    print(args.output.resolve())


if __name__ == "__main__":
    main()
