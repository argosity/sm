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
    .query-builder {
        margin: ${props => props.theme.global.edgeSize.medium} 0;
    }
    .ReactVirtualized__List {
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
               justify-content: center;
               ${media.desktop`
svg {
                        width: 17px;
                        height: 17px;
                    }
`}
               > * { display: flex; }
               &:hover { path { fill: black; } }
            }
            min-width: 26px;
            justify-content: space-evenly;
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
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            > * {
              flex: 1;
              margin-right: 0.5rem;
              min-width: 180px;
              word-wrap: break-word;
            }
            .pur-rdm {
              max-width: 130px;
              min-width: 130px;
            }
        }
    }
}
`;

export default StyledBoxOffice;
