'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { importProductsCsv, getCsvTemplate, type ImportResult } from './actions';

export function ImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(f: File) {
    setFile(f);
    setResult(null);
    const text = await f.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const previewLines = lines.slice(0, 6).map(line => {
      // Simple split for preview (handle both , and ;)
      const sep = line.includes(';') ? ';' : ',';
      return line.split(sep).map(cell => cell.replace(/^"|"$/g, '').trim());
    });
    setPreview(previewLines);
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const res = await importProductsCsv(text);
      setResult(res);
    } catch (e) {
      setResult({ categoriesCreated: 0, productsCreated: 0, productsUpdated: 0, errors: [e instanceof Error ? e.message : 'Import fehlgeschlagen'] });
    } finally {
      setImporting(false);
    }
  }

  async function handleDownloadTemplate() {
    const csv = await getCsvTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produkte-vorlage.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <h2 className="font-semibold text-sm text-zinc-700 mb-3">Hinweise zum CSV-Format</h2>
        <ul className="text-sm text-zinc-600 space-y-1.5 list-disc list-inside">
          <li>Trennzeichen: Semikolon (<code>;</code>) oder Komma (<code>,</code>)</li>
          <li>Pflichtfeld: <strong>Titel</strong> (oder &quot;Name&quot;, &quot;Produktname&quot;)</li>
          <li>Preise: Euro-Format (<code>29,99</code>) oder Cent (<code>2999</code>)</li>
          <li>Mehrere Bilder/Highlights: mit <code>|</code> trennen</li>
          <li>Kategorien werden automatisch erstellt wenn noch nicht vorhanden</li>
          <li>Existierende Produkte (gleiche SKU oder Slug) werden aktualisiert</li>
        </ul>
        <button onClick={handleDownloadTemplate} className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <Download size={16} /> CSV-Vorlage herunterladen
        </button>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5">
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFileSelect(e.dataTransfer.files[0]); }}
          className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <Upload size={32} className="mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-600 font-medium">CSV-Datei hier ablegen oder klicken</p>
          <p className="text-xs text-zinc-400 mt-1">Unterstützt: .csv, .tsv, .txt</p>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
            <FileText size={16} className="text-blue-500" />
            <span className="font-medium">{file.name}</span>
            <span className="text-zinc-400">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="font-semibold text-sm text-zinc-700 mb-3">Vorschau (erste 5 Zeilen)</h2>
          <div className="overflow-x-auto">
            <table className="text-xs w-full border-collapse">
              <thead>
                <tr>
                  {preview[0]?.map((header, i) => (
                    <th key={i} className="border border-zinc-200 px-2 py-1.5 bg-zinc-50 text-left font-semibold text-zinc-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-zinc-200 px-2 py-1 text-zinc-700 max-w-[200px] truncate">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {importing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {importing ? 'Importiere...' : 'Import starten'}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-5 ${result.errors.length === 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <h2 className="font-semibold text-sm flex items-center gap-2 mb-3">
            {result.errors.length === 0 ? <CheckCircle2 size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-amber-600" />}
            Import abgeschlossen
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-800">{result.productsCreated}</div>
              <div className="text-xs text-zinc-500">Produkte erstellt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-800">{result.productsUpdated}</div>
              <div className="text-xs text-zinc-500">Produkte aktualisiert</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-800">{result.categoriesCreated}</div>
              <div className="text-xs text-zinc-500">Kategorien erstellt</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <details className="mt-3">
              <summary className="text-xs text-amber-700 cursor-pointer font-medium">{result.errors.length} Fehler anzeigen</summary>
              <ul className="mt-2 text-xs text-amber-800 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => <li key={i}>• {err}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
