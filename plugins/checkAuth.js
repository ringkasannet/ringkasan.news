// function observeFirebaseAuth(f) {

//     let handlers=[]

//     function subscribe(){
//         handlres
//     }
//     this.$fire.auth.onAuthStateChanged((user) => {
//       if (user) {
//         this.authorized = true;
//         console.log("user logged in:" + user);
//       } else {
//         this.authorized = false;
//         console.log("no user");
//       }
//     });
//   }




export default ({ app }, inject) => {

    function authFunction() {
        let handlers = []

        this.subscribe = function (fn, t) {
            handlers.push({ fn, t })
        }

        this.unsubscribe = function (fn, t) {
            console.log('unsubscribe'+fn)
            handlers = handlers.filter(
                function (item) {
                    if (item !== { fn, t }) {
                        return item;
                    }
                }
            );
        }

        app.$fire.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user logged in:" + user);
                fire(true)
            } else {
                console.log("no user");
                fire(false)
            }
        })

        const fire = function (au) {
            handlers.forEach((item) => {
                item.fn.call(item.t, au)
            })

        }



    }

    const checkAuth = new authFunction()
    // Inject $hello(msg) in Vue, context and store.
    inject('checkAuth', checkAuth)
}

