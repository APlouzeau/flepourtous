import profile from "./profile";
import common from "./common";
import coursesOffer from "./courses-offer";
import footer from "./footer";
import header from "./header";
import homePage from "./homePage";
import ressources from "./ressources";
import cgv from "./cgv";
import calendar from "./calendar";
import payments from "./payments";

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
    ...payments,
} as const;
