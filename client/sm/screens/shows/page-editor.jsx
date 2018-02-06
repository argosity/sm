import React from 'react';
import PropTypes from 'prop-types';
import { action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Box, Button } from 'grommet';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import TextEditor from 'hippo/components/text-editor';
import { Previous } from 'grommet-icons';

import Show from '../../models/show';
import './page-editor.scss';


@observer
class PageEditor extends React.Component {

    static propTypes = {
        show: PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    @action.bound setEditorRef(e) {
        this.editor = e;
        if (this.props.show.page_delta) {
            this.editor.contents = toJS(this.props.show.page_delta);
        }
    }

    @action.bound onSave() {
        const { delta, html } = this.editor.contents;
        this.props.show.page = html;
        this.props.show.page_delta = delta;
        this.props.show.save();
        this.props.onComplete();
    }

    @action.bound onCancel() {
        this.props.onComplete();
    }

    render() {
        const { props: { show } } = this;
        return (
            <div className="shows-edit-page">
                <Toolbar justify="between">
                    <Button
                        icon={<Previous />}
                        label="Cancel" onClick={this.onCancel} accent
                    />
                    <SaveButton onClick={this.onSave} model={this.props.show} />
                </Toolbar>
                <NetworkActivityOverlay model={show} />
                <Box
                    flex
                    size="full"
                    basis="xxlarge"
                    full="horizontal"
                >
                    <TextEditor
                        onReady={this.setEditorRef}
                        assets={show.page_images}
                    />
                </Box>
            </div>
        );
    }

}


export default function PageEditWrapper(props) {
    if (!props.show) { return null; }
    return <PageEditor {...props} />;
}
