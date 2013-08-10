/* 
 * ---------------------------------------- *
 * Simple HTML5 Audio Player                *
 * JavaScript                               *
 * v1.0.1-beta                              *
 * Matt O'Neill | www.matt-oneill.co.uk     *
 * ---------------------------------------- *
 */

(function ($) {
    var inc = 0;
    $.fn.audioPlayer = function (ext) {
        return this.each(function () {
            var aP = aP || {};
            aP = {
                $plr: null,
                aElem: null,
                elem: '<audio class="audio-component"><source src="' + ext.mp3Src + '" type="audio/mp3"><source src="' + ext.oggSrc + '" type="audio/ogg"></audio>' +
                      '<div class="loading">Loading <span class="loader"></span></div>' +
                      '<div class="controls">' +
                      '<span class="play"></span><span class="stop"></span>'+
                      '<div class="audio-progress"><div id="slider" class="audio-slider"><div class="ui-slider-handle"><span class="led"></span><span class="led on"></span><div class="time-display"><span class="elapsed">0:00</span><span class="duration">0:00</span><span class="arrow"></span></div></div><span class="buffered"></span></div></div>' +
                      '<div class="volume-controls"><span class="audio-mute"></span><div class="audio-vol"><div class="ui-slider-handle"><span class="led"></span><span class="led on"></span></div></div></div>' +
                      '<div class="info"><div class="track"><span></span><div class="now-playing"></div></div></div>' +
                      '</div>',
                s: {
                    SLDR_ANIM_DUR: 200,
                    defVol: 50,
                    pos: 0
                },
                init: function ($player) {
                    !!document.createElement('audio').canPlayType ? aP.dom($player) : aP.ex($player);
                },
                ex: function ($plr) {
                    $player.find(".loading").text(navigator.appName + " cannot play audio");
                },
                dom: function ($plr) {
                    $plr.append(this.elem);
                    this.$plr = $plr;
                    this.$plr.attr("data-aP", inc++);
                    this.aElem = aP.$plr.find(".audio-component")[0];
                    this.cntlr.lstnrs();
                },
                mdl: {
                    setDefaults: function () {
                        var ckeDef = aP.mdl.readCke();
                        if (ckeDef != undefined) {
                            aP.s.pos = ckeDef.pos;
                            aP.s.defVol = ckeDef.vol;
                            aP.mdl.setVol(aP.s.defVol);
                            aP.vw.cntTme(aP.mdl.toTme(aP.s.pos, aP.aElem.duration));
                        }
                        if (ext.autoPlay) {
                            aP.mdl.play();
                        }
                    },
                    play: function () {
                        this.tmeUpdt();
                        aP.aElem.play();
                    },
                    pause: function (st) {
                        aP.aElem.pause();
                    },
                    stop: function () {
                        aP.aElem.pause();
                        aP.aElem.currentTime = 0;
                        aP.vw.prog(0);
                        aP.s.pos = 0;
                        aP.mdl.ckeUpdte();
                    },
                    skPrgs: function (newPosition) {
                        aP.aElem.currentTime = aP.mdl.toTme(newPosition, aP.aElem.duration);
                        aP.s.pos = newPosition;
                        aP.vw.cntTme(aP.mdl.toTme(aP.s.pos, aP.aElem.duration));
                    },
                    setVol: function (val) {
                        aP.aElem.volume = aP.s.defVol = (val / 100);
                        aP.vw.vol(val);
                        aP.s.defVol = val;
                    },
                    mute: function () {
                        aP.aElem.muted = aP.vw.mte(aP.aElem.muted);
                        aP.mdl.ckeUpdte();
                    },
                    tmeUpdt: function () {
                        $(aP.aElem).on("timeupdate", function () {
                            aP.s.pos = parseInt(aP.mdl.pPer(this.currentTime, aP.aElem.duration));
                            aP.vw.prog(this.currentTime);
                        });
                    },
                    pTme: function (ms) {
                        var divisorForMinutes = ms % (60 * 60),
                            minutes = Math.floor(divisorForMinutes / 60),
                            divisorForSeconds = divisorForMinutes % 60,
                            seconds = Math.ceil(divisorForSeconds);
                        return (seconds < 10) ? minutes + ':0' + seconds : minutes + ':' + seconds;
                    },
                    toTme: function (percentage, duration) {
                        var percentageBase = percentage / 100;
                        return (duration * percentageBase);
                    },
                    pPer: function (of, total) {
                        return ((of / total) * 100) + "%";
                    },
                    readCke: function () {
                        cookies = [];
                        if (document.cookie) {
                            $(document.cookie.split(/; */)).each(function () {
                                var splitCookie = this.split('=');
                                var ck = new Cookie(splitCookie[0], splitCookie[1]);
                                cookies.push(ck);
                            });
                        } else {
                            return;
                        }
                        for (var i in cookies) {
                            if (cookies[i].name == "aP-" + aP.$plr.attr("data-aP")) {
                                return JSON.parse(cookies[i].value);
                            }
                        }
                    },
                    ckeUpdte: function () {
                        var plyrIndx = aP.$plr.attr("data-aP"),
                            aPcke = {
                                pos: aP.s.pos,
                                vol: aP.s.defVol
                            };
                        document.cookie = "aP-" + plyrIndx + "=" + JSON.stringify(aPcke);
                    },
                    gtInf: function () {
                        var nP = 'Now playing: "' + aP.aElem.currentSrc.split('/').pop().split('.')[0] + '"';
                        var info = { nP: nP }
                        return info;
                    }
                },
                vw: {
                    init: function () {
                        aP.$plr.children(".loading").fadeOut(250, function () {
                            aP.$plr.children(".controls").fadeIn(250);
                            aP.$plr.find(".now-playing").text(aP.mdl.gtInf().nP);
                        });
                    },
                    vol: function (val) {
                        var $adioElm = aP.$plr.find(".audio-vol");
                        $adioElm.children(".ui-slider-handle").css('left', val + "%");
                        $adioElm.children(".ui-slider-handle").children(".led.on").css("opacity", val / 100);
                        $adioElm.children(".ui-slider-range").css('width', val + "%");
                    },
                    prog: function (val) {
                        aP.vw.cntTme(val);
                        aP.$plr.find(".audio-slider").children(".ui-slider-handle").css('left', aP.mdl.pPer(val, aP.aElem.duration));
                        aP.$plr.find(".audio-progress").children(".ui-slider-range").css('width', aP.mdl.pPer(val, aP.aElem.duration));
                    },
                    cntTme: function (val) {
                        aP.$plr.find(".elapsed").text(aP.mdl.pTme(val));
                    },
                    dur: function (aElem) {
                        aP.$plr.find(".duration").text(aP.mdl.pTme(aP.aElem.duration));
                    },
                    mte: function (st) {
                        if (st) {
                            aP.$plr.find(".audio-mute").removeClass("muted");
                            aP.vw.vol(aP.s.defVol);
                            return false;
                        } else {
                            aP.$plr.find(".audio-mute").addClass("muted");
                            aP.vw.vol(0);
                            return true;
                        }
                    },
                    plyInctr: function (st) {
                        if (st) {
                            aP.$plr.find("span.play").addClass("playing");
                        } else {
                            aP.$plr.find("span.play").removeClass("playing");
                        }
                    }
                },
                cntlr: {
                    stcEv: function () {
                        var $ctrls = aP.$plr.find(".controls");
                        $ctrls.children(".play").on({
                            click: function () {
                                aP.aElem.paused ? aP.mdl.play() : aP.mdl.pause();
                                aP.mdl.ckeUpdte();
                            }
                        });
                        $ctrls.children(".stop").on({
                            click: function () {
                                aP.mdl.stop();
                            }
                        });
                        $ctrls.children(".volume-controls").children(".audio-mute").on({
                            click: function () {
                                aP.mdl.mute();
                            }
                        });
                        $ctrls.find(".audio-progress").slider({
                            range: "min",
                            animate: aP.s.SLDR_ANIM_DUR,
                            value: aP.s.pos,
                            create: function (ui) {
                                aP.mdl.skPrgs(aP.s.pos);
                            },
                            start: function () {
                                $(aP.aElem).off("timeupdate");
                            },
                            slide: function (event, ui) {
                                aP.mdl.skPrgs(ui.value);
                            },
                            stop: function () {
                                setTimeout(function () {
                                    aP.mdl.tmeUpdt();
                                    aP.mdl.ckeUpdte();
                                }, aP.s.SLDR_ANIM_DUR);
                            }
                        });
                        $ctrls.find(".audio-vol").slider({
                            range: "min",
                            value: aP.s.defVol,
                            start: function (event, ui) {
                            },
                            slide: function (event, ui) {
                                aP.mdl.setVol(ui.value);
                            },
                            stop: function () {
                                aP.mdl.ckeUpdte();
                            }
                        });
                    },
                    lstnrs: function () {
                        $(aP.aElem).on({
                            canplay: function () { // rdy
                                aP.mdl.setDefaults();
                                aP.cntlr.stcEv();
                                aP.vw.dur();
                                aP.vw.init();
                            },
                            volumechange: function () {
                            },
                            playing: function () {
                                aP.vw.plyInctr(true);
                            },
                            pause: function () {
                                aP.vw.plyInctr(false);
                            },
                            ended: function () {
                                aP.mdl.stop();
                            },
                            error: function () {
                                alert("An audio player error has occurred")
                            }
                        });
                    }
                }
            }
            aP.init($(this));
        });
    };
    var Cookie = function (name, value) { // constr
        this.name = name;
        this.value = value;
    }
})(jQuery);