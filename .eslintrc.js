module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "spread": true,
            "experimentalObjectRestSpread": true,
            "impliedStrict": true
        },
        "sourceType": "module"
    },
    "rules": {
        "no-undef": "off",
        "no-console": "off",
        "no-unused-vars": "off",
        "no-unreachable": "off",
        "no-trailing-spaces": "off",
        "indent": [
            "error", 4, {
                "SwitchCase": 1
            }
        ],
        "semi": ["error", "always"],
        "semi-spacing": [
            "error", {
                "before": false,
                "after": true
            }
        ],
        "quotes": [
            "error", "single", {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "quote-props": ["error", "consistent-as-needed"],
        "space-before-function-paren": [
            "error", {
                "anonymous": "always",
                "named": "never",
                "asyncArrow": "always"
            }
        ],
        "linebreak-style": "off"
    }
};
