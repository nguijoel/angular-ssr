const path = require('path');
const colors = require('tailwindcss/colors');
const  buildConfig =  require(path.resolve(__dirname, ('../@lib/tailwind.config-builder')));

/**
 * Custom themes
 */
const themes = {
    'default': {
        accent  : {
            ...colors.teal,
            DEFAULT: colors.teal[600]
        },
        primary: {
            ...colors.slate,
            DEFAULT: colors.slate[800]
        },
        warn: {
            ...colors.red,
            DEFAULT: colors.red[600]
        },
        'on-warn': {
            500: colors.red['50']
        }
    },
 };

 const options = {
    /**
     * The path of the use theme file.
     */
    filename: path.resolve(__dirname, ('./src/@fuse/styles/user-themes.scss')),
    fontFamilySans:'Poppins',
    fontFamilyMono:'Domine',

    bgDefaultLight: '#f5f5f5'
 };

/**
 * Tailwind configuration
 */
const config = buildConfig(themes, options);

module.exports = config;
