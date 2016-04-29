import React from 'react';
import { connect } from 'react-redux';

import { VBox } from 'react-layout-components';

import FileUpload from 'material-ui/lib/svg-icons/file/file-upload';
import Snackbar from 'material-ui/lib/snackbar';
import CircularProgress from 'material-ui/lib/circular-progress';
import { grey100, grey300 } from 'material-ui/lib/styles/colors';

import { maybeRead, write } from '../state/attachments';

let prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
}

class UpdateableImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            snackbarOpen: false,
            notification: ''
        }
    }

    getDefaultProps() {
        return {
            maxHeight: 200,
            maxWidth: 200
        }
    }

    componentWillMount() {
        this.props.readImage();
    }

    writeImage(event) {
        prevent(event);
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        let file = event.dataTransfer.files[0];
        this.setState({uploading: true});
        this.props.writeImage(file)
            .then(() => this.setState({uploading: false, notification: 'Upload successfull!', snackbarOpen: true }))
            .catch(() => this.setState({uploading: false, notification: 'Upload failed!', snackbarOpen: true }));
    }

    render() {
        let {
            style,
            image,
            imageURL,
            maxHeight,
            maxWidth
        } = this.props;
        let snackBar = (<Snackbar open={this.state.snackbarOpen}
            autoHideDuration={2000}
            onRequestClose={() => this.setState({snackbarOpen: false})}
            message={this.state.notification} />);
        if (image) {
            return <div style={{position: 'relative'}}>
                {snackBar}
                <img style={{maxWidth, maxHeight}}
                     src={image.url}
                     onDragOver={prevent}
                     onDrop={(e) => this.writeImage(e)} />
                { this.state.uploading ?
                  <VBox center style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                      <CircularProgress />
                  </VBox> : null }
            </div>;
        } else {
            return <VBox center style={{border: `3px dashed ${grey300}`, borderRadius: 5, backgroundColor: grey100,  width: maxWidth, height: maxHeight}}
                         onDragOver={prevent}
                         onDrop={(e) => this.writeImage(e)}>
                {snackBar}
                <div>Drop a picture</div>
                <FileUpload />
                { this.state.uploading ? <CircularProgress /> : null }
            </VBox>
        }
    }
}

const mapStateToProps = (state, props) => {
    return {
        image: state.attachments[props.imageURL],
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        readImage: () => dispatch(maybeRead(props.imageURL)),
        writeImage: (blob) => dispatch(write(props.imageURL, blob))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateableImage);