const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const StringUtil = require('../../util/string-util');
const {
    loadSound
} = require('../../import/load-sound.js');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTUwMyAyMTcgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtNTAzIDIxNyAxMjggMTI4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+Cjx0aXRsZT5tdXNpYy1ibG9jay1pY29uPC90aXRsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTS00NzcuNCwzMjMuMmMtMTMuOSwwLTI1LjEtMTEuNi0yNS4xLTI1LjljMC0xNCwxMC44LTI1LjUsMjQuMy0yNS45YzAuNi0xMSw5LjUtMTkuNywyMC4zLTE5LjcKCWMxLjUsMCwzLjEsMC4yLDQuNSwwLjVjNi4zLTEwLDE3LjItMTYuNywyOS42LTE2LjdjMTkuNCwwLDM1LjEsMTYuMiwzNS4xLDM2LjNjMCwwLjksMCwxLjgtMC4xLDIuN2M3LjgsNC40LDEzLjEsMTIuOSwxMy4xLDIyLjcKCWMwLDE0LjMtMTEuMiwyNS45LTI1LjEsMjUuOUgtNDc3LjR6IE0tNDMzLjUsMzA1LjJjLTEwLjMtNDYuMS04LjQtMzMuMS0wLjYtMzFjNy44LDIuMSwxOS43LTEwLDcuNy04LjFjLTEyLDEuOS0yMi45LTIwLjEtMTguNSw1LjgKCWMzLjYsMjAuOSw1LjcsMjUuNywzLjksMjUuN2MtMC42LTAuMy0xLjMtMC41LTItMC42Yy0xLjMtMC4zLTIuNi0wLjUtNC0wLjVjLTYuNSwwLTEwLjksMy45LTEwLDguN2MwLjksNC44LDYuOSw4LjcsMTMuNCw4LjcKCUMtNDM3LDMxMy45LTQzMi41LDMxMC4xLTQzMy41LDMwNS4yTC00MzMuNSwzMDUuMnoiLz4KPC9zdmc+';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iLTQxNSAyMTcgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtNDE1IDIxNyAxMjggMTI4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cjx0aXRsZT5tdXNpYy1ibG9jay1pY29uPC90aXRsZT4KPHBhdGggc3R5bGU9ImZpbGw6IzEyOTZEQjsiIGQ9Ik0tMzg5LjMsMzI0LjhjLTEzLjksMC0yNS4xLTExLjYtMjUuMS0yNS45YzAtMTQsMTAuOC0yNS41LDI0LjMtMjUuOWMwLjYtMTEsOS41LTE5LjcsMjAuMy0xOS43CgljMS41LDAsMy4xLDAuMiw0LjUsMC41YzYuMy0xMCwxNy4yLTE2LjcsMjkuNi0xNi43YzE5LjQsMCwzNS4xLDE2LjIsMzUuMSwzNi4zYzAsMC45LDAsMS44LTAuMSwyLjdjNy44LDQuNCwxMy4xLDEyLjksMTMuMSwyMi43CgljMCwxNC4zLTExLjIsMjUuOS0yNS4xLDI1LjlMLTM4OS4zLDMyNC44TC0zODkuMywzMjQuOHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0tMzQ1LjQsMzA2LjhjLTEwLjMtNDYuMS04LjQtMzMuMS0wLjYtMzFjNy44LDIuMSwxOS43LTEwLDcuNy04LjFjLTEyLDEuOS0yMi45LTIwLjEtMTguNSw1LjgKCWMzLjYsMjAuOSw1LjcsMjUuNywzLjksMjUuN2MtMC42LTAuMy0xLjMtMC41LTItMC42Yy0xLjMtMC4zLTIuNi0wLjUtNC0wLjVjLTYuNSwwLTEwLjksMy45LTEwLDguN3M2LjksOC43LDEzLjQsOC43CglDLTM0OC45LDMxNS41LTM0NC40LDMxMS44LTM0NS40LDMwNi44TC0zNDUuNCwzMDYuOHoiLz4KPC9zdmc+';

/**
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3LazyAudioBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this._bufferedAudios = {};
    }

    _resetAudios() {
        this._bufferedAudios = {};
    }
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'lazyAudio',
            name: 'LazyAudio',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [{
                    opcode: 'load',
                    blockType: BlockType.COMMAND,
                    text: 'load([AUDIO_ID])',
                    arguments: {
                        AUDIO_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: '6ac484e97c1c1fe1384642e26a125e70.wav'
                        }
                    }
                },
                {
                    opcode: 'playAndWait',
                    blockType: BlockType.COMMAND,
                    text: 'playAndWait([AUDIO_ID])',
                    arguments: {
                        AUDIO_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: '6ac484e97c1c1fe1384642e26a125e70.wav'
                        }
                    }
                }
            ],
            menus: {}
        };
    }

    load(args, util) {
        const audioId = args.AUDIO_ID;
        if (!this._bufferedAudios[audioId]) {
            const sound = {
                md5: audioId
            };
            const soundBank = util.target.sprite.soundBank;
            const self = this;
            return loadSound(sound, this.runtime, soundBank).then(() => {
                self._bufferedAudios[audioId] = sound;
                if (self._totalLoadedSize == null) self._totalLoadedSize = 0;
                self._totalLoadedSize += sound.asset.data.length;
                if (self._totalLoadedSize >= 16 * 1024 * 1024) {
                    var extUtils = self.runtime.extUtils;
                    var ctx = extUtils.getContext();
                    extUtils.ajax({
                        url: '/WebApi/Log/BlobAccess',
                        loadingStyle: "none",
                        hashStr: '',
                        data: {
                            targetType: ctx.targetType,
                            targetId: ctx.target.id,
                            deltaSize: this._totalLoadedSize,
                        },
                        type: 'POST'
                    }).done(r => {
                        self._totalLoadedSize = 0;
                    }).error(r => {});
                }
            });
        }
    }

    playAndWait(args, util) {
        const audioId = args.AUDIO_ID;
        const sound = this._bufferedAudios[audioId];
        if (!sound) return;

        const soundBank = util.target.sprite.soundBank;
        if (!soundBank.soundPlayers[sound.soundId]) {
            return loadSound(sound, this.runtime, soundBank).then(() => {
                return soundBank.playSound(util.target, sound.soundId);
            });
        }
        return soundBank.playSound(util.target, sound.soundId);
    }
}

module.exports = Scratch3LazyAudioBlocks;
