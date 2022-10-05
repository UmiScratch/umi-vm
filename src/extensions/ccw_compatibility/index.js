const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

class CCW {
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
            id: 'ccw',
            name: 'CCW compatibility',
            color1: '#FF6680',
            blocks: [{
                opcode: 'hat_parameter',
                blockType: BlockType.REPORTER,
                text: 'command',
                arguments: {
                    VALUE: {
                        type: ArgumentType.STRING,
                        menu: 'VALUE',
                        defaultValue: 'command'
                    }
                }
            }],
            menus: {
                VALUE: {
                    items: ['command']
                }
            }
        };
    }
    
    hat_parameter () {
        return '';
    }
}

module.exports = CCW;
