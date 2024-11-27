import PDFParser from "pdf2json";

const pdfParser = new PDFParser();

const cleanText = (text: string) => {
    return text.replace(/\s+/g, ' ') // Replace multiple spaces with one space
        .replace(/\n/g, ' ') // Replace newlines with a space
        .replace(/\r/g, '')  // Remove carriage returns
        .replace(/[\u2022\u25CB\u25BA\u2013\u2014-]/g, '') // Remove bullet points, circles, arrows, dashes
        .replace(/\s*:\s*/g, ':') // Todo: if chat-gpt is not providing the correct answer, add space after colon
        .trim();
}

export const extractText = async (filePath: string) => {
    return new Promise<string>((resolve, reject) => {
        let pageText = '';

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            pdfData.Pages.forEach((page, pageIndex) => {
                page.Texts.forEach((textItem) => {
                    // Decode the text (PDF uses URL encoding)
                    const decodedText = decodeURIComponent(textItem.R[0].T).trim();
                    pageText += decodedText + ' ';
                });
            });

            const cleanedPageText = cleanText(pageText);

            resolve(cleanedPageText);
            // console.log(cleanedPageText); // Output the cleaned text
        });

        pdfParser.on("pdfParser_dataError", (err) => {
            reject(err);
        });

        // Load the PDF file
        pdfParser.loadPDF(filePath);
    });
};
