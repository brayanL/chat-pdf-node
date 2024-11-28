import PDFParser from 'pdf2json';
import { RejectType, ResolveType } from './types';

const pdfParser = new PDFParser();

const cleanText = (text: string) => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with one space
    .replace(/\n/g, ' ') // Replace newlines with a space
    .replace(/\r/g, '') // Remove carriage returns
    .replace(/[\u2022\u25CB\u25BA\u2013\u2014-]/g, '') // Remove bullet points, circles, arrows, dashes
    .replace(/\s*:\s*/g, ':') // Todo: if chat-gpt is not providing the correct answer, add space after colon
    .trim();
};

export const extractTextFromBuffer = async (pdfBuffer: ArrayBuffer) => {
  return new Promise<string>((resolve, reject) => {
    listenForPDFFile(resolve, reject);
    // Load the PDF file
    pdfParser.parseBuffer(Buffer.from(pdfBuffer));
  });
};

export const extractTextFromUrl = async (pdfURL: string) => {
  const arrayBufferFile = await fetchFileAsArrayBuffer(pdfURL);

  return new Promise<string>((resolve, reject) => {
    listenForPDFFile(resolve, reject);
    // Load the PDF file
    pdfParser.parseBuffer(Buffer.from(arrayBufferFile));
  });
};

function listenForPDFFile(resolve: ResolveType<string>, reject: RejectType) {
  let pageText = '';

  pdfParser.on('pdfParser_dataReady', pdfData => {
    pdfData.Pages.forEach((page, pageIndex) => {
      page.Texts.forEach(textItem => {
        // Decode the text (PDF uses URL encoding)
        const decodedText = decodeURIComponent(textItem.R[0].T).trim();
        pageText += decodedText + ' ';
      });
    });

    const cleanedPageText = cleanText(pageText);

    resolve(cleanedPageText);
  });

  pdfParser.on('pdfParser_dataError', err => {
    reject(err);
  });
}

async function fetchFileAsArrayBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}
