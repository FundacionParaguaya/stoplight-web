import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import greenIndicatorAchievement from '../assets/ind_green_achievement.png';
import greenIndicator from '../assets/ind_green.png';
import yellowIndicatorPriority from '../assets/ind_yellow_priority.png';
import yellowIndicator from '../assets/ind_yellow.png';
import redIndicatorPriority from '../assets/ind_red_priority.png';
import redIndicator from '../assets/ind_red.png';
import skippedIndicator from '../assets/ind_skipped.png';
import iconPriority from '../assets/icon_priority.png';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const A4 = [595.28, 841.89];
const DEFAULT_MARGINS = 80;
const ELEMENTS_PER_ROW = 8;
const IMAGE_MARGIN = 25;

const buildUnderline = () => ({
  canvas: [
    {
      type: 'rect',
      color: '#b2b2b2',
      x: 0,
      y: 5,
      w: A4[0] - DEFAULT_MARGINS,
      h: 1.5
    }
  ]
});

const TITLE_MARGIN = [0, 0, 0, 13];

const getImageForIndicator = (
  indicator,
  priorities = [],
  achievements = []
) => {
  let image;
  if (indicator.value === 3) {
    image = 'greenIndicator';
    image = achievements.find(a => a.indicator === indicator.key)
      ? 'greenIndicatorAchievement'
      : image;
  } else if (indicator.value === 2) {
    image = 'yellowIndicator';
    image = priorities.find(a => a.indicator === indicator.key)
      ? 'yellowIndicatorPriority'
      : image;
  } else if (indicator.value === 1) {
    image = 'redIndicator';
    image = priorities.find(a => a.indicator === indicator.key)
      ? 'redIndicatorPriority'
      : image;
  } else if (indicator.value === 0) {
    image = 'skippedIndicator';
  }
  return image;
};

const getIndicatorQuestionByCodeName = (codeName, survey) => {
  const { surveyStoplightQuestions: questions } = survey;
  return questions.find(q => q.codeName === codeName).questionText;
};

const getIndicatorByPriority = (priority, indicators) =>
  indicators.find(ind => ind.key === priority.indicator);

const generatePrioritiesReportDefinition = (snapshot, survey, t, language) => {
  const { priorities = [], indicatorSurveyDataList: indicators } = snapshot;
  const dateFormat = getDateFormatByLocale(language);
  if (priorities.length === 0) {
    return [];
  }
  const tableWidths = [8, 20, 22, 22, 12, 16];
  const sortedPriorities = [];
  // We'll show priorties at the same order their corresponding indicators appear
  indicators.forEach(ind => {
    const pr = priorities.find(p => p.indicator === ind.key);
    if (pr) {
      sortedPriorities.push(pr);
    }
  });
  const CELL_MARGIN = [0, 5, 0, 5];
  const content = [
    {
      margin: [...TITLE_MARGIN],
      columns: [
        {
          width: '50%',
          columns: [
            {
              text: t('reports.priorities.myPriorities'),
              style: 'header',
              width: 'auto'
            },
            {
              image: 'iconPriority',
              alignment: 'justify',
              width: 25,
              margin: [5, 0, 0, 0]
            }
          ]
        },
        {
          width: '50%',
          text: moment().format(dateFormat),
          style: ['header', 'headerRight']
        }
      ]
    },
    buildUnderline(),
    {
      margin: [0, 10, 0, 7],
      columns: [
        {
          width: `${tableWidths[0]}%`,
          text: t('reports.priorities.status').toUpperCase(),
          style: 'prioritiesHeader'
        },
        {
          width: `${tableWidths[1]}%`,
          text: t('reports.priorities.indicator').toUpperCase(),
          style: 'prioritiesHeader'
        },
        {
          width: `${tableWidths[2]}%`,
          text: t('reports.priorities.whyDontYouHaveIt').toUpperCase(),
          style: 'prioritiesHeader'
        },
        {
          width: `${tableWidths[3]}%`,
          text: t('reports.priorities.whatWillYouDoToGetIt').toUpperCase(),
          style: 'prioritiesHeader'
        },
        {
          width: `${tableWidths[4]}%`,
          text: t('reports.priorities.howManyMonthsWillItTake').toUpperCase(),
          style: 'prioritiesHeader'
        },
        {
          width: `${tableWidths[5]}%`,
          text: t('reports.priorities.reviewDate').toUpperCase(),
          style: 'prioritiesHeader'
        }
      ]
    },
    buildUnderline(),
    {
      layout: 'noBorders',
      table: {
        headerRows: 0,
        dontBreakRows: true,
        widths: tableWidths.map(tw => `${tw}%`),
        body: sortedPriorities.map((priority, index) => {
          const indicator = getIndicatorByPriority(priority, indicators);
          return [
            {
              image: getImageForIndicator(indicator, priorities),
              alignment: 'center',
              width: (A4[0] * tableWidths[0]) / 100 - IMAGE_MARGIN,
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            },
            {
              text: getIndicatorQuestionByCodeName(indicator.key, survey),
              alignment: 'center',
              style: 'priorityCell',
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            },
            {
              text: priority.reason,
              alignment: 'center',
              style: 'priorityCell',
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            },
            {
              text: priority.action,
              alignment: 'center',
              style: 'priorityCell',
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            },
            {
              text: priority.estimatedDate,
              alignment: 'center',
              style: 'priorityCell',
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            },
            {
              text: moment()
                .add(priority.estimatedDate, 'M')
                .format(dateFormat),
              alignment: 'center',
              style: 'priorityCell',
              fillColor: index % 2 === 0 ? '#ffffff' : '#f3f4f6',
              margin: CELL_MARGIN
            }
          ];
        })
      }
    }
  ];
  return content;
};

