import React from 'react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';
import Button from 'grommet/components/Button';
import RevertIcon from 'grommet/components/icons/base/Revert';
import SaveIcon from 'grommet/components/icons/base/Save';

import NetworkActivityOverlay from 'hippo/components/network-activity-overlay';
import TextEditor from 'hippo/components/text-editor';

import Show from '../../models/show';
import './page-editor.scss';


@observer
class PageEditor extends React.PureComponent {

    static propTypes = {
        show:      PropTypes.instanceOf(Show).isRequired,
        onComplete: PropTypes.func.isRequired,
    }

    @observable content;

    @action.bound onChange(content) {
        this.content = content;
    }

    @action.bound onSave() {
        this.props.show.set({ page: this.content });
        this.props.show.save().then(this.props.onComplete);
    }

    render() {
        const { props: { show, onComplete } } = this;
        return (
            <Layer onClose={onComplete} className="shows-edit-page">
                <NetworkActivityOverlay model={show} />
                <Box
                    full="horizontal"
                    size="full"
                    basis="xxlarge"
                >
                    <TextEditor
                        defaultContent={show.page}
                        assets={show.page_images}
                        onChange={this.onChange}
                    >
                        <Button
                            style={{ order: -2 }}
                            plain icon={<RevertIcon />} label="Cancel" onClick={onComplete}
                        />
                        <span style={{ order: -1, flex: 1 }} />
                        <Button plain icon={<SaveIcon />} label="Save" onClick={this.onSave} />
                    </TextEditor>
                </Box>
            </Layer>
        );
    }

}


export default function PageEditWrapper(props) {
    if (!props.show) { return null; }
    return <PageEditor {...props} />;
}
