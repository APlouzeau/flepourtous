import common from "./common";
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
} as const;
