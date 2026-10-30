import calendar from "./calendar";
import cgv from "./cgv";
import common from "./common";
import coursesOffer from "./courses-offer";
import footer from "./footer";
import header from "./header";
import homePage from "./homePage";
import payments from "./payments";
import privacy from "./privacy";
import profile from "./profile";
import ressources from "./ressources";
import rules from "./rules";
import seo from "./seo";

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
    ...seo,
} as const;
