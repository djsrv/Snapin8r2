/*
    Snapin8r2

    Based on the original Snapin8r by Hardmath123
    Rewritten to (hopefully) work better by djdolphin
*/

(function() {
    'use strict';

    /* Individual translations for blocks and arguments */

    var lib = {};

    lib.blocks = {
        'forward:': 'forward',
        'turnRight:': 'turn',
        'turnLeft:': 'turnLeft',
        'heading:': 'setHeading',
        'pointTowards:': 'doFaceTowards',
        'gotoX:y:': 'gotoXY',
        'gotoSpriteOrMouse:': 'doGotoObject',
        'glideSecs:toX:y:elapsed:from:': 'doGlide',
        'changeXposBy:': 'changeXPosition',
        'xpos:': 'setXPosition',
        'changeYposBy:': 'changeYPosition',
        'ypos:': 'setYPosition',
        bounceOffEdge: 'bounceOffEdge',
        // setRotationStyle: '',
        xpos: 'xPosition',
        ypos: 'yPosition',
        heading: 'direction',
        'say:duration:elapsed:from:': 'doSayFor',
        'say:': 'bubble',
        'think:duration:elapsed:from:': 'doThinkFor',
        'think:': 'doThink',
        show: 'show',
        hide: 'hide',
        'lookLike:': 'doSwitchToCostume',
        nextCostume: 'doWearNextCostume',
        'changeGraphicEffect:by:': 'changeEffect',
        'setGraphicEffect:to:': 'setEffect',
        filterReset: 'clearEffects',
        'changeSizeBy:': 'changeScale',
        'setSizeTo:': 'setScale',
        comeToFront: 'comeToFront',
        'goBackByLayers:': 'goBack',
        costumeIndex: 'getCostumeIdx',
        scale: 'getScale',
        // startSceneAndWait: '',
        'playSound:': 'playSound',
        doPlaySoundAndWait: 'doPlaySoundUntilDone',
        stopAllSounds: 'doStopAllSounds',
        // playDrum: '',
        'rest:elapsed:from:': 'doRest',
        'noteOn:duration:elapsed:from:': 'doPlayNote',
        // 'instrument:': '',
        // 'changeVolumeBy:': '',
        // 'setVolumeTo:': '',
        // volume: '',
        'changeTempoBy:': 'doChangeTempo',
        'setTempoTo:': 'doSetTempo',
        tempo: 'getTempo',
        clearPenTrails: 'clear',
        stampCostume: 'doStamp',
        putPenDown: 'down',
        putPenUp: 'up',
        'penColor:': 'setColor',
        'changePenHueBy:': 'changeHue',
        'setPenHueTo:': 'setHue',
        'changePenShadeBy:': 'changeBrightness',
        'setPenShadeTo:': 'setBrightness',
        'changePenSizeBy:': 'changeSize',
        'penSize:': 'setSize',
        whenGreenFlag: 'receiveGo',
        whenKeyPressed: 'receiveKey',
        // whenSceneStarts: '',
        // whenSensorGreaterThan: '',
        whenIReceive: 'receiveMessage',
        'broadcast:': 'doBroadcast',
        doBroadcastAndWait: 'doBroadcastAndWait',
        'wait:elapsed:from:': 'doWait',
        doRepeat: 'doRepeat',
        doForever: 'doForever',
        doIf: 'doIf',
        doIfElse: 'doIfElse',
        doWaitUntil: 'doWaitUntil',
        doUntil: 'doUntil',
        whenCloned: 'receiveOnClone',
        createCloneOf: 'createClone',
        deleteClone: 'removeClone',
        'touching:': 'reportTouchingObject',
        'touchingColor:': 'reportTouchingColor',
        'color:sees:': 'reportColorIsTouchingColor',
        'distanceTo:': 'reportDistanceTo',
        doAsk: 'doAsk',
        answer: 'getLastAnswer',
        'keyPressed:': 'reportKeyPressed',
        mousePressed: 'reportMouseDown',
        mouseX: 'reportMouseX',
        mouseY: 'reportMouseY',
        // soundLevel: '',
        // senseVideoMotion: '',
        // setVideoState: '',
        // setVideoTransparency: '',
        timer: 'getTimer',
        timerReset: 'doResetTimer',
        'getAttribute:of:': 'reportAttributeOf',
        timeAndDate: 'reportDate',
        // timestamp: '',
        // getUserName: '',
        '+': 'reportSum',
        '-': 'reportDifference',
        '*': 'reportProduct',
        '/': 'reportQuotient',
        'randomFrom:to:': 'reportRandom',
        '<': 'reportLessThan',
        '=': 'reportEquals',
        '>': 'reportGreaterThan',
        '&': 'reportAnd',
        '|': 'reportOr',
        not: 'reportNot',
        'letter:of:': 'reportLetter',
        'stringLength:': 'reportStringSize',
        '%': 'reportModulus',
        rounded: 'reportRound',
        'computeFunction:of:': 'reportMonadic',
        'setVar:to:': 'doSetVar',
        'changeVar:by:': 'doChangeVar',
        'showVariable:': 'doShowVar',
        'hideVariable:': 'doHideVar',
        'append:toList:': 'doAddToList',
        'deleteLine:ofList:': 'doDeleteFromList',
        'insert:at:ofList:': 'doInsertInList',
        'setLine:ofList:to:': 'doReplaceInList',
        'getLine:ofList:': 'reportListItem',
        'lineCountOfList:': 'reportListLength',
        'list:contains:': 'reportListContainsItem',
        'showList:': 'doShowVar',
        'hideList:': 'doHideVar'
    };

    lib.specialCaseBlocks = {};

    lib.specialCaseBlocks.readVariable = function(args) {
        return el('block', {var: args[0]});
    };

    lib.specialCaseBlocks['contentsOfList:'] = function(args) { // temporary workaround
        return el('block', {s: 'reportJoinWords'},
            el('block', {var: args[0]})
        );
    };

    lib.specialCaseBlocks.getParam = function(s, args, obj, customBlock) {
        var param = args[0];
        if (customBlock) param = obj.paramConversions[customBlock][param];
        return el('block', {var: param});
    };

    lib.specialCaseBlocks.call = function(args, obj, customBlock) {
        var spec = convertCustomBlockSpec(args[0]);
        var args = args.slice(1);

        var result = el('custom-block', {s: spec, scope: obj.data.objName});
        for (var i = 0, l = args.length; i < l; i++) {
            result.appendChild(obj.convertArg(args[i], null, null, customBlock));
        }
        return result;
    };

    lib.specialCaseBlocks.startScene = function(args, obj, customBlock) {
        var backdrop = args[0];
        var result;

        if (backdrop === 'next backdrop') {
            result = el('block', {s: 'doWearNextCostume'});
        } else if (backdrop === 'previous backdrop') {
            result = el('block', {s: 'doSwitchToCostume'},
                el('block', {s: 'reportDifference'}, [
                    el('l', null, 0),
                    el('l', null, 1)
                ])
            );
        } else {
            result = el('block', {s: 'doSwitchToCostume'},
                obj.convertArg(backdrop, null, null, customBlock)
            );
        }
        if (!obj.isStage) result = convertBlockForStage(result);
        return result;
    };

    lib.specialCaseBlocks.nextScene = function(args, obj) {
        var result = el('block', {s: 'doWearNextCostume'});
        if (!obj.isStage) result = convertBlockForStage(result);
        return result;
    };

    lib.specialCaseBlocks.sceneName = function(args, obj) {
        return el('block', {s: 'reportAttributeOf'}, [
            el('l', null,
                el('option', null, 'costume name')
            ),
            el('l', null, 'Stage')
        ]);
    };

    lib.specialCaseBlocks.backgroundIndex = function(args, obj) {
        if (obj.isStage) {
            return el('block', {s: 'getCostumeIdx'});
        }
        return el('block', {s: 'reportAttributeOf'}, [
            el('l', null,
                el('option', null, 'costume #')
            ),
            el('l', null, 'Stage')
        ]);
    };

    lib.specialCaseBlocks.whenClicked = function(args) {
        return el('block', {s: 'receiveInteraction'},
            el('l', null,
                el('option', null, 'clicked')
            )
        );
    };

    lib.specialCaseBlocks.stopScripts = function(args, obj, customBlock) {
        var stopThisOptions = ['all', 'this script', 'this block'];
        var stopOthersOptions = ['other scripts in sprite', 'other scripts in stage'];

        var arg = args[0];
        if (customBlock && arg === 'this script') arg = 'this block';
        if (stopThisOptions.indexOf(arg) > -1) {
            return el('block', {s: 'doStopThis'},
                el('l', null,
                    el('option', null, arg)
                )
            );
        }
        if (stopOthersOptions.indexOf(arg) > -1) {
            return el('block', {s: 'doStopOthers'},
                el('l', null,
                    el('option', null, 'other scripts in sprite')
                )
            );
        }

        throw new Error('Unknown stop argument: ' + arg);
    };

    lib.specialCaseBlocks['concatenate:with:'] = function(args, obj, customBlock) {
        return el('block', {s: 'reportJoinWords'},
            el('list', null, [
                obj.convertArg(args[0], null, null, customBlock),
                obj.convertArg(args[1], null, null, customBlock)
            ])
        );
    };

    function convertBlockForStage(block) {
        return el('block', {s: 'doRun'}, [
            el('block', {s: 'reportAttributeOf'}, [
                el('block', {s: 'reifyScript'}, [
                    el('script', null, block),
                    el('list')
                ]),
                el('l', null, 'Stage')
            ]),
            el('list')
        ]);
    }

    lib.customBlockSpecCache = {}; // Cache of converted custom block specs

    // Special argument types

    lib.cArgs = {
        doRepeat: [1],
        doForever: [0],
        doIf: [1],
        doIfElse: [1, 2],
        doUntil: [1]
    };

    lib.listArgs = {
        doAddToList: [1],
        doDeleteFromList: [1],
        doInsertInList: [2],
        doReplaceInList: [1],
        reportListItem: [1],
        reportListLength: [0],
        reportListContainsItem: [0]
    };

    lib.colorArgs = {
        setColor: [0],
        reportTouchingColor: [0],
        reportColorIsTouchingColor: [0, 1]
    };

    lib.optionArgs = {
        receiveKey: [0],
        reportKeyPressed: [0],
        reportDate: [0],
        reportListItem: [0],
        doDeleteFromList: [0],
        doInsertInList: [1],
        doReplaceInList: [0]
    };

    lib.specialCaseArgs = {
        doFaceTowards: {},
        doGotoObject: {},
        changeEffect: {},
        setEffect: {},
        createClone: {},
        reportTouchingObject: {},
        reportDistanceTo: {},
        reportAttributeOf: {},
        reportMonadic: {}
    };

    lib.specialCaseArgs.doFaceTowards[0] =
    lib.specialCaseArgs.doGotoObject[0] =
    lib.specialCaseArgs.reportDistanceTo[0] = function(arg) {
        return handleObjArg(arg, ['_mouse_']);
    };
    lib.specialCaseArgs.createClone[0] = function(arg) {
        return handleObjArg(arg, ['_myself_']);
    };
    lib.specialCaseArgs.reportTouchingObject[0] = function(arg) {
        return handleObjArg(arg, ['_mouse_', '_edge_']);
    };
    lib.specialCaseArgs.reportAttributeOf[1] = function(arg) {
        return handleObjArg(arg, ['_stage_']);
    };

    function handleObjArg(arg, choices) {
        var choiceConversions = {
            _stage_: 'Stage',
            _mouse_: 'mouse-pointer',
            _edge_: 'edge',
            _myself_: 'myself'
        };

        if (choices.indexOf(arg) > -1) {
            return el('l', null,
                el('option', null, choiceConversions[arg])
            );
        }
        return el('l', null, arg);
    }

    lib.specialCaseArgs.changeEffect[0] =
    lib.specialCaseArgs.setEffect[0] = function(arg) {
        if (arg === 'ghost' || arg === 'brightness') {
            return el('l', null,
                el('option', null, arg)
            );
        }
        throw new Error('Unsupported graphic effect: ' + arg);
    };

    lib.specialCaseArgs.reportAttributeOf[0] = function(arg, obj) {
        var options = obj.isStage ? ['costume #', 'costume name'] :
            ['x position', 'y position', 'direction', 'costume #', 'costume name', 'size'];

        if (obj.isStage) {
            if (arg === 'backdrop #' || arg === 'background #') arg = 'costume #';
            if (arg === 'backdrop name') arg = 'costume name';
        }
        if (options.indexOf(arg) > -1) {
            return el('l', null,
                el('option', null, arg)
            );
        }
        if (arg === 'volume') {
            throw new Error('Unsupported attribute: volume');
        }

        return el('l', null, arg);
    };

    lib.specialCaseArgs.reportMonadic[0] = function(arg) {
        var options = [
            'abs', 'floor', 'sqrt', 'sin', 'cos', 'tan',
            'asin', 'acos', 'atan', 'ln', 'e^'
        ];

        if (arg === 'e ^') arg = 'e^';
        if (options.indexOf(arg) > -1) {
            return el('l', null,
                el('option', null, arg)
            );
        }

        throw new Error('Unsupported math function: ' + arg);
    };

    lib.rotationStyles = {
        normal: 1,
        leftRight: 2,
        none: 0
    };

    lib.watchers = {
        costumeIndex: 'getCostumeIdx',
        xpos: 'xPosition',
        ypos: 'yPosition',
        heading: 'direction',
        scale: 'getScale',
        backgroundIndex: 'getCostumeIdx',
        tempo: 'getTempo',
        answer: 'getLastAnswer',
        timer: 'getTimer'
    };

    lib.watcherStyles = {
        1: 'normal',
        2: 'large',
        3: 'slider'
    };

    lib.fonts = {
        '': 'Helvetica',
        Donegal: 'Donegal One',
        Gloria: 'Gloria Hallelujah',
        Marker: 'Permanent Marker',
        Mystery: 'Mystery Quest'
    };

    lib.lineHeights = {
        Helvetica: 1.13,
        'Donegal One': 1.25,
        'Gloria Hallelujah': 1.97,
        'Permanent Marker': 1.43,
        'Mystery Quest': 1.37
    };

    /* Object Conversion */

    // Scriptable (stage and sprites) conversion

    function ScriptableConverter(data, s, isStage, varNames, callback) {
        this.data = data;
        this.s = s;
        this.isStage = isStage;
        this.varNames = varNames.slice(0);
        this.paramConversions = {};
        this.blockComments = [];
        this.lastBlockID = -1;
        this.callback = callback;

        if (!isStage && data.objName === 'Stage') {
            throw new Error('A sprite cannot have the name "Stage"');
        }
    }

    ScriptableConverter.prototype.convert = function() {
        var myself = this;
        var result = this.result = el(this.isStage ? 'stage' : 'sprite');
        var data = this.data;

        result.setAttribute('name', data.objName);

        if (this.isStage) {
            result.setAttribute('width', 480);
            result.setAttribute('height', 360);
        } else {
            result.setAttribute('idx', data.indexInLibrary);
            result.setAttribute('x', data.scratchX);
            result.setAttribute('y', data.scratchY);
            result.setAttribute('heading', data.direction);
            result.setAttribute('scale', data.scale);
            result.setAttribute('rotation', lib.rotationStyles[data.rotationStyle] || 0);
            result.setAttribute('draggable', data.isDraggable);
            if (!data.visible) {
                result.setAttribute('hidden', true);
            }
        }

        result.setAttribute('costume', data.currentCostumeIndex + 1);
        if ('tempoBPM' in data) result.setAttribute('tempo', data.tempoBPM);

        if (this.isStage) {
            result.setAttribute('threadsafe', false);
            result.setAttribute('lines', 'round');
            result.setAttribute('codify', false);
            result.setAttribute('scheduled', true);
            result.appendChild(
                el('pentrails', null, getAsset(data.penLayerID, data.penLayerMD5, this.s.zip))
            );
        } else {
            result.setAttribute('color', '0,0,255');
            result.setAttribute('pen', 'middle');
        }

        this.convertCostumes(function(err) {
            if (err) return myself.callback(err);

            try {
                myself.convertSounds();
                myself.convertVariables();
                myself.convertScripts();
            } catch (err) {
                return myself.callback(err);
            }

            if (myself.isStage) {
                myself.convertChildren(function(err) {
                    if (err) myself.callback(err);
                    else myself.callback(null, myself.result);
                });
            } else {
                myself.callback(null, myself.result);
            }
        });
    };

    ScriptableConverter.prototype.convertCostumes = function(callback) {
        var myself = this;
        var costumes = this.data.costumes;
        var result = el('list');

        if (costumes) {
            AsyncLoop.loop(
                costumes.length,
                function(loop) {
                    var costume = costumes[loop.index];
                    myself.convertCostume(
                        costume,
                        function(err, costume) {
                            if (err) {
                                callback(err);
                            } else {
                                result.appendChild(el('item', null, costume));
                                loop.next();
                            }
                        }
                    );
                },
                function() {
                    myself.result.appendChild(el('costumes', null, result));
                    callback();
                }
            );
        }
    };

    ScriptableConverter.prototype.convertCostume = function(costume, callback) {
        var myself = this;
        var resolution = costume.bitmapResolution;

        try {
            var image = getAsset(costume.baseLayerID, costume.baseLayerMD5, this.s.zip);
            if (resolution === 1) {
                if ('text' in costume) {
                    console.log(costume.textLayerID);
                    var text = getAsset(costume.textLayerID, costume.textLayerMD5, this.s.zip);
                    addTextLayer(image, text, createXML);           
                } else {
                    createXML(image);
                }
            } else {
                resizeImage(image, 1 / resolution, createXML);
            }
        } catch (err) {
            callback(err);
        }

        function createXML(image) {
            var result = el('costume');
            result.setAttribute('name', costume.costumeName);
            result.setAttribute('center-x', costume.rotationCenterX / resolution);
            result.setAttribute('center-y', costume.rotationCenterY / resolution);
            result.setAttribute('image', image);
            callback(null, result);
        }
    };

    ScriptableConverter.prototype.convertSounds = function() {
        var sounds = this.data.sounds;
        var result = el('list');
        if (sounds) {
            for (var i = 0, l = sounds.length; i < l; i++) {
                result.appendChild(el('item', null, this.convertSound(sounds[i])));
            }
        }
        this.result.appendChild(el('sounds', null, result));
    };

    ScriptableConverter.prototype.convertSound = function(sound) {
        var result = el('sound');
        result.setAttribute('name', sound.soundName);
        result.setAttribute('sound', getAsset(sound.soundID, sound.md5, this.s.zip));
        return result;
    };

    ScriptableConverter.prototype.convertVariables = function() {
        var vars = el('variables');
        if (!this.isStage && ('variables' in this.data || 'lists' in this.data)) {
            vars = convertVariables(this.data, this.varNames);
        }
        this.result.appendChild(vars);
    };

    ScriptableConverter.prototype.convertScripts = function() {
        var commentsData = this.data.scriptComments;
        var scriptsData = this.data.scripts;
        var blocks = el('blocks');
        var scripts = el('scripts');

        if (commentsData) {
            for (var i = 0, l = commentsData.length; i < l; i++) {
                var comment = commentsData[i];
                var blockID = comment[5];
                if (blockID > -1) {
                    this.blockComments[blockID] = convertComment(comment);
                } else {
                    scripts.appendChild(convertComment(comment));
                }
            }
        }
        if (scriptsData) {
            for (var i = 0, l = scriptsData.length; i < l; i++) {
                var script = scriptsData[i];
                if (script[2][0][0] === 'procDef') { // custom block
                    blocks.appendChild(this.convertCustomBlock(script[2]));
                } else {
                    scripts.appendChild(this.convertScript(script));
                }
            }
        }

        this.result.appendChild(blocks);
        this.result.appendChild(scripts);
    };

    ScriptableConverter.prototype.convertChildren = function(callback) {
        var myself = this;
        var children = this.data.children;
        var result = el('sprites');

        AsyncLoop.loop(
            children.length,
            function(loop) {
                var child = children[loop.index];
                if ('objName' in child) { // sprite
                    ScriptableConverter.convert(
                        child, myself.s, false, myself.varNames,
                        function(err, sprite) {
                            if (err) {
                                callback(err);
                            } else {
                                result.appendChild(sprite);
                                loop.next();
                            }
                        }
                    );
                } else {
                    if ('sliderMin' in child) { // watcher
                        result.appendChild(convertWatcher(child));
                    }
                    loop.next();
                }
            },
            function() {
                convertListWatchers(myself.data);
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i];
                    if ('objName' in child) convertListWatchers(child);
                }
                myself.result.appendChild(result);
                callback();
            }
        );

        function convertListWatchers(data) {
            if ('lists' in data) {
                for (var i = 0, l = data.lists.length; i < l; i++) {
                    result.appendChild(convertListWatcher(data.lists[i], data.objName));
                }
            }
        }
    };

    // Script, block, and argument conversion

    ScriptableConverter.prototype.convertScript = function(script, ignoreCoords, customBlock) {
        var result = el('script');

        if (script) {
            if (!ignoreCoords) {
                result.setAttribute('x', script[0]);
                result.setAttribute('y', script[1]);
                var blocks = script[2];
            } else {
                var blocks = script;
            }
            for (var i = 0, l = blocks.length; i < l; i++) {
                result.appendChild(this.convertBlock(blocks[i], customBlock));
            }
        }

        return result;
    }

    ScriptableConverter.prototype.convertBlock = function(block, customBlock) {
        var blockID = ++this.lastBlockID;
        var spec = block[0];
        var args = block.slice(1);

        if (lib.blocks.hasOwnProperty(spec)) {
            spec = lib.blocks[spec];
            var result = el('block', {s: spec});
            for (var i = 0, l = args.length; i < l; i++) {
                result.appendChild(this.convertArg(args[i], spec, i, customBlock));
            }
        } else if (lib.specialCaseBlocks.hasOwnProperty(spec)) {
            var result = lib.specialCaseBlocks[spec](args, this, customBlock);
        } else {
            throw new Error('Unknown spec: ' + spec);
        }
        if (this.blockComments[blockID]) {
            result.appendChild(this.blockComments[blockID]);
        }

        return result;
    }

    ScriptableConverter.prototype.convertArg = function(arg, spec, i, customBlock) {
        if (arg === null) return el('l');
        if (spec) {
            if (lib.cArgs[spec] && lib.cArgs[spec].indexOf(i) > -1) { // C input
                return this.convertScript(arg, true, customBlock);
            }
            if (arg instanceof Array) { // reporter
                return this.convertBlock(arg, customBlock);
            }
            if (lib.listArgs[spec] && lib.listArgs[spec].indexOf(i) > -1) { // list input
                return el('block', {var: arg});
            }
            if (lib.colorArgs[spec] && lib.colorArgs[spec].indexOf(i) > -1) { // color input
                return el('color', null, convertColor(arg));
            }
            if (lib.optionArgs[spec] && lib.optionArgs[spec].indexOf(i) > -1 && !(typeof arg === 'number')) {
                // option input
                return el('l', null,
                    el('option', null, arg)
                );
            }
            if (lib.specialCaseArgs[spec] && lib.specialCaseArgs[spec][i]) { // special case
                return lib.specialCaseArgs[spec][i](arg, this);
            }
        }
        return el('l', null, arg);// regular input
    }

    // Custom block conversion

    ScriptableConverter.prototype.convertCustomBlock = function(blocks) {
        var blockID = ++this.lastBlockID;
        var definition = blocks[0];
        var spec = convertCustomBlockSpec(definition[1]);
        var oldArgNames = definition[2];
        var defaultArgValues = definition[3];
        var atomic = definition[4];

        var paramConversions = this.paramConversions[spec] = {};
        var varNames = this.varNames.slice(0);
        var argNames = [];

        for (var i = 0, l = oldArgNames.length; i < l; i++) {
            var oldArgName = oldArgNames[i];
            var newArgName = unusedName(oldArgName.replace(/'/g, ''), varNames);
            varNames.push(newArgName);
            argNames.push(newArgName);
            paramConversions[oldArgName] = newArgName;
        }

        var specParts = spec.split(' ');
        var spec2 = '';
        var inputs = el('inputs');
        var argIndex = -1;

        for (i = 0, l = specParts.length; i < l; i++) {
            var part = specParts[i];
            if (i !== 0) spec2 += ' ';
            if (part.charAt(0) !== '%') {
                spec2 += part;
            } else {
                argIndex += 1;
                spec2 += "%'" + argNames[argIndex] + "'";
                inputs.appendChild(
                    el('input', {type: part}, defaultArgValues[argIndex])
                );
            }
        }

        this.lastBlockID += argNames.length + 1; // accounts for a bug in Scratch
        var script = this.convertScript(blocks.slice(1), true, spec);
        if (atomic) {
            script = el('script', null,
                el('block', {s: 'doWarp'}, script)
            );
        }

        var result = el('block-definition');
        result.setAttribute('s', spec2);
        result.setAttribute('type', 'command');
        result.setAttribute('category', 'other');
        if (this.blockComments[blockID]) {
            result.appendChild(this.blockComments[blockID]);
        }
        result.appendChild(el('header'));
        result.appendChild(el('code'));
        result.appendChild(inputs);
        result.appendChild(script);
        return result;
    }

    ScriptableConverter.convert = function(data, s, isStage, varNames, callback) {
        try {
            var converter = new ScriptableConverter(data, s, isStage, varNames, callback);
            converter.convert();
        } catch (err) {
            callback(err);
        }
    };

    // Variable and list conversion

    function convertVariables(data, varNames) {
        var variables = data.variables;
        var lists = data.lists;
        var result = el('variables');

        if (variables) {
            for (var i = 0, l = variables.length; i < l; i++) {
                var variable = variables[i];
                varNames.push(variable.name);
                result.appendChild(
                    el('variable', {name: variable.name},
                        el('l', null, variable.value)
                    )
                );
            }
        }
        if (lists) {
            for (i = 0, l = lists.length; i < l; i++) {
                var list = lists[i];
                varNames.push(list.listName);
                var listXML = el('list');
                for (var j = 0, k = list.contents.length; j < k; j++) {
                    listXML.appendChild(
                        el('item', null,
                            el('l', null, list.contents[j])
                        )
                    );
                }
                result.appendChild(el('variable', {name: list.listName}, listXML));
            }
        }

        return result;
    }

    function convertWatcher(watcher) {
        var result = el('watcher');

        if (watcher.cmd === 'getVar:') {
            if (!watcher.target === 'Stage') {
                result.setAttribute('scope', watcher.target);
            }
            result.setAttribute('var', watcher.param);
        } else {
            result.setAttribute('scope', watcher.target);
            var spec = lib.watchers[watcher.cmd];
            if (!spec) throw new Error('Unsupported watcher: ' + watcher.cmd);
            result.setAttribute('s', spec);
        }

        var mode = lib.watcherStyles[watcher.mode] || 'normal';
        result.setAttribute('style', mode);
        if (mode === 'slider') {
            result.setAttribute('min', watcher.sliderMin);
            result.setAttribute('max', watcher.sliderMax);
        }

        result.setAttribute('x', watcher.x);
        result.setAttribute('y', watcher.y);
        result.setAttribute('color', convertColor(watcher.color));
        if (!watcher.visible) result.setAttribute('hidden', true);

        return result;
    }

    function convertListWatcher(list, objName) {
        var result = el('watcher');

        if (objName !== 'Stage') result.setAttribute('scope', objName);
        result.setAttribute('var', list.listName);
        result.setAttribute('style', 'normal');
        result.setAttribute('x', list.x);
        result.setAttribute('y', list.y);
        result.setAttribute('color', '243,118,29');
        result.setAttribute('extX', list.width);
        result.setAttribute('extY', list.height);
        if (!list.visible) result.setAttribute('hidden', true);

        return result;
    }

    // Comment conversion

    function convertComment(data) {
        var x = data[0];
        var y = data[1];
        var width = data[2];
        var open = data[4];
        var blockID = data[5];
        var text = data[6];
        var result = el('comment');

        if (blockID === -1) {
            result.setAttribute('x', x);
            result.setAttribute('y', y);
        }
        result.setAttribute('w', width);
        result.setAttribute('collapsed', !open);
        result.textContent = text;

        return result;
    }

    /* Various Utilities */

    // Loop for async functions

    function AsyncLoop(iterations, func, callback) {
        this.index = -1;
        this.done = false;
        this.iterations = iterations;
        this.func = func;
        this.callback = callback;
    }

    AsyncLoop.prototype.next = function() {
        if (this.done) return;
        this.index += 1;
        if (this.index < this.iterations) {
            this.func(this);
        } else {
            this.done = true;
            this.callback();
        }
    };

    AsyncLoop.loop = function(iterations, func, callback) {
        new AsyncLoop(iterations, func, callback).next();
    };

    // Utilities for dealing with assets

    function getAsset(id, md5, zip) {
        var mimeTypes = {
            svg: 'image/svg+xml',
            png: 'image/png',
            wav: 'audio/x-wav'
        };

        var ext = md5.slice(md5.lastIndexOf('.') + 1);
        var file = zip.file(id + '.' + ext);
        if (!file) throw new Error(fileName + ' does not exist');
        if (ext === 'svg') {
            var div = document.createElement('div');
            div.style.visibility = 'hidden';
            div.style.position = 'absolute';
            div.style.left = '-1000000px';
            div.style.top = '-1000000px';
            div.innerHTML = file.asText();
            document.body.appendChild(div);
            var svg = div.getElementsByTagName('svg')[0];
            fixSVG(svg);
            var string = svg.outerHTML;
            document.body.removeChild(div);
        } else {
            file = file.asUint8Array();
            var string = '';
            for (var i = 0, l = file.length; i < l; i++) {
                string += String.fromCharCode(file[i]);
            }
        }
        var mimeType = mimeTypes[ext];
        if (!mimeType) throw new Error('Unrecognized asset file type: ' + ext);
        return 'data:' + mimeType + ';base64,' + btoa(string);
    }

    function resizeImage(data, scale, callback) {
        var image = new Image();
        image.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled =
            ctx.webkitImageSmoothingEnabled =
            ctx.mozImageSmoothingEnabled =
            ctx.msImageSmoothingEnabled = false;
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            ctx.drawImage(image, 0, 0, image.width, image.height,
                0, 0, image.width * scale, image.height * scale);
            callback(canvas.toDataURL());
        };
        image.src = data;
    }

    function addTextLayer(imageData, textData, callback) {
        var image = new Image();
        image.onload = function() {
            var text = new Image();
            text.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                ctx.drawImage(text, 0, 0);
                callback(canvas.toDataURL());
            };
            text.src = textData;
        };
        image.src = imageData;
    }

    function fixSVG(element) { // from phosphorus by Nathan Dinsmore
        if (element.nodeType !== 1) return;
        if (element.nodeName === 'text') {
            var font = element.getAttribute('font-family') || '';
            font = lib.fonts[font] || font;
            if (font) {
                element.setAttribute('font-family', font);
                if (font === 'Helvetica') element.style.fontWeight = 'bold';
            }
            var size = +element.getAttribute('font-size');
            if (!size) {
                element.setAttribute('font-size', size = 18);
            }
            var bb = element.getBBox();
            var x = 4 - 0.6 * element.transform.baseVal.consolidate().matrix.a;
            var y = (element.getAttribute('y') - bb.y) * 1.1;
            element.setAttribute('x', x);
            element.setAttribute('y', y);
            var lines = element.textContent.split('\n');
            if (lines.length > 1) {
                element.textContent = lines[0];
                var lineHeight = lib.lineHeights[font] || 1;
                for (var i = 1, l = lines.length; i < l; i++) {
                    var tspan = el('tspan');
                    tspan.textContent = lines[i];
                    tspan.setAttribute('x', x);
                    tspan.setAttribute('y', y + size * i * lineHeight);
                    element.appendChild(tspan);
                }
            }
        } else if ((element.hasAttribute('x') || element.hasAttribute('y')) && element.hasAttribute('transform')) {
            element.setAttribute('x', 0);
            element.setAttribute('y', 0);
        }

        for (var i = 0, l = element.children.length; i < l; i++) {
            fixSVG(element.children[i]);
        }
    };

    // Random utilities

    function el(tagName, attribs, content) {
        var el = document.createElementNS(null, tagName);
        if (attribs) {
            for (var key in attribs) {
                if (attribs.hasOwnProperty(key)) {
                    el.setAttribute(key, attribs[key]);
                }
            }
        }
        if (content) {
            if (!(content instanceof Array)) content = [content];
            for (var i = 0, l = content.length; i < l; i++) {
                var c = content[i];
                el.appendChild(c instanceof Node ? c : new Text(c));
            }
        }
        return el;
    };

    function convertCustomBlockSpec(spec) {
        var args = ['s', 'n', 'b'];

        if (lib.customBlockSpecCache.hasOwnProperty(spec)) {
            return lib.customBlockSpecCache[spec];
        }

        var result = spec.split(' ');
        result.map(function(part) {
            if (part.charAt(0) === '%') { // argument
                if (args.indexOf(part.slice(1)) > -1) return part;
                throw new Error('Invalid custom block argument type: ' + part);
            }
            return part.replace(/\\(.)/g, '$1').replace(/^[\\%$]/, '\\$&');
        });
        return result.join(' ');
    }

    function unusedName(name, used) {
        if (used.indexOf(name) === -1) return name;

        var numberIndex = name.search(/\d+$/),
            prefix, number;
        if (numberIndex > -1) {
            prefix = name.substring(0, numberIndex - 1);
            number = +name.slice(numberIndex);
        } else {
            prefix = name;
            number = 1;
        }
        while (used.indexOf(name) > -1) {
            number += 1;
            name = prefix + number;
        }
        return name;
    }

    function convertColor(color) {
        var r = (color >> 16) & 0xff,
            g = (color >> 8) & 0xff,
            b = color & 0xff,
            a = (color >> 24) & 0xff;
        var result = r + ',' + g + ',' + b;
        if (a > 0 && a < 255) result += ',' + a;
        return result;
    }

    function Snapin8r(file, projectName, callback) {
        this.file = file;
        this.zip = null;
        this.projectName = projectName;
        this.callback = callback;
    }

    Snapin8r.prototype.convert = function() {
        var myself = this;

        try {
            this.zip = new JSZip(this.file);
            var jsonData = JSON.parse(this.zip.file('project.json').asText());
        } catch (err) {
            return callback(err);
        }

        var project = el('project');
        project.setAttribute('name', this.projectName);
        project.setAttribute('app', 'Snapin8r2');
        project.setAttribute('version', 1);
        project.appendChild(el('notes', null, 'Converted by Snapin8r2.'));
        project.appendChild(el('thumbnail'));

        var vars = el('variables');
        var varNames = [];
        if ('variables' in jsonData || 'lists' in jsonData) {
            vars = convertVariables(jsonData, varNames);
        }

        ScriptableConverter.convert(
            jsonData, this, true, varNames,
            function(err, stage) {
                if (err) {
                    myself.callback(err);
                } else {
                    project.appendChild(stage);
                    project.appendChild(el('hidden'));
                    project.appendChild(el('headers'));
                    project.appendChild(el('code'));
                    project.appendChild(el('blocks'));
                    project.appendChild(vars);
                    myself.callback(null, project.outerHTML);
                }
            }
        );
    };

    /* Actual exported function */

    window.Snapin8r = function(file, projectName, callback) {
        new Snapin8r(file, projectName, callback).convert();
    };
})();