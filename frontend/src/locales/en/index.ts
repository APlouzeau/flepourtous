import common from "./common";
import coursesOffer from "./courses-offer";
import footer from "./footer";
import header from "./header";
import homePage from "./homePage";
import ressources from "./ressources";

export default {
    ...common,
    ...footer,
    ...header,
    ...homePage,
    ...ressources,
    ...coursesOffer,
} as const;
