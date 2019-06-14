import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import dimension_income from '../assets/dimension_income.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const A4 = [595.28, 841.89];
const DEFAULT_MARGINS = 80;
const ELEMENTS_PER_ROW = 10;

const getIndicatorQuestionByCodeName = (codeName, survey) => {
  const { surveyStoplightQuestions: questions } = survey;
  return questions.find(q => q.codeName === codeName).questionText;
};

const generateIndicatorsReport = (snapshot, survey) => {
  const { indicatorSurveyDataList: indicators } = snapshot;
  // Building a matrix of indicators limiting the elements in a row
  const indicatorsMatrix = indicators.reduce(
    (acc, current) => {
      let currentRow = acc[acc.length - 1];
      if (currentRow.length === ELEMENTS_PER_ROW) {
        currentRow = [];
        acc.push(currentRow);
      }
      currentRow.push(current);
      return acc;
    },
    [[]]
  );
  // eslint-disable-next-line no-var
  // var dd = {
  //   content: [
  //     {
  //       columns: [
  //         {
  //           width: '50%',
  //           text: 'My Life Map',
  //           style: 'header'
  //         },
  //         {
  //           width: '50%',
  //           text: 'March 30, 2019',
  //           style: ['header', 'headerRight']
  //         }
  //       ]
  //     },
  //     {
  //       canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1.5 }]
  //     },
  //     {
  //       layout: 'noBorders',
  //       table: {
  //         headerRows: 0,
  //         dontBreakRows: true,
  //         widths: ['40%', '*'],
  //         body: [
  //           [
  //             {
  //               text: 'Text Two',
  //               alignment: 'center',
  //               bold: true
  //             },
  //             {
  //               stack: [
  //                 {
  //                   image: 'sampleImage.jpg',
  //                   alignment: 'center',
  //                   width: 120,
  //                   margin: [0, 20, 0, 20]
  //                 },
  //                 {
  //                   text: 'This is a long text in a spanned rows',
  //                   alignment: 'center',
  //                   fontSize: 9
  //                 }
  //               ]
  //             }
  //           ]
  //         ]
  //       }
  //     }
  //   ],

  //   styles: {
  //     header: {
  //       fontSize: 22,
  //       bold: true
  //     },
  //     headerRight: {
  //       alignment: 'right'
  //     }
  //   }
  // };
  const dd = {
    content: [
      {
        columns: [
          {
            width: '50%',
            text: 'My Life Map',
            style: 'header'
          },
          {
            width: '50%',
            text: 'March 30, 2019',
            style: ['header', 'headerRight']
          }
        ]
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1.5 }]
      },
      {
        layout: 'noBorders',
        table: {
          headerRows: 0,
          dontBreakRows: true,
          widths: new Array(ELEMENTS_PER_ROW).fill('*'),
          body: indicatorsMatrix.map(row =>
            row.map(ind => ({
              stack: [
                {
                  image: 'building',
                  alignment: 'center',
                  width: (A4[0] - DEFAULT_MARGINS) / ELEMENTS_PER_ROW,
                  margin: [0, 20, 0, 5]
                },
                {
                  text: getIndicatorQuestionByCodeName(ind.key, survey),
                  alignment: 'center',
                  fontSize: 9
                }
              ]
            }))
          )
          // body2: [
          //   [
          //     {
          //       text: 'Text Two',
          //       alignment: 'center',
          //       bold: true
          //     },
          //     {
          //       stack: [
          //         {
          //           image: 'sampleImage.jpg',
          //           alignment: 'center',
          //           width: 120,
          //           margin: [0, 20, 0, 5]
          //         },
          //         {
          //           text: 'This is a long text in a spanned rows',
          //           alignment: 'center',
          //           fontSize: 9
          //         }
          //       ]
          //     }
          //   ]
          // ]
        }
      }
    ],
    images: {
      building: dimension_income
    },
    styles: {
      header: {
        fontSize: 22,
        bold: true
      },
      headerRight: {
        alignment: 'right'
      }
    }
  };
  return pdfMake.createPdf(dd);
};

// const example = {
//   content: [
//     { text: 'Tables', style: 'header' },
//     'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
//     {
//       text:
//         'A simple table (no headers, no width specified, no spans, no styling)',
//       style: 'subheader'
//     },
//     'The following table has nothing more than a body array',
//     {
//       style: 'tableExample',
//       layout: 'noBorders',

//       table: {
//         headerRows: 0,
//         widths: [132, 132, '*'],
//         body: [
//           [
//             {
//               text: 'Text One',
//               alignment: 'center',
//               bold: true,
//               fillColor: '#efefef'
//             },
//             {
//               text: 'Text Two',
//               alignment: 'center',
//               bold: true,
//               fillColor: '#efefef'
//             },
//             {
//               // rowSpan: 4,
//               stack: [
//                 {
//                   image: 'sampleImage.jpg',
//                   alignment: 'center',
//                   width: 120,
//                   margin: [0, 20, 0, 20]
//                 },
//                 {
//                   text: 'This is a long text in a spanned rows',
//                   alignment: 'center',
//                   fontSize: 9
//                 }
//               ]
//             }
//           ],
//           ['\n \n \n \n \n \n', '\n \n \n \n \n \n', {}],
//           ['Name: ', 'Name: ', {}],
//           ['Date: ', 'Date: ', {}]
//         ]
//       }
//     }
//   ],
//   styles: {
//     header: {
//       fontSize: 18,
//       bold: true,
//       margin: [0, 0, 0, 10]
//     },
//     subheader: {
//       fontSize: 16,
//       bold: true,
//       margin: [0, 10, 0, 5]
//     },
//     tableExample: {
//       margin: [0, 5, 0, 15]
//     },
//     tableHeader: {
//       bold: true,
//       fontSize: 13,
//       color: 'black'
//     }
//   },
//   defaultStyle: {
//     // alignment: 'justify'
//   }
// };

export default generateIndicatorsReport;
