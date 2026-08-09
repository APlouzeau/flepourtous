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
import rules from "./rules";
import privacy from "./privacy";

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
    ...rules,
    ...privacy,
} as const;
