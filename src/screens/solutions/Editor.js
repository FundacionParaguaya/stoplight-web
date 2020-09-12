import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import CKEditor from '@ckeditor/ckeditor5-react';
import { withStyles } from '@material-ui/core/styles';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import { connect } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import { url } from '../../api';
import 'ckeditor5-custom-build/build/translations/en-gb';
import 'ckeditor5-custom-build/build/translations/es';
import 'ckeditor5-custom-build/build/translations/pt';

const styles = theme => ({
  screen: {
    flex: 1,
    borderWidth: 3,
    borderRadius: 2,
    borderColor: theme.palette.grey.quarter,
    borderStyle: 'solid'
  }
});

const Editor = ({
  classes,
  data,
  handleData,
  handlePlainData,
  handleStats,
  user,
  t,
  i18n: { language },
  placeholder,
  error,
  setTouched
}) => {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef(null);
  const customColorPalette = [
    {
      color: 'hsl(4, 90%, 58%)',
      label: 'Red'
    },
    {
      color: 'hsl(340, 82%, 52%)',
      label: 'Pink'
    },
    {
      color: 'hsl(291, 64%, 42%)',
      label: 'Purple'
    },
    {
      color: 'hsl(262, 52%, 47%)',
      label: 'Deep Purple'
    },
    {
      color: 'hsl(231, 48%, 48%)',
      label: 'Indigo'
    },
    {
      color: 'hsl(207, 90%, 54%)',
      label: 'Blue'
    }

    // ...
  ];

  const editorConfiguration = {
    language: language === 'en' ? 'en' : language,
    toolbar: [
      'Heading',
      'BulletedList',
      'NumberedList',
      'FontFamily',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'removeFormat',
      'todoList',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'alignment:left',
      'alignment:right',
      'alignment:center',
      'alignment:justify',
      '|',
      'Undo',
      'Redo',
      'insertTable',
      'ImageUpload',
      'ImageResize',
      'Link'
    ],
    removePlugins: ['Title', 'ImageCaption'],

    wordCount: {
      onUpdate: stats => {
        handleStats({
          characters: stats.characters,
          words: stats.words
        });
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ],

      // Configuration of the TableProperties plugin.
      tableProperties: {
        borderColors: customColorPalette,
        backgroundColors: customColorPalette
      },

      // Configuration of the TableCellProperties plugin.
      tableCellProperties: {
        borderColors: customColorPalette,
        backgroundColors: customColorPalette
      }
    },

    fontColor: {
      colors: [
        {
          color: 'hsl(0, 0%, 0%)',
          label: 'Black'
        },
        {
          color: 'hsl(0, 0%, 30%)',
          label: 'Dim grey'
        },
        {
          color: 'hsl(0, 0%, 60%)',
          label: 'Grey'
        },
        {
          color: 'hsl(0, 0%, 90%)',
          label: 'Light grey'
        },
        {
          color: 'hsl(0, 0%, 100%)',
          label: 'White',
          hasBorder: true
        }

        // ...
      ]
    },
    fontBackgroundColor: {
      colors: [
        {
          color: 'hsl(0, 75%, 60%)',
          label: 'Red'
        },
        {
          color: 'hsl(30, 75%, 60%)',
          label: 'Orange'
        },
        {
          color: 'hsl(60, 75%, 60%)',
          label: 'Yellow'
        },
        {
          color: 'hsl(90, 75%, 60%)',
          label: 'Light green'
        },
        {
          color: 'hsl(120, 75%, 60%)',
          label: 'Green'
        }
      ]
    },
    fontFamily: {
      options: [
        'default',
        'Ubuntu, Arial, sans-serif',
        'Ubuntu Mono, Courier New, Courier, monospace'
      ]
    },
    fontSize: {
      options: [9, 11, 13, 'default', 16, 18, 22, 23, 24, 28, 36, 48],
      supportAllValues: true
    },

    image: {
      toolbar: [
        'ImageStyle:full',
        'ImageStyle:side',
        '|',
        'ImageTextAlternative',
        'ImageStyle:alignLeft',
        'ImageStyle:alignCenter',
        'ImageStyle:alignRight',
        'ImageResize',
        '|',
        'link'
      ],

      styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Original',
          value: null
        },
        {
          name: 'imageResize:25',
          label: '25%',
          value: '25'
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ]
    },

    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: `${url[user.env]}/api/v1/solutions/pictures/upload`,

      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: false,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    },
    placeholder
  };

  const storeData = editorInstance => {
    const editorData = editorInstance.getData();
    const plainData = editorInstance
      .getData()
      .replace(/<\/p[^>]*>/g, '\n')
      .replace(/<\/h[^>]*>/g, '\n')
      .replace(/<br\/[^>]*>/g, '\n')
      .replace(/&iacute/g, 'í')
      .replace(/&oacute/g, 'ó')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&iquest;/g, '¿')
      .replace(/&uacute;/g, 'ú')
      .replace(/&nbsp;/g, ' ')
      .replace(/&ntilde;/g, 'ñ')
      .replace(/<(.|\n)*?>/g, '');

    handlePlainData(plainData);
    handleData(editorData);
  };

  useEffect(() => () => (editorRef.current.editor = null), []);

  useEffect(() => {
    const prevEditor = document.querySelector('.ck-editor__editable');
    if (!!editor) {
      editor.destroy();
      CustomEditor.create(prevEditor, editorConfiguration).then(newEditor => {
        storeData(newEditor);
        setEditor(newEditor);
      });
    }
  }, [language]);

  return (
    <div>
      <div className={classes.screen}>
        <CKEditor
          ref={editorRef}
          className={classes.editor}
          editor={CustomEditor}
          data={data}
          placeholder={placeholder}
          config={editorConfiguration}
          onInit={editor => {
            setEditor(editor);
          }}
          onChange={(event, editor) => {
            storeData(editor);
          }}
          onBlur={() => {
            setTouched();
          }}
        />
      </div>
      {error && (
        <FormHelperText error={error}>
          {t('validation.fieldIsRequired')}
        </FormHelperText>
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });
export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withTranslation()(Editor)))
);
