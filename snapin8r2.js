/*
    Snapin8r2

    Based on the original Snapin8r by Hardmath123
    Rewritten to (hopefully) work better by djdolphin
*/

/* jshint bitwise: false, unused: true */
/* globals JSZip */

(function () {
    'use strict';

    /* Main Snapin8r object */

    function Snapin8r (file, projectName, callback) {
        this.file = file;
        this.zip = null;
        this.projectName = projectName;
        this.callback = callback;
        this.warnings = [];
    }

    Snapin8r.prototype.convert = function () {
        var myself = this;
      	var jsonData;

        try {
            this.zip = new JSZip(this.file);
           	jsonData = JSON.parse(this.zip.file('project.json').asText());
        } catch (err) {
            return this.callback(err);
        }

        // Project info
        var project = el('project');
        project.setAttribute('name', this.projectName);
        project.setAttribute('app', 'Snapin8r2');
        project.setAttribute('version', 1);
        project.appendChild(el('notes', null, 'Converted by Snapin8r2.'));
        project.appendChild(el('thumbnail'));

        // Global variables
        var vars = el('variables');
        var varNames = [];
        if ('variables' in jsonData || 'lists' in jsonData) {
            vars = convertVariables(jsonData, varNames);
        }

        // Convert the stage
        ScriptableConverter.convert(
            jsonData, this, true, varNames,
            function (err, stage) {
                if (err) return myself.callback(err);

                project.appendChild(stage);
                project.appendChild(el('hidden'));
                project.appendChild(el('headers'));
                project.appendChild(el('code'));
                project.appendChild(el('blocks'));
                project.appendChild(vars);

                myself.callback(
                  null,
                  project.outerHTML,
                  myself.warnings.length > 0 ? myself.warnings : null
                );
            }
        );
    };

    Snapin8r.prototype.warn = function (warning) {
        this.warnings.push(warning);
    };

    /* Actual exported function */

    window.Snapin8r = function (file, projectName, callback) {
        new Snapin8r(file, projectName, callback).convert();
    };

    /* Individual translations for blocks, arguments, and other things */

    var lib = {};

    // Regular blocks

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

    // Specially handled blocks

    lib.specialCaseBlocks = {};

    lib.specialCaseBlocks.readVariable = function (args) {
        return el('block', {var: args[0]});
    };

    lib.specialCaseBlocks['contentsOfList:'] = function (args) { // temporary workaround
        return el('block', {s: 'reportJoinWords'},
            el('block', {var: args[0]})
        );
    };

    lib.specialCaseBlocks.getParam = function (args, obj, customBlock) {
        var param = args[0];
        if (customBlock) {
            param = obj.paramConversions[customBlock][param];
        }
        return el('block', {var: param});
    };

    lib.specialCaseBlocks.call = function (args, obj, customBlock) {
        var spec = convertCustomBlockSpec(args[0]);
        args = args.slice(1);
        var result = el('custom-block', {s: spec, scope: obj.data.objName});
        for (var i = 0, l = args.length; i < l; i++) {
            result.appendChild(obj.convertArg(args[i], null, null, customBlock));
        }
        return result;
    };

    lib.specialCaseBlocks.startScene = function (args, obj, customBlock) {
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

    lib.specialCaseBlocks.nextScene = function (args, obj) {
        var result = el('block', {s: 'doWearNextCostume'});
        if (!obj.isStage) result = convertBlockForStage(result);
        return result;
    };

    lib.specialCaseBlocks.sceneName = function () {
        return el('block', {s: 'reportAttributeOf'}, [
            el('l', null,
                el('option', null, 'costume name')
            ),
            el('l', null, 'Stage')
        ]);
    };

    lib.specialCaseBlocks.backgroundIndex = function (args, obj) {
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

    lib.specialCaseBlocks.whenClicked = function () {
        return el('block', {s: 'receiveInteraction'},
            el('l', null,
                el('option', null, 'pressed')
            )
        );
    };

    lib.specialCaseBlocks.stopScripts = function (args, obj, customBlock) {
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
        obj.s.warn('Unknown stop argument: ' + arg);
        return null;
    };

    lib.specialCaseBlocks['concatenate:with:'] = function (args, obj, customBlock) {
        return el('block', {s: 'reportJoinWords'},
            el('list', null, [
                obj.convertArg(args[0], null, null, customBlock),
                obj.convertArg(args[1], null, null, customBlock)
            ])
        );
    };

    function convertBlockForStage (block) {
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
        reportDate: [0],
        doDeleteFromList: [0]
    };

    lib.specialCaseArgs = {
        doFaceTowards: {},
        doGotoObject: {},
        changeEffect: {},
        setEffect: {},
        receiveKey: {},
        createClone: {},
        reportTouchingObject: {},
        reportDistanceTo: {},
        reportKeyPressed: {},
        reportAttributeOf: {},
        reportMonadic: {},
        reportListItem: {},
        doInsertInList: {},
        doReplaceInList: {}
    };

    lib.specialCaseArgs.doFaceTowards[0] =
    lib.specialCaseArgs.doGotoObject[0] =
    lib.specialCaseArgs.reportDistanceTo[0] = function (arg) {
        return handleObjArg(arg, ['_mouse_']);
    };
    lib.specialCaseArgs.createClone[0] = function (arg) {
        return handleObjArg(arg, ['_myself_']);
    };
    lib.specialCaseArgs.reportTouchingObject[0] = function (arg) {
        return handleObjArg(arg, ['_mouse_', '_edge_']);
    };
    lib.specialCaseArgs.reportAttributeOf[1] = function (arg) {
        return handleObjArg(arg, ['_stage_']);
    };

    function handleObjArg (arg, choices) {
        if (choices.indexOf(arg) > -1) {
            return el('l', null,
                el('option', null, lib.specialObjNames[arg])
            );
        }
        return el('l', null, arg);
    }

    lib.specialCaseArgs.changeEffect[0] =
    lib.specialCaseArgs.setEffect[0] = function (arg, obj) {
        if (arg === 'ghost' || arg === 'brightness') {
            return el('l', null,
                el('option', null, arg)
            );
        }
        obj.s.warn('Unsupported graphic effect: ' + arg);
        return null;
    };

    lib.specialCaseArgs.receiveKey[0] =
    lib.specialCaseArgs.reportKeyPressed[0] = function (arg) {
      if (arg === 'any') arg = 'any key';
      return el('l', null,
          el('option', null, arg)
      );
    };

    lib.specialCaseArgs.reportAttributeOf[0] = function (arg, obj) {
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
            obj.s.warn('Unsupported attribute: volume');
            return null;
        }
        return el('l', null, arg);
    };

    lib.specialCaseArgs.reportMonadic[0] = function (arg) {
        arg = arg.replace(/ \^$/, '^');
        return el('l', null,
            el('option', null, arg)
        );
    };

    lib.specialCaseArgs.reportListItem[0] =
    lib.specialCaseArgs.doInsertInList[1] =
    lib.specialCaseArgs.doReplaceInList[0] = function (arg) {
        if (arg === 'random' || arg === 'any') {
            return el('l', null,
                el('option', null, 'any')
            );
        }
        return el('l', null, arg);
    };

    // Other things

    lib.specialObjNames = {
        _edge_: 'edge',
        _mouse_: 'mouse-pointer',
        _myself_: 'myself',
        _stage_: 'Stage'
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

    lib.mimeTypes = {
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        wav: 'audio/x-wav',
        mp3: 'audio/mpeg'
    };

    /* Stage and sprite conversion */

    function ScriptableConverter (data, s, isStage, varNames, callback) {
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

    ScriptableConverter.prototype.convert = function () {
        var myself = this;
        var result = this.result = el(this.isStage ? 'stage' : 'sprite');
        var data = this.data;

        // Attributes are in the order they appear in Snap! XML files.

        result.setAttribute('name', data.objName);

        if (this.isStage) { // Stage-only
            result.setAttribute('width', 480);
            result.setAttribute('height', 360);
        } else { // sprite-only
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
        if ('tempoBPM' in data) {
            result.setAttribute('tempo', data.tempoBPM);
        }

        if (this.isStage) { // Stage-only
            result.setAttribute('threadsafe', false);
            result.setAttribute('lines', 'round');
            result.setAttribute('codify', false);
            result.setAttribute('scheduled', true);
            result.appendChild(
                el('pentrails', null, getAsset(data.penLayerID, data.penLayerMD5, this.s.zip))
            );
        } else { // sprite-only
            result.setAttribute('color', '0,0,255'); // Scratch's default pen color
            result.setAttribute('pen', 'middle');
        }

        // Convert media, variables, and scripts
        this.convertCostumes(function (err) {
            if (err) return myself.callback(err);

            try {
                myself.convertSounds();
                myself.convertVariables();
                myself.convertScripts();
            } catch (error) {
                return myself.callback(error);
            }

            if (myself.isStage) {
                // Convert sprites and watchers
                myself.convertChildren(function (err) {
                    if (err) myself.callback(err);
                    else myself.callback(null, myself.result);
                });
            } else {
                myself.callback(null, myself.result);
            }
        });
    };

    // Costume conversion

    ScriptableConverter.prototype.convertCostumes = function (callback) {
        var myself = this;
        var costumes = this.data.costumes;
        var result = el('list');
        if (costumes) {
            AsyncLoop.loop(
                costumes.length,
                function (loop) {
                    var costume = costumes[loop.index];
                    myself.convertCostume(
                        costume,
                        function (err, costume) {
                            if (err) return callback(err);
                            result.appendChild(el('item', null, costume));
                            loop.next();
                        }
                    );
                },
                function () {
                    myself.result.appendChild(el('costumes', null, result));
                    callback();
                }
            );
        }
    };

    ScriptableConverter.prototype.convertCostume = function (costume, callback) {
        var resolution = costume.bitmapResolution;

        try {
            var image = getAsset(costume.baseLayerID, costume.baseLayerMD5, this.s.zip);
            if (resolution === 1) {
                if ('text' in costume) {
                    // Text in costumes converted from Scratch 1.4 is stored in
                    // a separate layer.
                    var text = getAsset(costume.textLayerID, costume.textLayerMD5, this.s.zip);
                    addTextLayer(image, text, createXML);
                } else {
                    createXML(image);
                }
            } else {
                // Scratch stores bitmap images at double the actual size.
                resizeImage(image, 1 / resolution, createXML);
            }
        } catch (err) {
            callback(err);
        }

        function createXML (image) {
            var result = el('costume');
            result.setAttribute('name', costume.costumeName);
            result.setAttribute('center-x', costume.rotationCenterX / resolution);
            result.setAttribute('center-y', costume.rotationCenterY / resolution);
            result.setAttribute('image', image);
            callback(null, result);
        }
    };

    // Sound conversion

    ScriptableConverter.prototype.convertSounds = function () {
        var sounds = this.data.sounds;
        var result = el('list');
        if (sounds) {
            for (var i = 0, l = sounds.length; i < l; i++) {
                result.appendChild(el('item', null, this.convertSound(sounds[i])));
            }
        }
        this.result.appendChild(el('sounds', null, result));
    };

    ScriptableConverter.prototype.convertSound = function (sound) {
        var result = el('sound');
        result.setAttribute('name', sound.soundName);
        result.setAttribute('sound', getAsset(sound.soundID, sound.md5, this.s.zip));
        return result;
    };

    ScriptableConverter.prototype.convertVariables = function () {
        var vars = el('variables');
        if (!this.isStage && ('variables' in this.data || 'lists' in this.data)) {
            vars = convertVariables(this.data, this.varNames);
        }
        this.result.appendChild(vars);
    };

    // Separate and convert scripts, custom blocks, and comments

    ScriptableConverter.prototype.convertScripts = function () {
        var commentsData = this.data.scriptComments;
        var scriptsData = this.data.scripts;
        var blocks = el('blocks');
        var scripts = el('scripts');
      	var i, l;
        if (commentsData) {
            for (i = 0, l = commentsData.length; i < l; i++) {
                var comment = commentsData[i];
                // Comments attached to blocks are sorted out and added to the
                // correct blocks later.
                var blockID = comment[5];
                if (blockID > -1) {
                    this.blockComments[blockID] = convertComment(comment);
                } else {
                    scripts.appendChild(convertComment(comment));
                }
            }
        }
        if (scriptsData) {
            for (i = 0, l = scriptsData.length; i < l; i++) {
                var scriptData = scriptsData[i];
                if (scriptData[2][0][0] === 'procDef') { // custom block definition
                    blocks.appendChild(this.convertCustomBlock(scriptData[2]));
                } else {
                    var script = this.convertScript(scriptData);
                    if (script) scripts.appendChild(script);
                }
            }
        }
        this.result.appendChild(blocks);
        this.result.appendChild(scripts);
    };

    // Convert sprites and watchers

    ScriptableConverter.prototype.convertChildren = function (callback) {
        var myself = this;
        var children = this.data.children;
        var result = el('sprites');

        AsyncLoop.loop(
            children.length,
            function (loop) {
                var child = children[loop.index];
                if ('objName' in child) { // sprite
                    ScriptableConverter.convert(
                        child, myself.s, false, myself.varNames,
                        function (err, sprite) {
                            if (err) return callback(err);
                            result.appendChild(sprite);
                            loop.next();
                        }
                    );
                } else {
                    if ('sliderMin' in child) { // watcher
                        var watcher = convertWatcher(child, myself.s);
                        if (watcher) result.appendChild(watcher);
                    }
                    loop.next();
                }
            },
            function () {
                convertListWatchers(myself.data);
                for (var i = 0, l = children.length; i < l; i++) {
                    var child = children[i];
                    if ('objName' in child) convertListWatchers(child);
                }
                myself.result.appendChild(result);
                callback();
            }
        );

        function convertListWatchers (data) {
            if ('lists' in data) {
                for (var i = 0, l = data.lists.length; i < l; i++) {
                    result.appendChild(convertListWatcher(data.lists[i], data.objName));
                }
            }
        }
    };

    // Script, block, and argument conversion

    ScriptableConverter.prototype.convertScript = function (script, embedded, customBlock) {
        var result = el('script');
        var blocks;
        if (script) {
            if (!embedded) {
                result.setAttribute('x', script[0]);
                result.setAttribute('y', script[1]);
                blocks = script[2];
            } else {
                blocks = script;
            }
            for (var i = 0, l = blocks.length; i < l; i++) {
                var block = this.convertBlock(blocks[i], customBlock);
                if (block) result.appendChild(block);
            }
        }
        if (!embedded && result.children.length === 0) return null;
        return result;
    };

    ScriptableConverter.prototype.convertBlock = function (block, customBlock) {
        this.lastBlockID += 1
        var blockID = this.lastBlockID;
        var selector = block[0];
        var args = block.slice(1);
        var result;
        if (lib.blocks[selector]) {
            selector = lib.blocks[selector];
            result = el('block', {s: selector});
            for (var i = 0, l = args.length; i < l; i++) {
                var arg = this.convertArg(args[i], selector, i, customBlock);
                if (arg) result.appendChild(arg);
                else return null;
            }
        } else if (lib.specialCaseBlocks[selector]) {
            result = lib.specialCaseBlocks[selector](args, this, customBlock);
        } else {
            this.s.warn('Unknown selector: ' + selector);
            return null;
        }
        if (this.blockComments[blockID]) {
            result.appendChild(this.blockComments[blockID]);
        }
        return result;
    };

    ScriptableConverter.prototype.convertArg = function (arg, selector, index, customBlock) {
        if (selector && lib.cArgs[selector] && lib.cArgs[selector].indexOf(index) > -1) { // C input
            return this.convertScript(arg, true, customBlock);
        }
        if (arg.constructor === Array) { // reporter
            return this.convertBlock(arg, customBlock) || el('l');
        }
        if (selector) {
            if (lib.listArgs[selector] && lib.listArgs[selector].indexOf(index) > -1) { // list input
                return el('block', {var: arg});
            }
            if (lib.colorArgs[selector] && lib.colorArgs[selector].indexOf(index) > -1) { // color input
                return el('color', null, convertColor(arg));
            }
            if (lib.optionArgs[selector] && lib.optionArgs[selector].indexOf(index) > -1 && typeof arg !== 'number') {
                // option input
                return el('l', null,
                    el('option', null, arg)
                );
            }
            if (lib.specialCaseArgs[selector] && lib.specialCaseArgs[selector][index]) { // special case
                return lib.specialCaseArgs[selector][index](arg, this);
            }
        }
        return el('l', null, arg); // regular input
    };

    // Custom block definition conversion

    ScriptableConverter.prototype.convertCustomBlock = function (blocks) {
        this.lastBlockID += 1
        var blockID = this.lastBlockID;
        var definition = blocks[0];
        var spec = convertCustomBlockSpec(definition[1]);
        var oldParamNames = definition[2];
        var defaultArgs = definition[3];
        var atomic = definition[4];

        // Snap! doesn't differentiate between parameters and variables, so
        // numbers are added to the end of parameters with the same names as
        // variables. Snap! also doesn't allow ' in parameter names. :'(

        var paramConversions = this.paramConversions[spec] = {};
        var varNames = this.varNames.slice(0);
        var paramNames = [];

        for (var i = 0, l = oldParamNames.length; i < l; i++) {
            var oldParam = oldParamNames[i];
            var newParam = unusedName(oldParam.replace(/'/g, ''), varNames);
            varNames.push(newParam);
            paramNames.push(newParam);
            paramConversions[oldParam] = newParam;
        }

        var specParts = spec.split(' ');
        var spec2 = '';
        var inputs = el('inputs');
        var inputIndex = -1;

        for (i = 0, l = specParts.length; i < l; i++) {
            var part = specParts[i];
            if (i !== 0) spec2 += ' ';
            if (part.charAt(0) !== '%') {
                spec2 += part;
            } else {
                inputIndex += 1;
                spec2 += "%'" + paramNames[inputIndex] + "'";
                inputs.appendChild(
                    el('input', {type: part}, defaultArgs[inputIndex])
                );
            }
        }

        this.lastBlockID += paramNames.length + 1; // accounts for a bug in Scratch
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
        if (script.children.length > 0) result.appendChild(script);
        return result;
    };

    function convertCustomBlockSpec (spec) {
        // Snap! escapes different characters in custom block specs than Scratch
        // does, so they have to be fixed. The fixed versions are cached so they
        // don't have to be found repeatedly.

        var argTypes = ['b', 'n', 's'];

        if (lib.customBlockSpecCache.hasOwnProperty(spec)) {
            return lib.customBlockSpecCache[spec];
        }

        var result = spec.split(' ');
        result.map(function (part) {
            if (part.charAt(0) === '%') { // argument
                if (argTypes.indexOf(part.slice(1)) > -1) return part;
                throw new Error('Invalid custom block argument type: ' + part);
            }
            return part.replace(/\\(.)/g, '$1').replace(/^[\\%$]/, '\\$&');
        });
        return result.join(' ');
    }

    // Shorthand for new ScriptableConverter(...).convert()

    ScriptableConverter.convert = function (data, s, isStage, varNames, callback) {
        try {
            var converter = new ScriptableConverter(data, s, isStage, varNames, callback);
            converter.convert();
        } catch (err) {
            callback(err);
        }
    };

    /* Variable and list conversion */

    function convertVariables (data, varNames) {
        var variables = data.variables;
        var lists = data.lists;
        var result = el('variables');
      	var i, l;
        if (variables) {
            for (i = 0, l = variables.length; i < l; i++) {
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

    function convertWatcher (watcher, s) {
        var result = el('watcher');
        if (watcher.cmd === 'getVar:') {
            if (watcher.target !== 'Stage') {
                result.setAttribute('scope', watcher.target);
            }
            result.setAttribute('var', watcher.param);
        } else {
            result.setAttribute('scope', watcher.target);
            var selector = lib.watchers[watcher.cmd];
            if (!selector) {
              s.warn('Unsupported watcher: ' + watcher.cmd);
              return null;
            }
            result.setAttribute('s', selector);
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
        if (!watcher.visible) {
            result.setAttribute('hidden', true);
        }
        return result;
    }

    function convertListWatcher (list, objName) {
        var result = el('watcher');
        if (objName !== 'Stage') {
            result.setAttribute('scope', objName);
        }
        result.setAttribute('var', list.listName);
        result.setAttribute('style', 'normal');
        result.setAttribute('x', list.x);
        result.setAttribute('y', list.y);
        result.setAttribute('color', '243,118,29'); // variable color
        result.setAttribute('extX', list.width);
        result.setAttribute('extY', list.height);
        if (!list.visible) {
            result.setAttribute('hidden', true);
        }
        return result;
    }

    /* Comment conversion */

    function convertComment (data) {
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

    /* Loop for async functions */

    function AsyncLoop (iterations, func, callback) {
        this.index = -1;
        this.done = false;
        this.iterations = iterations;
        this.func = func;
        this.callback = callback;
    }

    AsyncLoop.prototype.next = function () {
        if (this.done) return;
        this.index += 1;
        if (this.index < this.iterations) {
            this.func(this);
        } else {
            this.done = true;
            this.callback();
        }
    };

    AsyncLoop.loop = function (iterations, func, callback) {
        new AsyncLoop(iterations, func, callback).next();
    };

    /* Asset utilties */

    function getAsset (id, md5, zip) {
        var ext = md5.slice(md5.lastIndexOf('.') + 1);
        var fileName = id + '.' + ext;
        var file = zip.file(fileName);
        if (!file) throw new Error(fileName + ' does not exist');
        var string = '';
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
            string = svg.outerHTML;
            document.body.removeChild(div);
        } else {
            file = file.asUint8Array();
            for (var i = 0, l = file.length; i < l; i++) {
                string += String.fromCharCode(file[i]);
            }
        }
        var mimeType = lib.mimeTypes[ext];
        if (!mimeType) throw new Error('Unrecognized asset file type: ' + ext);
        return 'data:' + mimeType + ';base64,' + btoa(string);
    }

    function resizeImage (data, scale, callback) {
        var image = new Image();
        image.onload = function () {
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

    function addTextLayer (imageData, textData, callback) {
        var image = new Image();
        image.onload = function () {
            var text = new Image();
            text.onload = function () {
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

    function fixSVG (element) { // from phosphorus by Nathan Dinsmore
      	var i, l;

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
                for (i = 1, l = lines.length; i < l; i++) {
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

        for (i = 0, l = element.children.length; i < l; i++) {
            fixSVG(element.children[i]);
        }
    }

    /* Shorthand for creating XML elements */

    function el (tagName, attribs, content) {
        var element = document.createElementNS(null, tagName);
        if (attribs) {
            for (var key in attribs) {
                if (attribs.hasOwnProperty(key)) {
                    element.setAttribute(key, attribs[key]);
                }
            }
        }
        if (content != undefined) {
            if (content.constructor !== Array) content = [content];
            for (var i = 0, l = content.length; i < l; i++) {
                var c = content[i];
                element.appendChild(c instanceof Node ? c : new Text(c));
            }
        }
        return element;
    }

    /* Other stuff */

    function unusedName (name, used) {
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

    function convertColor (color) {
        var r = (color >> 16) & 0xff,
            g = (color >> 8) & 0xff,
            b = color & 0xff,
            a = (color >> 24) & 0xff;
        var result = r + ',' + g + ',' + b;
        if (a > 0 && a < 255) result += ',' + a / 255;
        return result;
    }
})();
