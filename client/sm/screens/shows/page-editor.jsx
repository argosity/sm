import React from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';

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

    @action.bound
    onDone({ content }) {
        this.props.show.set({ page: content });
        this.props.onComplete();
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
                        onComplete={this.onDone}
                    />
                </Box>
            </Layer>
        );
    }
}


export default function PageEditWrapper(props) {
    if (!props.show) { return null; }
    return <PageEditor {...props} />;
}
