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

    .ReactVirtualized__Grid__innerScrollContainer {
        cursor: inherit; // override grid default
        padding-bottom: 5px;
        .guest {
            &:not(.full) {
                cursor: pointer;
            }
        }
    }

    .guest {

        border-bottom: ${props => color.colorForName('border', props.theme)} solid ${props => props.theme.global.borderSize.xsmall};


        overflow: hidden;
        h4 { margin: 0; }
        .controls {
            > * {
               padding: 0;
               display: flex;
               align-items: center;
               justify-content: flex-end;
               ${media.desktop`
svg {
                        width: 17px;
                        height: 17px;
                    }
               `}
               > * { display: flex; }
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
