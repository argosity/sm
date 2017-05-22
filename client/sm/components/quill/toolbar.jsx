import React from 'react';

export default class QuillToolbar extends React.PureComponent {

    render() {
        return (
            <div id="full-toolbar" className="toolbar ql-toolbar ql-snow">
                <span className="ql-format-group">
                    <select title="Font" className="ql-font" defaultValue="sans-serif">
                        <option value="sans-serif">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                    <select title="Size" className="ql-size" defaultValue="13px">
                        <option value="10px">Small</option>
                        <option value="13px">Normal</option>
                        <option value="18px">Large</option>
                        <option value="32px">Huge</option>
                    </select>
                </span>
                <span className="ql-format-group">
                    <span title="Bold" className="ql-format-button ql-bold"/>
                    <span className="ql-format-separator"/>
                    <span title="Italic" className="ql-format-button ql-italic"/>
                    <span className="ql-format-separator"/>
                    <span title="Underline" className="ql-format-button ql-underline"/>
                    <span className="ql-format-separator"/>
                    <span title="Strikethrough" className="ql-format-button ql-strike"/>
                </span>
                <span className="ql-format-group">
                    <select title="Text Color" className="ql-color" defaultValue="rgb(0, 0, 0)">
                        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"/>
                        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"/>
                        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"/>
                        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"/>
                        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"/>
                        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"/>
                        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"/>
                        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"/>
                        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"/>
                        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"/>
                        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"/>
                        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"/>
                        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"/>
                        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"/>
                        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"/>
                        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"/>
                        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"/>
                        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"/>
                        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"/>
                        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"/>
                        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"/>
                        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"/>
                        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"/>
                        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"/>
                        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"/>
                        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"/>
                        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"/>
                        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"/>
                        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"/>
                        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"/>
                        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"/>
                        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"/>
                        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"/>
                        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"/>
                    </select>
                    <span className="ql-format-separator"/>
                    <select title="Background Color" className="ql-background" defaultValue="rgb(255, 255, 255)">
                        <option value="rgb(0, 0, 0)" label="rgb(0, 0, 0)"/>
                        <option value="rgb(230, 0, 0)" label="rgb(230, 0, 0)"/>
                        <option value="rgb(255, 153, 0)" label="rgb(255, 153, 0)"/>
                        <option value="rgb(255, 255, 0)" label="rgb(255, 255, 0)"/>
                        <option value="rgb(0, 138, 0)" label="rgb(0, 138, 0)"/>
                        <option value="rgb(0, 102, 204)" label="rgb(0, 102, 204)"/>
                        <option value="rgb(153, 51, 255)" label="rgb(153, 51, 255)"/>
                        <option value="rgb(255, 255, 255)" label="rgb(255, 255, 255)"/>
                        <option value="rgb(250, 204, 204)" label="rgb(250, 204, 204)"/>
                        <option value="rgb(255, 235, 204)" label="rgb(255, 235, 204)"/>
                        <option value="rgb(255, 255, 204)" label="rgb(255, 255, 204)"/>
                        <option value="rgb(204, 232, 204)" label="rgb(204, 232, 204)"/>
                        <option value="rgb(204, 224, 245)" label="rgb(204, 224, 245)"/>
                        <option value="rgb(235, 214, 255)" label="rgb(235, 214, 255)"/>
                        <option value="rgb(187, 187, 187)" label="rgb(187, 187, 187)"/>
                        <option value="rgb(240, 102, 102)" label="rgb(240, 102, 102)"/>
                        <option value="rgb(255, 194, 102)" label="rgb(255, 194, 102)"/>
                        <option value="rgb(255, 255, 102)" label="rgb(255, 255, 102)"/>
                        <option value="rgb(102, 185, 102)" label="rgb(102, 185, 102)"/>
                        <option value="rgb(102, 163, 224)" label="rgb(102, 163, 224)"/>
                        <option value="rgb(194, 133, 255)" label="rgb(194, 133, 255)"/>
                        <option value="rgb(136, 136, 136)" label="rgb(136, 136, 136)"/>
                        <option value="rgb(161, 0, 0)" label="rgb(161, 0, 0)"/>
                        <option value="rgb(178, 107, 0)" label="rgb(178, 107, 0)"/>
                        <option value="rgb(178, 178, 0)" label="rgb(178, 178, 0)"/>
                        <option value="rgb(0, 97, 0)" label="rgb(0, 97, 0)"/>
                        <option value="rgb(0, 71, 178)" label="rgb(0, 71, 178)"/>
                        <option value="rgb(107, 36, 178)" label="rgb(107, 36, 178)"/>
                        <option value="rgb(68, 68, 68)" label="rgb(68, 68, 68)"/>
                        <option value="rgb(92, 0, 0)" label="rgb(92, 0, 0)"/>
                        <option value="rgb(102, 61, 0)" label="rgb(102, 61, 0)"/>
                        <option value="rgb(102, 102, 0)" label="rgb(102, 102, 0)"/>
                        <option value="rgb(0, 55, 0)" label="rgb(0, 55, 0)"/>
                        <option value="rgb(0, 41, 102)" label="rgb(0, 41, 102)"/>
                        <option value="rgb(61, 20, 102)" label="rgb(61, 20, 102)"/>
                    </select>
                </span>
                <span className="ql-format-group">
                    <span title="List" className="ql-format-button ql-list"/>
                    <span className="ql-format-separator"/>
                    <span title="Bullet" className="ql-format-button ql-bullet"/>
                    <span className="ql-format-separator"/>
                    <select title="Text Alignment" className="ql-align" defaultValue="left">
                        <option value="left" label="Left"/>
                        <option value="center" label="Center"/>
                        <option value="right" label="Right"/>
                        <option value="justify" label="Justify"/>
                    </select>
                </span>
                <span className="ql-format-group">
                    <span title="Link" className="ql-format-button ql-link"/>
                </span>
            </div>
        );
    }
}
