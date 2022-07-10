

const assert = require('assert');
const firebase = require('@firebase/rules-unit-testing');

// let testEnv = await initializeTestEnvironment({
//     projectId: "randomproject-ba40e",
//     firestore: {
//         rules: fstat.readFileSync("firestore.rules", "utf8"),
//     },
// });

const MY_PROJECT_ID = "randomproject-ba40e";


describe("frieNUS", () => {
    it("Understands basic addition", () => {
        assert.equal(2+2, 4);
    })

    it("Can read items in the Users collection", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        const testDoc = db.collection("Users").doc("testDoc");
        await firebase.assertSucceeds(testDoc.get());
    })
})