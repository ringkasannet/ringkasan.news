
export default ({ app }, inject) => {


    function ringkasanFunction() {

        // get ringkasan article only once
        this.getRingkasanOnce = async function (slug) {
            let docRef, docData
            const articlesRef = app.$fire.firestore.collection("articles")
            const docSnapshot = await articlesRef
                .where("slug", "==", slug)
                .limit(1)
                .get()
            try {
                if (!docSnapshot.empty) {
                    docSnapshot.forEach(doc => {
                        if (doc.exists) {
                            docRef = doc.ref
                            docData = doc.data()
                            console.log(docData)
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
            return ({ ref: docRef, data: docData })

        }

        this.getSlugs=async function(){
            let slugs=[]
            const articlesRef = app.$fire.firestore.collection("articles")
            try{
                const snapshots=await articlesRef.get()
                snapshots.forEach(doc=>{
                    const d=doc.data()
                    slugs.push(d.slug)
                })
            } catch(error) {
                console.log(error)
            }
            return slugs
        }


        this.getRingkasanRealtime = function (slug, f, t) {
            let docRef, docData
            const articlesRef = app.$fire.firestore.collection("articles")
            const query = articlesRef
                .where("slug", "==", slug)
                .limit(1)
            const observer = query.onSnapshot((docSnapshots) => {
                if (!docSnapshots.empty) {
                    docSnapshots.forEach(doc => {
                        if (doc.exists) {
                            docRef = doc.ref
                            docData = doc.data()
                            // console.log(f,t,docRef,docData)
                            f.call(t, { ref: docRef, data: docData })
                        }
                    })
                }
            })
        }


        this.getUpdatesOnce - function (slug) {
        };

        this.getObjFromObserver = function (o) {
            return JSON.parse(JSON.stringify(o));
        },

            this.getArticleRef = async function (slug) {
                let parentRef=null;
                const articlesRef = app.$fire.firestore.collection("articles")
                const docSnapshots = await articlesRef
                    .where("slug", "==", slug)
                    .limit(1).get()
                console.log(docSnapshots)
                if (!docSnapshots.empty) {
                    docSnapshots.forEach(docSnapshot => {
                        parentRef = docSnapshot.ref
                    })
                } 
                return parentRef
            }

        this.getUpdatesRealtime = async function (slug, f, t) {
            let parentRef
            try {
                const articlesRef = app.$fire.firestore.collection("articles")
                const docSnapshots = await articlesRef
                    .where("slug", "==", slug)
                    .limit(1).get()
                if (!docSnapshots.empty) {
                    docSnapshots.forEach(docSnapshot => {
                        parentRef = docSnapshot.ref

                        const updateRef = parentRef.collection("updates").orderBy("time", "desc")

                        const observer = updateRef.onSnapshot(updateSnapshot => {
                            let updates = []
                            if (!updateSnapshot.empty) {
                                console.log("size of snapshot: " + updateSnapshot.size)
                                updateSnapshot.forEach(doc => {
                                    let d = doc.data()
                                    d.id = doc.ref.id
                                    d.ref = doc.ref
                                    d.parentRef = parentRef
                                    updates.push(d)
                                })
                                f.call(t, { updates: updates, parentRef: parentRef })
                            }
                        })
                    })
                }
            } catch (error) {
                console.log(error)
            }

        }

        this.getLatestUpdateRealtime = async function (slug, f, t) {
            let parentRef
            const articlesRef = app.$fire.firestore.collection("articles")
            const docSnapshots = await articlesRef
                .where("slug", "==", slug)
                .limit(1).get()
            if (!docSnapshots.empty) {
                docSnapshots.forEach(docSnapshot => {
                    const parentRef = docSnapshot.ref
                    const updateRef = parentRef.collection("updates").orderBy("time", "desc").limit(1)
                    const observer = updateRef.onSnapshot(updateSnapshot => {
                        let updates = []
                        if (!updateSnapshot.empty) {
                            console.log("size of snapshot: " + updateSnapshot.size)
                            updateSnapshot.forEach(doc => {
                                let d = doc.data()
                                d.id = doc.ref.id
                                d.ref = doc.ref
                                d.parentRef = parentRef
                                updates = d
                            })
                            f.call(t, updates)
                        }
                    })
                })
            }


        }



    }

    const ringkasan = new ringkasanFunction()

    inject('ringkasan', ringkasan)
}