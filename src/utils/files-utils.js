import pdfPreview from '../assets/pdf.png';
import docPreview from '../assets/doc.png';
import pptPreview from '../assets/ppt.png';

export const MB_SIZE = 1048576;

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const getPreviewForFile = resource => {
  if (resource.type === 'image/jpeg' || resource.type === 'image/png')
    return resource.url;
  if (resource.type === 'application/pdf') return pdfPreview;
  if (
    resource.type ===
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )
    return pptPreview;
  return docPreview;
};
