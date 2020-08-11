import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import withLayout from '../components/withLayout';
import CKEditor from '@ckeditor/ckeditor5-react';
//import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
//import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
//import CustomEditor from '../ckeditor5/src/ckeditor';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';

const styles = theme => ({
  screen: {
    flex: 1,
    padding: 20
  }
});

const Solutions = ({ classes }) => {
  const [data, setData] = useState('<p>Hello from CKEditor 5!</p>');

  const editorConfiguration = {
    toolbar: ['Bold', 'Italic', '|', 'Undo', 'Redo', 'ImageUpload'],

    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl:
        'https://testing.backend.povertystoplight.org/api/v1/snapshots/files/pictures/upload',

      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: false,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization: 'Bearer 9a74f00a-b3cf-43dd-8c43-ce4988be0646'
        // 'Content-Type': 'multipart/form-data'
      }
    }
  };

  return (
    <div className={classes.screen}>
      <h2>Content</h2>
      <CKEditor
        editor={CustomEditor}
        data={data}
        config={editorConfiguration}
        onInit={editor => {
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log(data);
          console.log(editor.getData().replace(/<(.|\n)*?>/g, ''));
          setData(data);
        }}
      />

      <Button onClick={() => console.log(data)}>Guardar</Button>
    </div>
  );
};

class MyUploadAdapter {
  constructor(loader) {
    // CKEditor 5's FileLoader instance.
    this.loader = loader;

    // URL where to send files.
    this.url = 'https://example.com/image/upload/path';
  }

  // Starts the upload process.
  upload() {
    return new Promise((resolve, reject) => {
      this._initRequest();
      this._initListeners(resolve, reject);
      this._sendRequest();
    });
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Example implementation using XMLHttpRequest.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open('POST', this.url, true);
    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = "Couldn't upload file:" + ` ${loader.file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      resolve({
        default: response.url
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest() {
    const data = new FormData();

    data.append('upload', this.loader.file);

    this.xhr.send(data);
  }
}

export default withRouter(
  withStyles(styles)(withTranslation()(withLayout(Solutions)))
);
