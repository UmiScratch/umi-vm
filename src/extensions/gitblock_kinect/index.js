const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEyOCAxMjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cmVjdCB4PSIwLjMiIHk9IjQwLjEiIHN0eWxlPSJmaWxsOiMwQTA5MDY7IiB3aWR0aD0iMTI3LjciIGhlaWdodD0iMzMuOSIvPgoJPC9nPgoJPHJlY3QgeD0iMzUuNSIgeT0iNzQiIHN0eWxlPSJmaWxsOiMyOTI2MjU7IiB3aWR0aD0iNTYuOSIgaGVpZ2h0PSIxOS44Ii8+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiMyMjIwMjE7IiBjeD0iMjAiIGN5PSI1Ny4xIiByPSIxNyIvPgoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzUxNTA1MTsiIGN4PSIyMCIgY3k9IjU3LjEiIHI9IjE1Ii8+CgkJPGNpcmNsZSBzdHlsZT0iZmlsbDojMjgyNzI4OyIgY3g9IjIwIiBjeT0iNTcuMSIgcj0iNi41Ii8+CgkJPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I0UyRTBFMTsiIGN4PSIxNi4xIiBjeT0iNTQuNSIgcng9IjIuNyIgcnk9IjMuOSIvPgoJPC9nPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZFRkVGRTsiIGQ9Ik0xMTkuNiw1My4yYy0xLjMsMC4yLTIuNywwLjktNCwxLjljLTEuMy0xLjEtMi43LTEuNy00LTEuOWMxLjEtMC45LDIuNS0xLjQsNC0xLjQKCQlDMTE3LjIsNTEuOCwxMTguNiw1Mi4zLDExOS42LDUzLjJ6IE0xMDkuOSw1Ny41YzAtMS42LDAuNi0zLjEsMS43LTQuMmMwLjUsMC41LDEuMSwxLDEuNywxLjVjMC40LDAuMywwLjksMC43LDEuNCwxLjIKCQljLTEuNSwxLjctMi42LDMuNy0zLDUuOUMxMTAuNiw2MC43LDEwOS45LDU5LjIsMTA5LjksNTcuNXogTTExMS43LDYxLjljMS4yLTEuOSwyLjUtMy42LDMuOS01LjFjMS41LDEuNSwyLjgsMy4xLDMuOSw1LjEKCQljLTEuMSwwLjktMi40LDEuNC0zLjksMS40QzExNC4yLDYzLjMsMTEyLjgsNjIuNywxMTEuNyw2MS45eiBNMTE5LjYsNjEuOGMtMC41LTIuMi0xLjUtNC4yLTMtNS45YzAuNS0wLjQsMS0wLjgsMS40LTEuMgoJCWMwLjctMC41LDEuMy0xLDEuOC0xLjVjMSwxLjEsMS43LDIuNiwxLjcsNC4yQzEyMS40LDU5LjIsMTIwLjcsNjAuNywxMTkuNiw2MS44eiIvPgoJPHJlY3QgeT0iODMuOSIgc3R5bGU9ImZpbGw6IzMyMkUyRDsiIHdpZHRoPSIxMjgiIGhlaWdodD0iOSIvPgo8L2c+Cjwvc3ZnPgo=';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3KinectBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._sensors = {};
        window.setTimeout(this.load.bind(this), 50);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'kinect',
            name: 'Kinect',
            blockIconURI: blockIconURI,
            blocks: [{
                opcode: 'getSensorOfPlayer',
                blockType: BlockType.REPORTER,
                text: '[SENSOR] of [PLAYER]',
                arguments: {
                    SENSOR: {
                        type: ArgumentType.STRING,
                        menu: 'SENSOR',
                        defaultValue: 'Head_X'
                    },
                    PLAYER: {
                        type: ArgumentType.STRING,
                        menu: 'PLAYER',
                        defaultValue: 'P1'
                    }
                }
            }, ],
            menus: {
                PLAYER: {
                    acceptReporters: true,
                    items: ['P1', 'P2']
                },
                SENSOR: {
                    acceptReporters: true,
                    items: ['AnkleLeft_X', 'AnkleLeft_Y', 'AnkleRight_X', 'AnkleRight_Y',
                        'ElbowLeft_X', 'ElbowLeft_Y', 'ElbowRight_X', 'ElbowRight_Y',
                        'FootLeft_X', 'FootLeft_Y', 'FootRight_X', 'FootRight_Y',
                        'HandLeft_X', 'HandLeft_Y', 'HandRight_X', 'HandRight_Y',
                        'HandTipLeft_X', 'HandTipLeft_Y', 'HandTipRight_X', 'HandTipRight_Y',
                        'Head_X', 'Head_Y',
                        'HipLeft_X', 'HipLeft_Y', 'HipRight_X', 'HipRight_Y',
                        'KneeLeft_X', 'KneeLeft_Y', 'KneeRight_X', 'KneeRight_Y',
                        'Neck_X', 'Neck_Y',
                        'ShoulderLeft_X', 'ShoulderLeft_Y', 'ShoulderRight_X', 'ShoulderRight_Y',
                        'SpineBase_X', 'SpineBase_Y', 'SpineMid_X', 'SpineMid_Y', 'SpineShoulder_X', 'SpineShoulder_Y',
                        'ThumbLeft_X', 'ThumbLeft_Y', 'ThumbRight_X', 'ThumbRight_Y',
                        'WristLeft_X', 'WristLeft_Y', 'WristRight_X', 'WristRight_Y',
                        'HandLeftState', 'HandRightState',
                    ]
                }
            }
        };
    }
    load() {
        var extUtils = this.runtime.extUtils;
        var self = this;
        extUtils.ajax({
            url: "http://localhost:8080",
            crossDomain: true,
            cache: false,
            loadingStyle: 'None',
            success: (r) => {
                self._sensors = r;
                window.setTimeout(self.load.bind(self), 10);
            },
            error: (e) => {
                self._sensors = {};
                window.setTimeout(self.load.bind(self), 10);
            }
        });
    }
    getSensorOfPlayer(args, util) {
        var val = this._sensors[args.PLAYER + "_" + args.SENSOR];
        return val ? val : 0;
    }
}

module.exports = Scratch3KinectBlocks;
