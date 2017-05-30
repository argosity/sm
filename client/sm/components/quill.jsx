import React from 'react';
import ReactQuill from 'react-quill';
import { observer } from 'mobx-react';



import './quill/quill.scss';

const { Quill } = ReactQuill;

var Size = Quill.import('attributors/style/size');
Size.whitelist = ['small', 'large', 'x-large', 'xx-large'];

// const SizeStyle = Quill.import('attributors/style/size');
// Quill.register(SizeStyle, true)

@observer
export default class QuillComponent extends React.PureComponent {
    modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [
                { 'font': [] },
                {size: [ 'small', false, 'large', 'x-large', 'xx-large' ]},
            ],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean']

        ],
    }

    formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]

    get HTML() {
        return this.editor.getEditor().root.innerHTML;
    }

    get content() {
        return this.editor.getEditor().getContents();
    }

    set content(json) {
        this.editor.getEditor().setContents(json);
    }

    render() {
        return (
            <div className="quill-editor-wrapper">
                <ReactQuill
                    ref={e => (this.editor = e)}
                    modules={this.modules}
                    formats={this.formats}
                />
            </div>
        );
    }
}
