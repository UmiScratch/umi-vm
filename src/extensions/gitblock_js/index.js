const Variable = require('../../engine/variable');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTQxNSAyMTcgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtNDE1IDIxNyAxMjggMTI4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0tMzA5LjIsMjc4LjVoLTYuOXYtMTguN2MwLTUtNC40LTkuNC05LjQtOS40aC0xOC43di03LjVjLTAuNi02LjktNi4yLTExLjktMTIuNS0xMS45Yy02LjksMC0xMS45LDUtMTEuOSwxMS45Cgl2Ni45aC0xOC43Yy01LjYsMC0xMCw0LjQtMTAsMTB2MTguMWg2LjljNi45LDAsMTMuMSw1LjYsMTMuMSwxMy4xYzAsNi45LTUuNiwxMy4xLTEzLjEsMTMuMWgtNi45djE4LjFjMCw0LjQsNC40LDguOCw5LjQsOC44aDE4LjEKCXYtNi45YzAtNi45LDUuNi0xMy4xLDEzLjEtMTMuMWM2LjksMCwxMy4xLDUuNiwxMy4xLDEzLjF2Ni45aDE4LjFjNSwwLDkuNC00LjQsOS40LTkuNHYtMTguN2g2LjljNi45LDAsMTEuOS01LDExLjktMTEuOQoJQy0yOTcuMywyODMuNS0zMDIuMywyNzguNS0zMDkuMiwyNzguNXogTS0zNDIuNywyOTEuNWMwLDguMS00LjMsMTQuOC0xMy42LDE0LjhjLTYuNSwwLTEwLjctMi41LTEzLjctNy42bDYuOC01LjEKCWMxLjQsMi44LDMuNiw0LjEsNS42LDQuMWMzLjIsMCw1LTEuNiw1LTdWMjY0aDEwVjI5MS41eiIvPgo8L3N2Zz4=';
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTQxNSAyMTcgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtNDE1IDIxNyAxMjggMTI4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOiMxMjk2REI7IiBkPSJNLTMwNC4yLDI3OC41aC02Ljl2LTE4LjdjMC01LTQuNC05LjQtOS40LTkuNGgtMTguN3YtNy41Yy0wLjYtNi45LTYuMi0xMS45LTEyLjUtMTEuOQoJYy02LjksMC0xMS45LDUtMTEuOSwxMS45djYuOWgtMTguN2MtNS42LDAtMTAsNC40LTEwLDEwdjE4LjFoNi45YzYuOSwwLDEzLjEsNS42LDEzLjEsMTMuMWMwLDYuOS01LjYsMTMuMS0xMy4xLDEzLjFoLTYuOXYxOC4xCgljMCw0LjQsNC40LDguOCw5LjQsOC44aDE4LjF2LTYuOWMwLTYuOSw1LjYtMTMuMSwxMy4xLTEzLjFjNi45LDAsMTMuMSw1LjYsMTMuMSwxMy4xdjYuOWgxOC4xYzUsMCw5LjQtNC40LDkuNC05LjR2LTE4LjdoNi45CgljNi45LDAsMTEuOS01LDExLjktMTEuOUMtMjkyLjMsMjgzLjUtMjk3LjMsMjc4LjUtMzA0LjIsMjc4LjV6IE0tMzM3LjcsMjkxLjVjMCw4LjEtNC4zLDE0LjgtMTMuNiwxNC44Yy02LjUsMC0xMC43LTIuNS0xMy43LTcuNgoJbDYuOC01LjFjMS40LDIuOCwzLjYsNC4xLDUuNiw0LjFjMy4yLDAsNS0xLjYsNS03VjI2NGgxMEwtMzM3LjcsMjkxLjVMLTMzNy43LDI5MS41eiIvPgo8L3N2Zz4=';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3JsBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.runtime.on('PROJECT_STOP_ALL', this._init.bind(this));
        //this.runtime.on('PROJECT_START', this._init.bind(this));
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'js',
            name: 'JavaScript',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [{
                    opcode: 'serializeToJson',
                    blockType: BlockType.REPORTER,
                    text: '将[PREFIX]开头的变量转换为JSON',
                    arguments: {
                        PREFIX: {
                            type: ArgumentType.STRING,
                            defaultValue: '.'
                        }
                    }
                },
                {
                    opcode: 'deserializeFromJson',
                    blockType: BlockType.COMMAND,
                    text: '将[PREFIX]开头的变量设为JSON[JSON]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        },
                        PREFIX: {
                            type: ArgumentType.STRING,
                            defaultValue: '.'
                        }
                    }
                },
                {
                    opcode: 'postJson',
                    blockType: BlockType.COMMAND,
                    text: '发送JSON[JSON]到[URL]',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"action":"save","userId":1,"readOnly":1,"name":"","value":[]}'
                        },
                        URL: {
                            type: ArgumentType.STRING,
                            menu: 'urlNames',
                            defaultValue: 'cloudSpace'
                        }
                    }
                },
                {
                    opcode: 'postResponse',
                    blockType: BlockType.REPORTER,
                    text: '发送JSON应答'
                },
                {
                    opcode: 'callWorker',
                    blockType: BlockType.REPORTER,
                    text: 'callWorker([WORKER_ID],[MESSAGE])',
                    arguments: {
                        WORKER_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 1
                        },
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },
                /*{
                    opcode: 'callFunction',
                    blockType: BlockType.REPORTER,
                    text: 'callFunction([PACKAGE_ID],[NAME],[PARAMS])',
                    arguments: {
                        WORKER_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 1
                        },
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },*/
            ],
            menus: {
                urlNames: {
                    acceptReporters: true,
                    items: [{
                        text: '云空间',
                        value: 'cloudSpace'
                    }]
                },
            }
        };
    }

    _init() {
        if (this._workers) {
            for (var workerId in this._workers) {
                let worker = this._workers[workerId];
                if (worker) worker.terminate();
            }
            this._workers = null;
        }
    }

    serializeToJson(args, util) {
        var prefix = Cast.toString(args.PREFIX).trim();
        var jsonObj = {};
        var variables = util.target.variables;
        for (var varId in variables) {
            var variable = variables[varId];
            if (variable.type == Variable.SCALAR_TYPE || variable.type == Variable.LIST_TYPE) {
                if (variable.name.indexOf(prefix) == 0) {
                    jsonObj[variable.name.substr(prefix.length)] = variable.value;
                }
            }
        }
        return JSON.stringify(jsonObj);
    }

    deserializeFromJson(args, util) {
        var prefix = Cast.toString(args.PREFIX).trim();
        var jsonStr = args.JSON;
        var jsonObj = null;
        try {
            jsonObj = JSON.parse(jsonStr);
        } catch (e) {}
        if (!jsonObj) return;
        var variables = util.target.variables;
        for (var varId in variables) {
            var variable = variables[varId];
            var varValue = null;
            if (variable.name.indexOf(prefix) == 0) {
                varValue = jsonObj[variable.name.substr(prefix.length)];
            }
            if (varValue == undefined) continue;
            if (variable.type == Variable.LIST_TYPE && Array.isArray(varValue)) {
                for (var i = 0; i < varValue.length; i++) {
                    if (varValue[i] == null) varValue[i] = '';
                }
                variable.value = varValue;
            } else if (variable.type == Variable.SCALAR_TYPE) {
                variable.value = String(varValue);
            }
        }
    }

    postJson(args, util) {
        var extUtils = this.runtime.extUtils;
        if (extUtils.detectAbnormalAction('POST_JSON')) return;

        var jsonStr = Cast.toString(args.JSON);
        var url = Cast.toString(args.URL).trim();
        var urlMap = {
            cloudSpace: '/WebApi/Projects/CloudSpace'
        };
        let whiteList = [
            'https://redlist.zerlight.top:1100/v1',
            'https://redlist.zerlight.top:1100/v2',
            'https://www.scpo.top:1120/v1',
            'https://www.scpo.top:1120/v2',
            'https://monitor.scpo.top:7951/json/stats.json'
        ];
        if (!whiteList.includes(url.toLowerCase())) url = urlMap[url];
        if (!url) {
            this._postResponse = {
                error: "invalid url"
            };
            return;
        }
        var postData = {};
        try {
            postData = JSON.parse(jsonStr);
        } catch (e) {
            this._postResponse = {
                error: "invalid json"
            };
            return;
        }
        return new Promise(resolve => {
            extUtils.ajax({
                url: url,
                loadingStyle: "none",
                hashStr: '',
                data: postData,
                type: "POST"
            }).done(r => {
                this._postResponse = r;
                resolve();
            }).error(r => {
                this._postResponse = {
                    error: "unexpected error"
                };
                resolve();
            });
        });
    }

    postResponse(args, util) {
        return JSON.stringify(this._postResponse);
    }

    _getWorker(workerId) {
        if (!this._workers) this._workers = {};
        let worker = this._workers[workerId];
        if (!worker) {
            worker = new Worker(`/WebApi/JsWorkers/${workerId}/GetScript`);
            this._workers[workerId] = worker;
            worker.addEventListener('error', (e) => {
                if (!e.filename) delete this._workers[workerId];
            });
        }
        return worker;
    }

    callWorker(args, util) {
        if (typeof (Worker) == "undefined") {
            alert("你的浏览器不支持worker");
            return '';
        }

        const workerId = Cast.toNumber(args.WORKER_ID);
        const message = args.MESSAGE;
        return new Promise(resolve => {
            let worker = this._getWorker(workerId);
            let removeListeners = () => {
                worker.removeEventListener('message', onMessage);
                worker.removeEventListener('error', onError);
                worker.removeEventListener('messageerror', onMessageError);
            };
            let onMessage = (event) => {
                removeListeners();
                resolve(JSON.stringify(event.data));
            };
            let onError = (e) => {
                removeListeners();
                resolve('');
            };
            let onMessageError = (e) => {
                removeListeners();
                resolve('');
            };
            worker.addEventListener('message', onMessage);
            worker.addEventListener('error', onError);
            worker.addEventListener('messageerror', onMessageError);
            try {
                worker.postMessage(JSON.parse(message));
            } catch (e) {
                removeListeners();
                resolve('');
            }
        });
    }
}

module.exports = Scratch3JsBlocks;
