const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

class Xiaoma {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'xiaoma',
            name: 'XMW Blocks',
            blockIconURI: blockIconURI,
            blocks: [{
                opcode: 'getXiaomaUserInfo',
                blockType: BlockType.REPORTER,
                text: 'XMW [USER_TYPE]',
                arguments: {
                    USER_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'USER_TYPE',
                        defaultValue: 'userID'
                    }
                }
            }, {
                opcode: 'xiaomaPurchase',
                blockType: BlockType.COMMAND,
                text: 'pay [MONEY] for [COMMODITY]',
                arguments: {
                    MONEY: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '1'
                    },
                    COMMODITY: {
                        type: ArgumentType.STRING,
                        defaultValue: '🐴'
                    }
                }
            }],
            menus: {
                USER_TYPE: {
                    items: ['userID', 'username']
                }
            }
        };
    }
    
    getXiaomaUserInfo () {
        return ' ';
    }
    
    xiaomaPurchase () {}
}

module.exports = Xiaoma;
