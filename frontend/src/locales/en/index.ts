import calendar from "./calendar";
import cgv from "./cgv";
import common from "./common";
import coursesOffer from "./courses-offer";
import footer from "./footer";
import header from "./header";
import homePage from "./homePage";
import profile from "./profile";
import ressources from "./ressources";

export default {
    ...common,
    ...footer,
    ...header,
    ...homePage,
    ...ressources,
    ...coursesOffer,
    ...profile,
    ...cgv,
    ...calendar,
} as const;
