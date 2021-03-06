import styled from 'styled-components';

const StyledSaleForm = styled.div`

max-width: 1024px;
min-width: 800px;

 .totals-line {
    .qty {
        width: 120px;
    }
    .total {
        min-width: 200px;
    }
    h3 {
        margin: 0;
    }
 }
 .main-fields {
    position: relative;
    .fields {
        transition: opacity 0.4s;
        opacity: 1;
    }
    .selection-prompt {
        display: flex;
        align-items: baseline;
        justify-content: flex-start;
        position: absolute;
        top: -10px;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.4s;
        .pointer-arrow {
            width: 120px;
            margin: 0 1rem 0 100px;
        }
        h3 { margin: 0; font-weight: bolder; }
    }
        &.obscured {
        .fields {
            opacity: 0.2;
        }
        .selection-prompt {
            opacity: 1;
        }
        }

    footer {
        //border-top: 1px solid $border-color;
        margin-top: 40px;
        padding-top: 40px;
    }
}
`;


export default StyledSaleForm;
