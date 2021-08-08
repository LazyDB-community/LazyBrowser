// users/uid/c = 200 (connected) 300 (AFK) 400 (disconnected)
// values of w = true (disk) false (event only)


class Database {

    constructor(addr, port, onconnect = (e) => {console.log("LazyDB is ready!")}, onclose = (e) => {console.log("LazyDB server lost!")}, secure = true) {

        this.addr = addr;
        this.port = port;
        this.id = 0;

        this.lazy_sep = "\t\n\'lazy_sep\'\t\n";

        this.callbacks = {};

        let sec = "";

        if(secure){
            sec += "s"
        }

        this.ws = new WebSocket("ws" + sec + "://" + addr + ":" + port);

        this.ws.onopen = e => onconnect(e);

        this.ws.onclose = e => onclose(e);

        this.messageQueue = [];

        this.sendQueue = function (self){
            if(self.messageQueue.length > 0 && (self.ws.readyState === WebSocket.OPEN)){
                self.ws.send(self.messageQueue.join('|'));
                self.messageQueue = [];
            }

        };

        setInterval(this.sendQueue, 100, this);

        this.ws.onmessage = e => {
            let messages = e.data.split("|");

            for (let i = 0; i < messages.length; i++) {
                const msg = messages[i];
                let data = this.msg_to_js(msg);
                //console.log(data);

                if (data.s) {

                    this.callbacks[data.id].resolve(data.r);

                } else {

                    this.callbacks[data.id].reject(data.r);
                }

                if(!this.callbacks[data.id].sync){
                    delete this.callbacks[data.id];
                }else{
                    this.callbacks[data.id].sync(data.r);
                }
            }

        };
    }

    msg_to_js(msg){
         return JSON.parse(msg.replaceAll(this.lazy_sep, "|"))
    }

    js_to_msg(data){
        const msg = JSON.stringify(data);
        return msg.replaceAll("|",this.lazy_sep);
    }

    send(name, args, fun = console.log) {
        const id =  ++this.id;
        let self = this;

        const message = this.js_to_msg({
            'c': name,
            'id' :id,
            'a': args
        })

        if(message.includes("|")){
            alert("You can't use | characters!")
            return false
        }


        let callback = new Promise((resolve, reject) => {

            //console.log('Commande envoyÃ©e: ' + name);
            if(!self.callbacks[id]){
                self.callbacks[id] = {};
            }
            self.callbacks[id].resolve = resolve;
            self.callbacks[id].reject = reject;

            if(name === "get" || name === "on" || name === "watch" || name === "size" || name === "sort"){
                //console.log(fun);
                self.callbacks[id].sync = fun;
            }

        });

        this.messageQueue.push(message);

        return callback;
    }

    forgot_password(email = "") {
        return this.send('forgot_password', {
            email
        });
    }

    edit_password(code, password, email = ""){
        return this.send('edit_password', {
            code,
            password,
            email
        });
    }

    connect(email, password) {

        return this.send('connect', {
            email,
            password
        });
    }

    register(email,password,username,full_name = "" ) {

        return this.send('register', {
            email,
            username,
            full_name,
            password
        });
    }

    create(keyPath, value = {}, w = true) {
        keyPath = keyPath.split('/');
        return this.send('create', {
            keyPath,
            value,
            w
        });
    }

    append(keyPath, value = {}) {
        keyPath = keyPath.split('/');
        return this.send('append', {
            keyPath,
            value
        });
    }

    on(command, keyPath){
        return {
            then: async fn => {
                keyPath = keyPath.split('/');
                //console.log(keyPath);
                return await this.send("on", {
                    keyPath,
                    command
                }, fn);
            }
        };
    }



    watch(command, keyPath){
        return {
            then: async fn => {
                keyPath = keyPath.split('/');
                //console.log(keyPath);
                return this.send("watch", {
                    keyPath,
                    command
                }, fn);
            }
        };
    }

    ping(command, keyPath){
        return {
            then: async fn => {
                keyPath = keyPath.split('/');
                //console.log(keyPath);
                return await this.send("on", {
                    keyPath,
                    command
                }, fn);
            }
        };
    }

    stop(event, command, keyPath) {
        keyPath = keyPath.split('/');
        return this.send('stop', {
            event,
            command,
            keyPath
        });
    }

    size(keyPath){
        return {
            then: async fn => {
                keyPath = keyPath.split('/');
                //console.log(keyPath);
                return await this.send("size", {
                    keyPath
                }, fn);
            }
        };
    }

    sort(keyPath,split = {char: "_", num: 1},result = {count: 10, start: 0, order: "asc"}, order = "asc"){
        return {
            then: async fn => {
                keyPath = keyPath.split('/');
                //console.log(keyPath);
                return await this.send("sort", {
                    keyPath,
                    split,
                    result,
                    order
                }, fn);
            }
        };
    }



    get(keyPath) {

        keyPath = keyPath.split('/');
        const link = false;
        //console.log(keyPath);
        return this.send('get', {
            keyPath
        });

    }

    exist(keyPath) {
        keyPath = keyPath.split('/');
        return this.send('exist', {
            keyPath
        });

    }

    update(keyPath, value, w = true) {

        keyPath = keyPath.split('/');
        //console.log(keyPath);
        return this.send('update', {
            keyPath,
            value,
            w
        });
    }

    delete(keyPath) {

        keyPath = keyPath.split('/');

        return this.send('delete', {
            keyPath
        });
    }

    keys(keyPath, filter = "all") {

        keyPath = keyPath.split('/');

        return this.send('keys', {
            keyPath,
            filter
        });
    }
}
