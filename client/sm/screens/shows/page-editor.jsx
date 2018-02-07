import React from 'react';
import PropTypes from 'prop-types';
import { observable, action, toJS } from 'mobx';
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

    @observable page;

    componentWillMount() {
        this.page = this.props.show.findOrCreatePage();
    }

    @action.bound setEditorRef(e) {
        this.editor = e;
        if (this.page.contents) {
            this.editor.contents = toJS(this.page.contents);
        }
    }

    @action.bound onSave() {
        Object.assign(this.page, this.editor.contents);
        this.page.save();
        this.props.onComplete();
    }

    @action.bound onCancel() {
        this.props.onComplete();
    }

    render() {
        const { props: { show }, page } = this;
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
                        assets={page.images}
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
