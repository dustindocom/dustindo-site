# Firebase setup (about 15 minutes, free Spark plan)

Do these in order. Nothing here needs a credit card.

1. **Create the project.** console.firebase.google.com → Add project (turn Google Analytics off). Stay on the Spark plan.
2. **Add the web app.** Project overview → the `</>` icon → register an app (skip Firebase Hosting). Copy the `firebaseConfig` values into `js/firebase-config.js` (replace `null` with the object shown in the comment). Commit it. These values are safe to publish.
3. **Turn on sign-in.** Build → Authentication → Get started → Sign-in method → enable **Anonymous** and **Email/Password**.
4. **Create the database.** Build → Firestore Database → Create database → Production mode → pick a region near you.
5. **Paste the rules.** Firestore → Rules → replace everything with the contents of `firebase/firestore.rules` → Publish.
6. **Create the admin login.** Authentication → Users → Add user.
   - Email: `djdustin@vabydd.users`
   - Password: your choice (6+ characters). This is the DJDustin password.
   - Copy the **User UID** shown for that user.
7. **Create three documents by hand** (Firestore → Start collection):
   - Collection `admins`, document ID = the UID from step 6, one field `active` (boolean) = true.
   - Collection `usernames`, document ID `djdustin`: `name` (string) `DJDustin`, `protected` (boolean) true, `ownerUid` (string) the UID, `premium` (boolean) true.
   - Document ID `guestdj` in `usernames`: `name` `GuestDJ`, `protected` false, `premium` false.
8. **Allow your site.** Authentication → Settings → Authorized domains → add `yourname.github.io`.
9. **Make sure charts exist.** Actions → Refresh charts → Run workflow (see README).
10. **Load the starter data.** Open `https://yourname.github.io/yourrepo/admin.html`, enter the DJDustin password, click **Check setup**, then **Load starter data**. This creates the 8 DJs (locked to your admin account), 14 premade MixTapes with real Apple songs, and the Home lists (6 Hot MixTapes, 8 DJs on the Rise).
11. **Try it.** Open the site, sign in with a new name, like a MixTape, create one, reload.

## How editing works
- A name with no password is open: anyone who signs in as that name can edit its MixTapes (Guest DJ is always like this).
- A name with a password is locked to its owner. The 8 starter DJs are locked to your admin account.
- Free names hold 12 songs per MixTape. Set `premium` to true on a `usernames` document to raise that name to 20.
- Only DJDustin can change `featured/home` (the Hot MixTapes and DJs on the Rise). Edit it in the console, or re-run "Load starter data".

## If something fails
- "The database refused that": the rules were not published, or a document from step 7 is missing.
- "This name is locked": the name already exists with a password.
- Sign-in does nothing: check step 3 and the authorized domain in step 8.
