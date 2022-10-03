const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');
const StageLayering = require('../../engine/stage-layering');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00NTkgMjYxIDQwIDQwIj48cGF0aCBkPSJNLTQ0NC40IDI5MC41bC0zLjYtMy42cy0xLjEgMS40LTMuOC44bC0zLjQgOS41Yy0uMS4zLjIuNi41LjVsOS41LTMuNGMtLjYtMi43LjgtMy44LjgtMy44eiIgZmlsbD0iI2Y3YzY3ZiIgc3Ryb2tlPSIjNTc1ZTc1IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiLz48cGF0aCBkPSJNLTQ0MS45IDI5MC40bDE5LjUtMjIuMXMxLjMtMS42LS4yLTMuMWMtMS42LTEuNS0zLjEtLjItMy4xLS4ybC0yMi4xIDE5LjUtLjIgMi41IDEuOCAxLjggMS44IDEuOCAyLjUtLjJ6IiBmaWxsPSIjZjQ2ZDM4IiBzdHJva2U9IiM1NzVlNzUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzU3NWU3NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0tNDU1LjEgMjk3LjZsMy44LTMuOCIvPjxwYXRoIGZpbGw9IiM5NWQ4ZDYiIHN0cm9rZT0iIzU3NWU3NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0tNDQ2LjUgMjgzLjFsNS44IDUuOCAyLjktMy4yLTUuNC01LjR6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjNTc1ZTc1IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0tNDQzLjYgMjg2bC0yLjktMi45LTEuMyAxLjItLjMgMi42IDMuNyAzLjYgMi41LS4xIDEuMi0xLjV6Ii8+PHBhdGggZD0iTS00NDQuOCAyOTAuMmwyLjYtLjIgMTkuNC0yMnMuOC0xLjEuMS0yLjFsLTMwLjkgMzAuOCA3LjgtMi43Yy0uNC0yLjIuNi0zLjUgMS0zLjh6IiBvcGFjaXR5PSIuMiIgZmlsbD0iIzM1MzUzNSIvPjwvc3ZnPg==';

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
class Scratch3CanvasBlocks {
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
            id: 'canvas',
            name: 'Canvas',
            blockIconURI: blockIconURI,
            blocks: [{
                    opcode: 'beginPath',
                    blockType: BlockType.COMMAND,
                    text: 'beginPath',
                    arguments: {}
                },
                {
                    opcode: 'closePath',
                    blockType: BlockType.COMMAND,
                    text: 'closePath',
                    arguments: {}
                },
                {
                    opcode: 'moveTo',
                    blockType: BlockType.COMMAND,
                    text: 'moveTo([X],[Y])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'lineTo',
                    blockType: BlockType.COMMAND,
                    text: 'lineTo([X],[Y])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'arc',
                    blockType: BlockType.COMMAND,
                    text: 'arc([X],[Y],[RADIUS],[START_ANGLE],[END_ANGLE])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        RADIUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '100'
                        },
                        START_ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        END_ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '3.1415926'
                        }
                    }
                },
                {
                    opcode: 'rect',
                    blockType: BlockType.COMMAND,
                    text: 'rect([X],[Y],[W],[H])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        W: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '100'
                        },
                        H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '100'
                        }
                    }
                },
                {
                    opcode: 'clip',
                    blockType: BlockType.COMMAND,
                    text: 'clip'
                },
                {
                    opcode: 'setLineWidth',
                    blockType: BlockType.COMMAND,
                    text: 'setLineWidth([LINE_WIDTH])',
                    arguments: {
                        LINE_WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'setLineCap',
                    blockType: BlockType.COMMAND,
                    text: 'setLineCap([LINE_CAP])',
                    arguments: {
                        LINE_CAP: {
                            type: ArgumentType.STRING,
                            defaultValue: 'round'
                        }
                    }
                },
                {
                    opcode: 'setStrokeStyle',
                    blockType: BlockType.COMMAND,
                    text: 'setStrokeStyle([STROKE_STYLE])',
                    arguments: {
                        STROKE_STYLE: {
                            type: ArgumentType.STRING,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'setFillStyle',
                    blockType: BlockType.COMMAND,
                    text: 'setFillStyle([FILL_STYLE])',
                    arguments: {
                        FILL_STYLE: {
                            type: ArgumentType.STRING,
                            defaultValue: '#000000'
                        }
                    }
                },
                {
                    opcode: 'stroke',
                    blockType: BlockType.COMMAND,
                    text: 'stroke'
                },
                {
                    opcode: 'fill',
                    blockType: BlockType.COMMAND,
                    text: 'fill'
                },
                {
                    opcode: 'clearRect',
                    blockType: BlockType.COMMAND,
                    text: 'clearRect([X],[Y],[W],[H])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        W: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '480'
                        },
                        H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '360'
                        }
                    }
                },
                {
                    opcode: 'setFont',
                    blockType: BlockType.COMMAND,
                    text: 'setFont([FONT])',
                    arguments: {
                        FONT: {
                            type: ArgumentType.STRING,
                            defaultValue: '30px Arial'
                        }
                    }
                },
                {
                    opcode: 'strokeText',
                    blockType: BlockType.COMMAND,
                    text: 'strokeText([TEXT],[X],[Y])',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'fillText',
                    blockType: BlockType.COMMAND,
                    text: 'fillText([TEXT],[X],[Y])',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'measureText',
                    blockType: BlockType.REPORTER,
                    text: 'measureText([TEXT])',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        }
                    }
                },
                {
                    opcode: 'loadImage',
                    blockType: BlockType.COMMAND,
                    text: 'loadImage([IMAGE_ID])',
                    arguments: {
                        IMAGE_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'bcaaa8547a07cfe572c0967ba829e99d.svg'
                        }
                    }
                },
                {
                    opcode: 'drawImage',
                    blockType: BlockType.COMMAND,
                    text: 'drawImage([IMAGE_ID],[X],[Y])',
                    arguments: {
                        IMAGE_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'bcaaa8547a07cfe572c0967ba829e99d.svg'
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'scale',
                    blockType: BlockType.COMMAND,
                    text: 'scale([SCALE_W],[SCALE_H])',
                    arguments: {
                        SCALE_W: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        },
                        SCALE_H: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        }
                    }
                },
                {
                    opcode: 'rotate',
                    blockType: BlockType.COMMAND,
                    text: 'rotate([ANGLE])',
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'translate',
                    blockType: BlockType.COMMAND,
                    text: 'translate([X],[Y])',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'transform',
                    blockType: BlockType.COMMAND,
                    text: 'transform([A],[B],[C],[D],[E],[F])',
                    arguments: {
                        A: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        B: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        C: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        D: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        E: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        },
                        F: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'clearTransform',
                    blockType: BlockType.COMMAND,
                    text: 'clearTransform'
                },
                {
                    opcode: 'save',
                    blockType: BlockType.COMMAND,
                    text: 'save'
                },
                {
                    opcode: 'restore',
                    blockType: BlockType.COMMAND,
                    text: 'restore'
                },
                {
                    opcode: 'setGlobalAlpha',
                    blockType: BlockType.COMMAND,
                    text: 'setGlobalAlpha([ALPHA])',
                    arguments: {
                        ALPHA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1.0'
                        }
                    }
                },
                {
                    opcode: 'setGlobalCompositeOperation',
                    blockType: BlockType.COMMAND,
                    text: 'setGlobalCompositeOperation([CompositeOperation])',
                    arguments: {
                        CompositeOperation: {
                            type: ArgumentType.STRING,
                            defaultValue: 'source-over'
                        }
                    }
                },
                {
                    opcode: 'switchCanvas',
                    blockType: BlockType.COMMAND,
                    text: 'switchCanvas([NUMBER])',
                    arguments: {
                        NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'stampOnStage',
                    blockType: BlockType.COMMAND,
                    text: 'stampOnStage'
                },
            ],
            menus: {}
        };
    }

    _createCanvas() {
        var penSkinId = this.runtime.penSkinId;
        if (penSkinId == undefined) return null;
        var penSkin = this.runtime.renderer._allSkins[penSkinId];
        var size = penSkin.size;
        var w = size[0];
        var h = size[1];
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        var tmpCtx = tmpCanvas.getContext("2d");
        return {
            canvas: tmpCanvas,
            ctx: tmpCtx
        };
    }

    _getContext(idx) {
        if (!this._ctx) {
            this._canvasList = [];
            for (var i = 0; i < 8; i++) this._canvasList.push(null);
            var tmpCanvas = this._createCanvas();
            if (!tmpCanvas) return null;
            this._canvasList[0] = tmpCanvas;
            this._canvas = tmpCanvas.canvas;
            this._ctx = tmpCanvas.ctx;
            this._bufferedImages = {};

            this._skinId = this.runtime.renderer.createBitmapSkin(this._createCanvas().canvas, 1);
            this._drawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._drawableId, this._skinId);
            this.runtime.renderer.updateDrawableVisible(this._drawableId, false);
        }
        if (idx != null) {
            var tmpCanvas = this._canvasList[idx];
            if (!tmpCanvas) {
                tmpCanvas = this._createCanvas();
                this._canvasList[idx] = tmpCanvas;
            }
            this._canvas = tmpCanvas.canvas;
            this._ctx = tmpCanvas.ctx;
        }
        return this._ctx;
    }

    beginPath() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.beginPath();
    }

    closePath() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.closePath();
    }

    moveTo(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.moveTo(x, y);
    }

    lineTo(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.lineTo(x, y);
    }

    rect(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const w = Cast.toNumber(args.W);
        const h = Cast.toNumber(args.H);
        ctx.rect(x, y, w, h);
    }

    arc(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const radius = Cast.toNumber(args.RADIUS);
        const startAngle = Cast.toNumber(args.START_ANGLE);
        const endAngle = Cast.toNumber(args.END_ANGLE);
        ctx.arc(x, y, radius, startAngle, endAngle);
    }

    clip() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.clip();
    }

    setLineWidth(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const lineWidth = args.LINE_WIDTH;
        ctx.lineWidth = lineWidth;
    }

    setLineCap(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const lineCap = args.LINE_CAP;
        ctx.lineCap = lineCap;
    }

    setStrokeStyle(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const strokeStyle = args.STROKE_STYLE;
        ctx.strokeStyle = strokeStyle;
    }

    setFillStyle(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const fillStyle = args.FILL_STYLE;
        ctx.fillStyle = fillStyle;
    }

    stroke() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.stroke();
    }

    fill() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.fill();
    }

    setFont(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const font = args.FONT;
        ctx.font = font;
    }

    strokeText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.strokeText(text, x, y);
    }

    fillText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.fillText(text, x, y);
    }

    measureText(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const text = args.TEXT;
        return ctx.measureText(text).width;
    }

    clearRect(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const w = Cast.toNumber(args.W);
        const h = Cast.toNumber(args.H);
        ctx.clearRect(x, y, w, h);
    }

    loadImage(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const imageId = args.IMAGE_ID;
        let self = this;
        if (!this._bufferedImages[imageId]) {
            return new Promise(resolve => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    this._bufferedImages[imageId] = img;

                    if (self._totalLoadedSize == null) self._totalLoadedSize = 0;
                    self._totalLoadedSize += 128 * 1024;
                    if (self._totalLoadedSize >= 2 * 1024 * 1024) {
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

                    resolve();
                };
                img.onerror = () => {
                    resolve();
                };
                var extUtils = this.runtime.extUtils;
                img.src = extUtils.getAssetFetchUrl(imageId);
            });
        }
    }

    drawImage(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const imageId = Cast.toString(args.IMAGE_ID);
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        if (imageId.length > 10) {
            const img = this._bufferedImages[imageId];
            if (!img) return;
            ctx.drawImage(img, x, y);
        } else {
            var idx = Math.min(Math.max(0, Cast.toNumber(args.IMAGE_ID)), 7);
            var tmpCanvas = this._canvasList[idx];
            if (tmpCanvas) ctx.drawImage(tmpCanvas.canvas, x, y);
        }
    }

    scale(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const scaleW = Cast.toNumber(args.SCALE_W);
        const scaleH = Cast.toNumber(args.SCALE_H);
        ctx.scale(scaleW, scaleH);
    }

    rotate(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const angle = Cast.toNumber(args.ANGLE);
        ctx.rotate(angle);
    }

    translate(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        ctx.translate(x, y);
    }

    transform(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const a = Cast.toNumber(args.A);
        const b = Cast.toNumber(args.B);
        const c = Cast.toNumber(args.C);
        const d = Cast.toNumber(args.D);
        const e = Cast.toNumber(args.E);
        const f = Cast.toNumber(args.F);
        ctx.transform(a, b, c, d, e, f);
    }

    clearTransform(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    save() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.save();
    }

    restore() {
        const ctx = this._getContext();
        if (!ctx) return;
        ctx.restore();
    }

    setGlobalAlpha(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const alpha = Cast.toNumber(args.ALPHA);
        ctx.globalAlpha = alpha;
    }

    setGlobalCompositeOperation(args, util) {
        const ctx = this._getContext();
        if (!ctx) return;
        const compositeOperation = args.CompositeOperation;
        ctx.globalCompositeOperation = compositeOperation;
    }

    switchCanvas(args, util) {
        const number = Math.min(Math.max(0, Cast.toNumber(args.NUMBER)), 7);
        const ctx = this._getContext(number); //使用指定编号获取ctx时会自动设置为当前ctx
    }

    stampOnStage() {
        const ctx = this._getContext();
        if (!ctx) return;

        var imageData = ctx.getImageData(0, 0, 480, 360);
        var skin = this.runtime.renderer._allSkins[this._skinId];
        skin._setTexture(imageData);
        this.runtime.renderer.penStamp(this.runtime.penSkinId, this._drawableId);
        this.runtime.requestRedraw();
    }
}

module.exports = Scratch3CanvasBlocks;
