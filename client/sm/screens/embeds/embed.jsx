import React from 'react';
import PropTypes from 'prop-types';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { map, partial } from 'lodash';
import styled from 'styled-components';
import { Heading, TextArea } from 'grommet';
import { Toolbar, SaveButton } from 'hippo/components/toolbar';
import { Form, Field } from 'hippo/components/form';
import TextEditor from 'hippo/components/text-editor';
import EmbedModel from '../../models/embed';

const Colors = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
  label {
    > :first-child {
      flex: 1;
    }
    > * {
      padding: 0;
    }
  }
`;

const StyledEmbed = styled.div`
  display: flex;
  flex: 1;
  max-height: 100vh;
  flex-direction: column;
  textarea {
    height: 120px;
    width: 100%;
  }
  .body {
    padding: ${props => props.theme.global.edgeSize.small};
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0px;
  }
`;

const onColorChange = (embed, key, { target: { value } }) => {
    embed.set_css_value(key, value);
};

@observer
export default class Embeds extends React.Component {

    static propTypes = {
        embed: PropTypes.instanceOf(EmbedModel).isRequired,
    }

    @observable page = this.props.embed.findOrCreatePage();

    @action.bound onSaveClick() {
        this.props.embed.save().then(() => {
            Object.assign(this.page, this.editor.contents);
            this.page.save();
        });
    }

    @action.bound setEditorRef(e) {
        this.editor = e;
        if (this.page.contents) {
            this.editor.contents = this.page.editorContent;
        }
    }

    onFocus(ev) {
        ev.target.select();
    }

    render() {
        const { embed } = this.props;
        const { page } = this;

        return (
            <StyledEmbed>
                <Toolbar>
                    <SaveButton onClick={this.onSaveClick} model={embed} />
                </Toolbar>
                <Form tag="div" className="body">
                    <p>Copy below HTML into a webpage to embed a listing of current shows</p>
                    <TextArea
                        onFocus={this.onFocus}
                        readOnly
                        value={embed.html}
                    />
                    <Colors>
                        {map(EmbedModel.css_value_labels, (description, key) => (
                            <Field
                                key={key}
                                name={key}
                                type="color"
                                label={description}
                                value={embed.get_css_value(key)}
                                onChange={partial(onColorChange, embed, key)}
                            />
                        ))}
                    </Colors>
                    <Heading level={4}>Message to display when there are no shows</Heading>
                    <TextEditor
                        onReady={this.setEditorRef}
                        assets={page.images}
                    />

                </Form>
            </StyledEmbed>
        );
    }

}
