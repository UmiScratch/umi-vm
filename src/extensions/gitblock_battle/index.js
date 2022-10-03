const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTEzOSA4MSAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IC0xMzkgODEgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAuNCwxNjMuMnY4My4ySC05OC40di0xNy4zYzAtMTEuMyw2LjQtMjEuNSwxNi40LTI2LjZsMjEuMy0xMC42YzYtMyw5LjktOS4yLDkuOS0xNnYtMTguN2wtOC4yLDQuMQoJYy0yLjMsMS4yLTQsMy4zLTQuNyw1LjhsLTQuNCwxNy42Yy0wLjMsMS40LTEuMywyLjUtMi43LDMuMWwtMTEsNC40Yy0xLjEsMC40LTIuNCwwLjQtMy41LTAuMWwtMjIuNC05LjljLTEuNi0wLjctMi42LTIuMy0yLjYtNC4xCgl2LTU4LjhjMC0yLjQsMC45LTQuNiwyLjYtNi4zbDMuMy0zLjNsLTUuMy0xMC42Yy0wLjQtMC45LTAuNy0xLjgtMC43LTIuOGMwLTIuNSwyLTQuNSw0LjUtNC41aDU1Qy0xMS41LDkxLjgsMjAuNCwxMjMuOCwyMC40LDE2My4yCgl6IE0yNy45LDI1Mi4zaC0xMzMuOGMtMi41LDAtNC41LDItNC41LDQuNXY4LjljMCwyLjUsMiw0LjUsNC41LDQuNUgyNy45YzIuNSwwLDQuNS0yLDQuNS00LjV2LTguOQoJQzMyLjMsMjU0LjMsMzAuMywyNTIuMywyNy45LDI1Mi4zeiBNLTkxLDEyNy41Yy00LjEsMC03LjQsMy4zLTcuNCw3LjRzMy4zLDcuNCw3LjQsNy40YzQuMSwwLDcuNC0zLjMsNy40LTcuNFMtODYuOSwxMjcuNS05MSwxMjcuNQoJeiIvPgo8L3N2Zz4=';
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTEzOSA4MSAyMDAgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IC0xMzkgODEgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiMxMjk2REI7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAuNCwxNjMuMnY4My4ySC05OC40di0xNy4zYzAtMTEuMyw2LjQtMjEuNSwxNi40LTI2LjZsMjEuMy0xMC42YzYtMyw5LjktOS4yLDkuOS0xNnYtMTguN2wtOC4yLDQuMQoJYy0yLjMsMS4yLTQsMy4zLTQuNyw1LjhsLTQuNCwxNy42Yy0wLjMsMS40LTEuMywyLjUtMi43LDMuMWwtMTEsNC40Yy0xLjEsMC40LTIuNCwwLjQtMy41LTAuMWwtMjIuNC05LjljLTEuNi0wLjctMi42LTIuMy0yLjYtNC4xCgl2LTU4LjhjMC0yLjQsMC45LTQuNiwyLjYtNi4zbDMuMy0zLjNsLTUuMy0xMC42Yy0wLjQtMC45LTAuNy0xLjgtMC43LTIuOGMwLTIuNSwyLTQuNSw0LjUtNC41aDU1Qy0xMS41LDkxLjgsMjAuNCwxMjMuOCwyMC40LDE2My4yCgl6IE0yNy45LDI1Mi4zaC0xMzMuOGMtMi41LDAtNC41LDItNC41LDQuNXY4LjljMCwyLjUsMiw0LjUsNC41LDQuNUgyNy45YzIuNSwwLDQuNS0yLDQuNS00LjV2LTguOQoJQzMyLjMsMjU0LjMsMzAuMywyNTIuMywyNy45LDI1Mi4zeiBNLTkxLDEyNy41Yy00LjEsMC03LjQsMy4zLTcuNCw3LjRzMy4zLDcuNCw3LjQsNy40YzQuMSwwLDcuNC0zLjMsNy40LTcuNFMtODYuOSwxMjcuNS05MSwxMjcuNQoJeiIvPgo8L3N2Zz4=';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3BattleBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._id = '';
        this._error = '';
        this._situation = {};
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'battle',
            name: 'Battle',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [/*{
                    opcode: 'create',
                    blockType: BlockType.COMMAND,
                    text: '创建[TYPE]-[PASSWORD]',
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },*/
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: '连接[ID]-[PASSWORD]',
                    arguments: {
                        ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ' '
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                /*{
                    opcode: 'config',
                    blockType: BlockType.COMMAND,
                    text: '设置[OPTIONS]',
                    arguments: {
                        OPTIONS: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },*/
                {
                    opcode: 'excute',
                    blockType: BlockType.COMMAND,
                    text: '执行[COMMAND]',
                    arguments: {
                        COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'refresh',
                    blockType: BlockType.COMMAND,
                    text: '刷新',
                    arguments: {
                        COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'getId',
                    blockType: BlockType.REPORTER,
                    text: 'ID'
                },
                {
                    opcode: 'getError',
                    blockType: BlockType.REPORTER,
                    text: '错误'
                },
                {
                    opcode: 'getSituation',
                    blockType: BlockType.REPORTER,
                    text: '战况'
                }
            ]
        };
    }

    _ajax(options) {
        var self = this;
        var extUtils = this.runtime.extUtils;
        var promise = new Promise(resolve => {
            extUtils.ajax({
                url: options.url,
                data: options.data,
                loadingStyle: 'None',
                success: (r) => {
                    if (r.error) {
                        self._error = r.error;
                    } else {
                        self._error = '';
                        if (r.id) self._id = r.id;
                        if (r.situation) self._situation = r.situation;
                        if (options.success) options.success(r);
                    }
                    resolve();
                },
                error: (e) => {
                    this._error = '未知服务器错误';
                }
            });
        });
        return promise;
    }

    create(args, util) {
        var type = args.TYPE;
        var password = args.PASSWORD;
        return this._ajax({
            url: `/WebApi/Battles/Create`,
            data: {
                type: type,
                password: password
            }
        });
    }

    connect(args, util) {
        var id = Number(args.ID);
        var password = args.PASSWORD;
        return this._ajax({
            url: `/WebApi/Battles/${id}/Connect`,
            data: {
                password: password
            }
        });
    };

    config(args, util) {
        if (!this._id) return;
        var options = args.OPTIONS;
        return this._ajax({
            url: `/WebApi/Battles/${this._id}/Config`,
            data: {
                options: options
            }
        });
    };

    excute(args, util) {
        if (!this._id) return;
        var command = args.COMMAND;
        return this._ajax({
            url: `/WebApi/Battles/${this._id}/Excute`,
            data: {
                command: command
            }
        });
    };

    refresh(args, util) {
        if (!this._id) return;
        return this._ajax({
            url: `/WebApi/Battles/${this._id}/Refresh`
        });
    };

    getId(args, util) {
        return this._id;
    };

    getError(args, util) {
        return this._error;
    };

    getSituation(args, util) {
        return JSON.stringify(this._situation);
    };
}

module.exports = Scratch3BattleBlocks;
