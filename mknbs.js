const mknbs = {
    _ctx: null,
    bgm: {
        _gainNode: null,
        _abufBuf: [],
        _snodeBuf: [],
        set volume(v) { mknbs.bgm._gainNode.gain.value = v; },
        get volume() { return mknbs.bgm._gainNode.gain.value; },
        load(src, id) {
            return new Promise((resolve) => {
                let req = new XMLHttpRequest();
                req.open('GET', src);
                req.responseType = 'arraybuffer';
                req.addEventListener('load', () => {
                    mknbs._ctx.decodeAudioData(req.response, (buf) => {
                        mknbs.bgm._abufBuf[id] = buf;
                        resolve();
                    }, () => {
                        console.error(`mknbs.bgm.load: ID: ${id}, SRC: ${src}`);
                        resolve();
                    });
                });
                req.send();
            });
        },
        play(id) {
            if (!mknbs.bgm._abufBuf[id]) {
                console.error(`mknbs.bgm.play: ID: ${id}`);
                return;
            }
            if (mknbs.bgm._snodeBuf[id]) {
                mknbs.bgm.stop(id);
            }
            mknbs.bgm._snodeBuf[id] = mknbs._ctx.createBufferSource();
            mknbs.bgm._snodeBuf[id].buffer = mknbs.bgm._abufBuf[id];
            mknbs.bgm._snodeBuf[id].loop = false;
            mknbs.bgm._snodeBuf[id].connect(mknbs.bgm._gainNode);
            mknbs.bgm._snodeBuf[id].start();
        },
        loop(id) {
            if (!mknbs.bgm._abufBuf[id]) {
                console.error(`mknbs.bgm.play: ID: ${id}`);
                return;
            }
            if (mknbs.bgm._snodeBuf[id]) {
                mknbs.bgm.stop(id);
            }
            mknbs.bgm._snodeBuf[id] = mknbs._ctx.createBufferSource();
            mknbs.bgm._snodeBuf[id].buffer = mknbs.bgm._abufBuf[id];
            mknbs.bgm._snodeBuf[id].loop = true;
            mknbs.bgm._snodeBuf[id].connect(mknbs.bgm._gainNode);
            mknbs.bgm._snodeBuf[id].start();
        },
        stop(id) {
            if (!mknbs.bgm._snodeBuf[id]) {
                console.error(`mknbs.bgm.stop: (snode)ID: ${id}`);
                return;
            }
            mknbs.bgm._snodeBuf[id].stop();
            delete mknbs.bgm._snodeBuf[id];
        }
    },
    se: {
        _gainNode: null,
        _abufBuf: [],
        set volume(v) { mknbs.se._gainNode.gain.value = v; },
        get volume() { return mknbs.se._gainNode.gain.value; },
        load(src, id) {
            return new Promise((resolve) => {
                let req = new XMLHttpRequest();
                req.open('GET', src);
                req.responseType = 'arraybuffer';
                req.addEventListener('load', () => {
                    mknbs._ctx.decodeAudioData(req.response, (buf) => {
                        mknbs.se._abufBuf[id] = buf;
                        resolve();
                    }, () => {
                        console.error(`mknbs.se.load: ID: ${id}, SRC: ${src}`);
                        resolve();
                    });
                });
                req.send();
            });
        },
        play(id) {
            if (!mknbs.se._abufBuf[id]) {
                console.error(`mknbs.se.play: ID: ${id}`);
                return;
            }
            let srcNode = mknbs._ctx.createBufferSource();
            srcNode.buffer = mknbs.se._abufBuf[id];
            srcNode.connect(mknbs.se._gainNode);
            srcNode.start();
        },
    },
    init() {
        mknbs._ctx = new (window.AudioContext || window.webkitAudioContext)();
        mknbs.bgm._gainNode = mknbs._ctx.createGain();
        mknbs.bgm._gainNode.connect(mknbs._ctx.destination);
        mknbs.se._gainNode = mknbs._ctx.createGain();
        mknbs.se._gainNode.connect(mknbs._ctx.destination);
    }
};
