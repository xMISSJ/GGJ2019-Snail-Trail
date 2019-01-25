### Boilerplate for 2d messenger projects

#### 1) Create a new playable project
1. Create a new folder and empty GIT repository (<code>mkdir some-project</code>, <code>cd some-project</code>, <code>git init</code>.)
2. Run <code>git remote add boilerplate git@github.com:cloudgamesbv/boilerplate-messenger-phaser.git </code>
3. Run <code>git remote set-url --push boilerplate no_push</code>
4. Run <code>git fetch boilerplate master</code>
5. Run <code>git checkout -b boilerplate boilerplate/master</code>
6. Run <code>git checkout master</code>
7. Run <code>npm install</code>

### 2) Install node.js and npm:

https://nodejs.org/en/

### 3) Install dependencies

Navigate to the cloned repo’s directory.

Run:

`npm install`

### 4.1) Testing on the facebook testing environment

https://developers.facebook.com/docs/games/instant-games/test-publish-share#testing

If there are already key files in the root (key.pem and cert.pem), skip these steps. Try to run it on the test environment.

Install the http-server package via npm

`npm install -g http-server`

Create a private key and a certificate via openssl. This is necessary to run the secure local server. 
This is only required if you don't have the key files in the root of the project folder.

```
openssl genrsa 2048 > key.pem
openssl req -x509 -days 1000 -new -key key.pem -out cert.pem 
```

Run the game from localhost with SSL. Once the key and certificate are ready, you can serve from localhost using SSL.

Terminal 1: Run `npm run dev`

Terminal 2: Run `http-server --ssl -c-1`

Running the embedded player from your browser. Replace the game id with the correct app id.

`https://www.facebook.com/embed/instantgames/YOUR_GAME_ID/player?game_url=https://localhost:8080`

Note: You can only test if you uploaded a new build to facebook and fill in all requirements.

### 4.2) Run the development server:

Run:

`npm run dev`

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser

### 4.3) Build for deployment:

Run: `npm run deploy`

This will optimize and minimize the compiled bundle.

### 4.4) Build for facebook:
 
Run: `npm run facebook`

### 5) Phaser version
The default phaser version is **phaser-ce v2.11.0**, which is the latest version of the community edition. If you want to use an older version, use **phaser v2.6.2**. It has a better performance, but less features.
Adjust the following scripts.
1. `package.json` => replace the line `"phaser-ce": "^2.11.0",` with `"phaser": "^2.6.2",`.
2. Run `npm install`.
3. `webpack.config.js` => replace all `phaser-ce` with `phaser`.
4. `webpack.production.config.js` => replace all `phaser-ce` with `phaser`.
5. Test the game by running `npm run dev`



