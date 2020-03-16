
react-scripts build
mkdir node_modules/pdfmake/examples && mkdir node_modules/pdfmake/examples/fonts
cp src/assets/fonts/Freesans.ttf node_modules/pdfmake/examples/fonts
cd node_modules/pdfmake
npm install
node ./node_modules/gulp/bin/gulp.js buildFonts
