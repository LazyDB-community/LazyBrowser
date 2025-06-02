// users/uid/c = 200 (connected) 300 (AFK) 400 (disconnected)
// values of w = true (disk) false (event only)
class Database {

    constructor(addr, port, onconnect) {

        this.addr = addr;
        this.port = port;
        this.id = 0;

        //this.stripe = Stripe() || undefined;
        //this.stripe_data = undefined;

        this.callbacks = {};

        this.ws = new WebSocket("ws://" + addr + ":" + port);

        this.ws.onopen = e => onconnect(e);

        this.messageQueue = [];

        this.sendQueue = function (self){
            if(self.messageQueue.length > 0 && (self.ws.readyState === WebSocket.OPEN)){
                self.ws.send(self.messageQueue.join('|'));
            }
            self.messageQueue = [];
        };

        setInterval(this.sendQueue, 100, this);

        this.ws.onmessage = e => {
            let messages = e.data.split("|");

            for (let i = 0; i < messages.length; i++) {
                const msg = messages[i];
                let data = JSON.parse(msg);
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

        // TODO: Faire event onmessage constant
        // TODO: Setter infini avec le bind
    }

    send(name, args, fun = console.log) {
        const id =  ++this.id;
        let self = this;

        const message = JSON.stringify({
            'c': name,
            'id' :id,
            'a': args
        });

        if(message.includes("|")){
            alert("Vous ne pouvez pas utiliser de |")
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

    stripe_cancel(service = "subscription") {

        return this.send('stripe_cancel', {
            service
        });
    }

    stripe_update(price_id) {

        return this.send('stripe_update', {
            price_id
        });
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

    update_tasks() {

        return this.send('update_tasks', {});
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

    create_server(name = "", desc = "") {
        return this.send('create_server', {
            name,
            desc
        });
    }

    join_server(id) {
        return this.send('join_server', {
            id
        });
    }

    get_oauth2_uri(service,integration_name) {
        return this.send('get_oauth2_uri', {
            service
        });
    }

    generate_oauth2_token(service,integration_name,code) {
        return this.send('generate_oauth2_token', {
            service,
            integration_name,
            code
        });
    }

    create_event(args) {
        /*
            {
                "service": "Nom du service",
                "integration_name" : "nom de l'intÃ©gration",
                "event_name" : "Nom de l'event",
                "script_name" : "Nom du script"
            }
         */
        return this.send('create_event', args);
    }

    delete_event(args) {
        /*
            {
                "service": "Nom du service",
                "integration_name" : "nom de l'intÃ©gration",
                "event_name" : "Nom de l'event",
                "script_name" : "Nom du script"
            }
         */
        return this.send('delete_event', args);
    }

    /*init_stripe(el){
	    let self = this;
	    return new Promise((resolve, reject) => {
            self.stripe_data.elements = self.stripe.elements();
            self.stripe_data.cardElement = self.stripe_data.elements.create('card');
            self.stripe_data.cardElement.mount(el);
            self.stripe_data.cardElement.on('change', function(event) {
                if (event.complete) {
                    // enable payment button
                } else if (event.error) {
                    // show validation to customer
                }
            });
        });
    }*/

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
                return await this.send("watch", {
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

    open(name) {

        return this.send('open', {
            name
        });
    }

    exec(script_name,args = [], callback = (result) => {console.log(result)}) {
        return this.send('exec', {
            script_name,
            args
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

    set(keyPath, value) {

        keyPath = keyPath.split('/');
        //console.log(keyPath);
        return this.send('set', {
            keyPath,
            value
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
