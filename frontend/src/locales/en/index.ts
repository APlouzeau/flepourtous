import common from './common';
import footer from './footer';
import header from './header';
import homePage from './homePage';

export default {
    ...common,
    ...footer,
    ...header,
    ...homePage,
} as const;
