import styled, { css, keyframes } from 'styled-components';

import grommetStyles from 'grommet/utils/styles';

// @import '~grommet/scss/hpe/hpe.defaults';
// @import '~grommet/scss/grommet-core/settings';

// .grommet {
//     @import "inuit-normalize/generic.normalize";
//     @import "inuit-reset/generic.reset";
//     @import "inuit-shared/generic.shared";
// }

// @import '~grommet/scss/grommet-core/base';
// @import '~grommet/scss/grommet-core/objects';

// @import '~grommet/scss/hpe/objects.button-hpe';
// @import '~grommet/scss/hpe/objects.anchor-hpe';

//
// .show-times {
//     margin-left: 0;
//     padding-left: 0;
//     .common-time {
//         font-size: 110%;
//     }
//     .dates {
//         display: inline;
//         margin-left: 1rem;
//     }
//     .date {
//         list-style: none;
//         display: inline-block;
//         &:after {
//             content: ",";
//             margin-right: 0.5rem;
//         }
//         &:last-child {
//             margin-right: 0;
//             &:after {
//                 content: "";
//             }
//         }
//     }
// }

const StyledListing = styled.div`

    min-height: 200px;

    .show {
        border-bottom: 1px solid lightgray;
        margin-bottom: 10px;
        padding-bottom: 10px;
        display: flex;

        &:first-child {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid lightgray;
        }

        .image {
            align-self: center;
            max-width: 240px;
        }
        .presenter {
            padding-right: 0.5rem;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            .venue {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                img {
                    max-height: 50px;
                    margin-right: 1rem;
                }
            }
            .main {
                flex: 1;
                display: flex;
                .info {
                    margin: 0 10px;
                    flex: 1;
                    flex-direction: column;
                    min-width: 0;
                    justify-content: flex-start;
                    h2, h3, p {
                        min-width: 0;
                        word-wrap: break-word;
                        margin-bottom: 0;
                    }
                    .title {
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;


                        img {
                            max-height: 50px;
                            margin-right: 1rem;
                        }
                        h2 {
                            font-size: 30px;
                        }
                    }
                }

                .actions {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    align-items: stretch;
                    margin: 0 10px;
                    .grommetux-button {
                        margin-top: 10px;
                    }
                }
            }
        }
        @media only screen and (max-width: 720px) {
            flex-wrap: wrap;
            .logo, .info, .actions {
                min-width: 100%;
            }
            .content {
                flex-direction: column-reverse;
                .main {
                    flex-direction: column;
                    .actions {
                        flex-direction: row;
                        justify-content: space-around;
                        flex-wrap: wrap;
                        .grommetux-button + .grommetux-button {
                            margin-left: 0.5rem;
                        }
                    }
                }
            }
        }
    }
    .credits {
        font-size: 0.9rem;
        text-align: right;
        font-variant: petite-caps;
        font-style: italic;
    }
`;
//
// .grommet footer {
//     display: flex;
//     justify-content: flex-end;
//     // @include media-query(palm) {
//     //     justify-content: space-around;
//     // }
//     margin: 10px 0;
// }
//
// .show-receipt,
// .show-information,
// .show-purchase {
//
//     @include mq($until: tablet) {
//         &.grommetux-layer {
//             position: fixed;
//             overflow: auto;
//             -webkit-overflow-scrolling: touch;
//             left: 0;
//             right: 0;
//             top: 0;
//             bottom: 0;
//             .contents {
//                 position: fixed;
//                 left: 0;
//                 right: 0;
//                 top: 0;
//                 bottom: 0;
//
//             }
//         }
//         .grommetux-layer__container {
//             position: fixed;
//             top: 0;
//             bottom: 0;
//             left: 0;
//             right: 0;
//             overflow: auto;
//              -webkit-overflow-scrolling: touch;
//             display: block;
//         }
//     }
//
//     .contents {
//         overflow: hidden;
//         max-height: 100vh;
//         .body {
//             flex: 1;
//             overflow: auto;
//              -webkit-overflow-scrolling: touch;
//         }
//     }
// }
//
// $show-layer-padding: 48px 0;
//
// .show-information {
//     .text-editor-content {
//         flex: 1;
//         max-width: 1000px;
//         padding: $show-layer-padding;
//         min-height: 80vh;
//         @include media-query(lap-and-up) {
//             min-width: 45em;
//         }
//     }
// }
//
// .show-receipt {
//     .contents {
//         padding: $show-layer-padding;
//     }
// }
//
// .show-purchase {
//     .image img { max-height: 100%; }
//
//     .totals-line {
//         margin-top: 0.5rem;
//         h2 { margin: 0; }
//         .ea { flex: 1; }
//         .form-field {
//             min-width: 200px;
//         }
//         .total {
//             min-width: 200px;
//         }
//         .times {
//             min-width: 250px;
//         }
//     }
//     .grommetux-value {
//         display: flex;
//         flex-direction: row;
//         justify-content: center;
//         align-items: center;
//         .grommetux-value__annotated div {
//             display: flex;
//             flex-direction: row-reverse;
//             margin-right: 0.5rem;
//         }
//     }
//     .form-field {
//         &.card {
//             .grommetux-form-field { overflow: hidden; }
//         }
//     }
//     .top-info {
//         display: flex;
//         .image {
//             align-self: center;
//             max-width: 240px;
//             margin-right: 1rem;
//         }
//         @include media-query(palm) {
//             flex-wrap: wrap;
//             .image {
//                 flex: 1;
//                 max-width: 100%;
//                 margin-right: 0;
//             }
//             .grommetux-heading { margin-bottom: 0; }
//         }
//     }
// }
// .grommet.grommetux-drop {
//     .grommetux-select__options {
//         margin-left: 0;
//     }
// }

export default StyledListing;
