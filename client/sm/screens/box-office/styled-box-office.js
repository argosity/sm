import styled from 'styled-components';
import color from 'grommet/utils/colors';
import media from 'hippo/components/grid/media';

const StyledBoxOffice = styled.div`
flex: 1;
display: flex;
flex-direction: column;
padding: ${props => props.theme.global.edgeSize.small};

.guest-list {
    flex: 1;
    .ReactVirtualized__List {
        margin-top: ${props => props.theme.global.edgeSize.medium};
        border-top: ${props => color.colorForName('border', props.theme)} solid ${props => props.theme.global.borderSize.xsmall};
    }

    .data-list.selectable {
        .ReactVirtualized__Grid__innerScrollContainer {
            cursor: inherit; // override grid default

            .guest {
                &:not(.full) {
                    cursor: pointer;
                }
            }
        }
    }
    .guest {
        padding: 10px 0;
        margin-bottom: 10px;

        border-bottom: ${props => color.colorForName('border', props.theme)} solid ${props => props.theme.global.borderSize.xsmall};


        overflow: hidden;
        h4 { margin: 0; }
        .controls {
            .grommetux-button__icon {
                padding: 0;
                display: flex;
                ${media.desktop`
                    svg {
                        width: 17px;
                        height: 17px;
                    }
                `}
            }
            min-width: 26px;
            justify-content: space-around;
            display: flex;
            flex-direction: column;
            height: 100%;
            svg { max-width: 100%; }
        }
        &.is_voided {
            text-decoration: line-through;
            .controls { visibility: hidden; }
        }
        display: flex;
        .grid {
            flex: 1;
            display: grid;
            grid-gap: 0.5rem;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr) ) ;
            align-items: center;
            > * {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        ${media.desktop`
            .grid {
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr) ) ;
            }
        `}
        ${media.phone`
            .grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr) ) ;
            }
        `}

    }
}
`;

export default StyledBoxOffice;
