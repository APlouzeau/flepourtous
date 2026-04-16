import profile from "./profile";
import common from "./common";
import coursesOffer from "./courses-offer";
import footer from "./footer";
import header from "./header";
import homePage from "./homePage";
import ressources from "./ressources";
import cgv from "./cgv";

export default {
    ...common,
    ...footer,
    ...header,
    ...homePage,
    ...ressources,
    ...coursesOffer,
    ...profile,
    ...cgv,
} as const;
