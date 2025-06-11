                                                                                                                                   --
### ? How to Compile TypeScript in 3 Steps

**1. Install Node.js**
Download and install from [https://nodejs.org](https://nodejs.org)
Then check in terminal:

```bash
node -v
npm -v
```

---

**2. Install TypeScript globally**
Run in terminal:

```bash
npm install -g typescript
```

Check if it's installed:

```bash
tsc -v
```

---

**3. Compile your `.ts` file**
Navigate to your file's folder and run:

```bash
#tsc app.ts
tsc app.ts --lib ES2015,DOM
```

It will generate `app.js` in the same folder, which you can use in HTML.

---

```
npm install --save-dev typescript @types/node
npm install --save-dev serve
npm run build
npm start
```