const generateIndicatorsReport = (snapshot, survey, t, language) => {
  const {
    indicatorSurveyDataList: indicators,
    priorities = [],
    achievements = []
  } = snapshot;
  const dateFormat = getDateFormatByLocale(language);
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

  // The pdf library requires all cells of a table to be initialized.
  // So, we fill the matrix data with dummy elements
  const lastRow = indicatorsMatrix[indicatorsMatrix.length - 1];
  if (lastRow.length < ELEMENTS_PER_ROW) {
    lastRow.push(...new Array(ELEMENTS_PER_ROW - lastRow.length).fill(null));
  }
  const dd = {
    pageSize: 'A4',
    content: [
      {
        margin: [...TITLE_MARGIN],
        columns: [
          {
            width: '50%',
            text: t('reports.indicators.myLifeMap'),
            style: 'header'
          },
          {
            width: '50%',
            text: moment().format(dateFormat),
            style: ['header', 'headerRight']
          }
        ]
      },
      buildUnderline(),
      {
        layout: 'noBorders',
        pageBreak: priorities.length > 0 ? 'after' : '',
        table: {
          headerRows: 0,
          dontBreakRows: true,
          widths: new Array(ELEMENTS_PER_ROW).fill(
            `${100 / ELEMENTS_PER_ROW}%`
          ),
          body: indicatorsMatrix.map(row =>
            row.map(ind => {
              if (!ind) {
                return { text: '' };
              }
              return {
                stack: [
                  {
                    image: getImageForIndicator(ind, priorities, achievements),
                    alignment: 'center',
                    width:
                      (A4[0] - DEFAULT_MARGINS) / ELEMENTS_PER_ROW -
                      IMAGE_MARGIN,
                    margin: [0, 12, 0, 5]
                  },
                  {
                    text: getIndicatorQuestionByCodeName(ind.key, survey),
                    alignment: 'center',
                    fontSize: 7
                  }
                ]
              };
            })
          )
        }
      }
    ],
    images: {
      redIndicator,
      redIndicatorPriority,
      yellowIndicator,
      yellowIndicatorPriority,
      greenIndicator,
      greenIndicatorAchievement,
      skippedIndicator,
      iconPriority
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      headerRight: {
        alignment: 'right'
      },
      prioritiesHeader: {
        alignment: 'center',
        fontSize: 10,
        bold: true
      },
      priorityCell: {
        alignment: 'center',
        fontSize: 8
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  const prioritiesDefinition = generatePrioritiesReportDefinition(
    snapshot,
    survey,
    t,
    language
  );

  dd.content.push(...prioritiesDefinition);

  return pdfMake.createPdf(dd);
};

export default generateIndicatorsReport;
