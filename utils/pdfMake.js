let pdfMake;

if (typeof window !== "undefined") {
  const pdfMakeLib = require("pdfmake/build/pdfmake");
  const pdfFonts = require("pdfmake/build/vfs_fonts");

  console.log("pdfFonts:", pdfFonts);

  // Try these in order:
  if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdfMakeLib.vfs = pdfFonts.pdfMake.vfs;
  } else if (pdfFonts && pdfFonts.default && pdfFonts.default.vfs) {
    pdfMakeLib.vfs = pdfFonts.default.vfs;
  } else if (pdfFonts && pdfFonts.vfs) {
    pdfMakeLib.vfs = pdfFonts.vfs;
  } else {
    console.error("pdfFonts.vfs NOT found!");
  }

  pdfMake = pdfMakeLib;
}

export default pdfMake;
