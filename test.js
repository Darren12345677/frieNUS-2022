const assert = require('assert');
var firebase = require('@firebase/testing');

const MY_PROJECT_ID = "frienus-3a43d";


describe("Not logged in", () => {
    // it("Understands basic addition", () => {
    //     assert.equal(2+2, 4);
    // })

    let db = firebase.initializeTestApp({projectId: MY_PROJECT_ID,}).firestore();
    const UsersRef = db.collection("Users");
    const testDoc = db.collection("Users").doc("testDoc");

    it("Cannnot read items in Users", async () => {
        await firebase.assertFails(testDoc.get());
    })

    it("Cannot write items in Users", async () => {
        await firebase.assertFails(testDoc.set({id: "test_ID"}));
    })

    it("Cannot add items in Users", async () => {
        await firebase.assertFails(UsersRef.add({id: "testDoc2"}));
    })

    it("Cannot delete items in Users", async () => {
        await firebase.assertFails(testDoc.delete());
    })
})

describe("Logged in as current user", () => {
    const my_ID = "user_abc";
    const myAuth = { uid: my_ID };
    let db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth:myAuth}).firestore();
    const UsersRef = db.collection("Users");

    //myself
    const myDoc = db.collection("Users").doc(my_ID);
    const myModules = myDoc.collection("Modules");

    it("Can read my items in Users", async () => {
        await firebase.assertSucceeds(myDoc.get());
    })

    it("Can write my items in Users", async () => {
        await firebase.assertSucceeds(myDoc.set({id: "test_ID"}));
    })

    it("Can add items in myself", async () => {
        await firebase.assertSucceeds(myModules.add({id: "testModule"}));
    })

    it("Can delete my document in Users", async () => {
        await firebase.assertSucceeds(myDoc.delete());
    })

    //others
    const other_ID = "user_123"
    const otherDoc = db.collection("Users").doc(other_ID);
    const otherModules = otherDoc.collection("Modules");
    const otherFriends = otherDoc.collection("Friends");
    const me = otherFriends.doc(my_ID);
    const otherMessagesWithMe = me.collection("Messages");


    it("Can read others items in Users", async () => {
        await firebase.assertSucceeds(otherDoc.get());
    })

    it("Can write others items in Users", async () => {
        await firebase.assertSucceeds(otherDoc.set({id: "test_ID"}));
    })

    it("Can add items in others", async () => {
        await firebase.assertSucceeds(otherModules.add({id: "testModule"}));
    })

    it("Cannot delete others document in Users", async () => {
        await firebase.assertFails(otherDoc.delete());
    })

    it("Can write messages to others documents", async () => {
        await firebase.assertSucceeds(otherMessagesWithMe.add({desc: "Hello fool", sender: my_ID, creation:1000}));
    })
})