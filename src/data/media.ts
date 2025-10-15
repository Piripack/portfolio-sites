const baseWebp = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

export const imageKeys = [
  'placeholder',
  'plumbingRepair',
  'boilerCare',
  'cafeInterior',
  'cafeDish',
  'cafeDessert',
  'linenShirt',
  'waxedParka',
  'cardigan'
] as const;

export type ImageKey = (typeof imageKeys)[number];

export const imageMap: Record<ImageKey, string> = {
  placeholder: baseWebp,
  plumbingRepair: baseWebp,
  boilerCare: baseWebp,
  cafeInterior: baseWebp,
  cafeDish: baseWebp,
  cafeDessert: baseWebp,
  linenShirt: baseWebp,
  waxedParka: baseWebp,
  cardigan: baseWebp
};

export function getImage(key: string | ImageKey) {
  return imageMap[key as ImageKey] ?? imageMap.placeholder;
}

export const pdfKeys = ['careerliftPlaybook'] as const;

export type PdfKey = (typeof pdfKeys)[number];

export const pdfMap: Record<PdfKey, string> = {
  careerliftPlaybook: 'data:application/pdf;base64,JVBERi0xLjQKJSBwbGFjZWhvbGRlcgo='
};

export function getPdf(key: string | PdfKey) {
  return pdfMap[key as PdfKey] ?? pdfMap.careerliftPlaybook;
}
