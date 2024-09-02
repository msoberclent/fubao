"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = void 0;
const load = function () {
    console.debug(`piter_assests_decode load`);
};
exports.load = load;
const unload = function () {
    console.debug(`piter_assests_decode unload`);
};
exports.unload = unload;
const PACKAGE_NAME = 'piter_assests_decode';
const buildPlugin = {
    hooks: './hooks',
    options: {
        enablePlugins: {
            label: `i18n:piter_assests_decode.builder.enablePlugins`,
            description: `i18n:piter_assests_decode.builder.enablePlugins`,
            default: true,
            render: {
                ui: 'ui-checkbox'
            }
        },
        assests_key: {
            label: `i18n:piter_assests_decode.builder.assests_key`,
            description: `i18n:piter_assests_decode.builder.assests_key`,
            default: '',
            render: {
                ui: 'ui-input',
                attributes: {
                    placeholder: '6-12位',
                },
            }
        },
        assests_secret: {
            label: `i18n:piter_assests_decode.builder.assests_secret`,
            description: `i18n:piter_assests_decode.builder.assests_secret`,
            default: '',
            render: {
                ui: 'ui-input',
                attributes: {
                    placeholder: '6-12位字符',
                },
            }
        }
    },
    verifyRuleMap: {},
};
const webBuildPlugin = {
    hooks: './hooks',
    options: {
        enablePlugins: {
            label: `i18n:piter_assests_decode.builder.enablePlugins`,
            description: `i18n:piter_assests_decode.builder.enablePlugins`,
            default: true,
            render: {
                ui: 'ui-checkbox'
            }
        },
        version: {
            label: `i18n:piter_assests_decode.builder.version`,
            description: `i18n:piter_assests_decode.builder.version`,
            default: '',
            render: {
                ui: 'ui-input',
                attributes: {
                    placeholder: '网页资源版本号',
                },
            }
        }
    },
    verifyRuleMap: {},
};
exports.configs = {
    'ios': buildPlugin,
    'mac': buildPlugin,
    'android': buildPlugin,
    'windows': buildPlugin,
    'web-mobile': webBuildPlugin
};
