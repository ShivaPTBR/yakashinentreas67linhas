export async function importStory(file:File):Promise<{text:string;warning?:string}>{
 if(file.size>8*1024*1024)throw new Error('O limite por arquivo é 8 MB.');const ext=file.name.split('.').at(-1)?.toLowerCase();
 if(['txt','md','markdown'].includes(ext??''))return {text:await file.text()};
 if(ext==='docx'){const mammoth=await import('mammoth');const result=await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return {text:result.value,warning:'DOCX extraído. Confira o texto antes de salvar; a formatação original não é importada.'};}
 if(ext==='pdf'){const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';const task=pdfjs.getDocument({data:await file.arrayBuffer()});const doc=await task.promise;const pages:string[]=[];try{for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i);const content=await page.getTextContent();pages.push(content.items.map((item:any)=>item.str+(item.hasEOL?'\n':' ')).join(''));}}finally{await task.destroy();}const text=pages.join('\n\n');if(text.trim().length<30)throw new Error('Este PDF não contém texto extraível. Use TXT ou DOCX; OCR não está configurado.');return {text,warning:'PDF extraído. Confira ordem, falas e quebras antes de salvar; PDFs podem alterar a ordem de leitura.'};}
 throw new Error('Escolha TXT, Markdown, DOCX ou PDF.');
}
