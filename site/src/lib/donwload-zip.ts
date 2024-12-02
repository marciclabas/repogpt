import JSZip from 'jszip';

export async function downloadZip(name: string, files: string[]) {
  const zip = new JSZip();

  for (const [i, file] of files.entries()) {
    zip.file(`${i}.txt`, file);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name
  link.click();

  URL.revokeObjectURL(url);
}
