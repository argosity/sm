import React from 'react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import { last } from 'lodash';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';
import SaveIcon from 'grommet/components/icons/base/Save';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import Asset from 'hippo/models/asset';

import Quill from '../../components/quill';

import Event from '../../models/event';
import './page-editor.scss';


@observer
export default class PageEditor extends React.PureComponent {
    static propTypes = {
        event:      PropTypes.instanceOf(Event).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    @action.bound
    onImageUpload(file) {
        this.props.event.page_images.push({ file });
        return last(this.props.event.page_images)
            .save()
            .then(asset => ({ data: { link: asset.urlFor('medium') } }));
    }

//    @observable editorState = EditorState.createEmpty()

    componentWillMount() {
        // if (this.props.event.page_src) {
        //     this.editorState = EditorState.createWithContent(
        //         convertFromRaw(JSON.parse(this.props.event.page_src)),
        //     );
        // }
    }

    // @action.bound
    // onEditorStateChange(state) {
    //     this.editorState = state;
    // }

    @action.bound
    onSave() {
        // const contentState = convertToRaw(this.editorState.getCurrentContent());
        // this.props.event.set({
        //     page_src:  JSON.stringify(contentState),
        //     page_html: draftToHtml(contentState),
        // }).save();
    }

    render() {
        const { editorState, props: { event } } = this;
        return (
            <Layer onClose={this.props.onComplete} closer>
                <NetworkActivityOverlay model={event} />
                <Box
                    separator='horizontal'
                    full="horizontal"
                    size="full"
                    basis="xxlarge"
                >
                    <Quill
                        ref={e => (this.editor = e)}
                        wrapperClassName="page-editor"
                    />
                    <Footer
                        margin="small"
                        justify="end"
                        pad={{ horizontal: 'small', between: 'small' }}
                    >
                        <Button label="Cancel" onClick={this.props.onComplete} accent />
                        <Button
                            label="Save"
                            icon={<SaveIcon />}
                            onClick={this.onSave}
                            primary
                        />
                    </Footer>
                </Box>
            </Layer>
        );
    }
}
